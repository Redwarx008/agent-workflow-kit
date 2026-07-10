[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SessionDir
)

$ErrorActionPreference = 'Stop'

function Write-Result {
    param([hashtable]$Value)
    Write-Output ($Value | ConvertTo-Json -Compress)
}

function Mark-Stopped {
    param([string]$StateDir, [string]$Reason)
    $infoFile = Join-Path $StateDir 'server-info'
    if (Test-Path -LiteralPath $infoFile) { Remove-Item -LiteralPath $infoFile -Force }
    $value = @{ reason = $Reason; timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() } | ConvertTo-Json -Compress
    [IO.File]::WriteAllText((Join-Path $StateDir 'server-stopped'), $value + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
}

$resolvedSession = (Resolve-Path -LiteralPath $SessionDir).Path
$stateDir = Join-Path $resolvedSession 'state'
$pidFile = Join-Path $stateDir 'server.pid'
$instanceFile = Join-Path $stateDir 'server-instance-id'

if (-not (Test-Path -LiteralPath $pidFile)) {
    Write-Result @{ status = 'not_running' }
    return
}

$pidText = (Get-Content -Raw -LiteralPath $pidFile).Trim()
$serverId = if (Test-Path -LiteralPath $instanceFile) { (Get-Content -Raw -LiteralPath $instanceFile).Trim() } else { '' }
$pidValue = 0
$metadataValid = [int]::TryParse($pidText, [ref]$pidValue) -and $pidValue -gt 0 -and $serverId -match '^[A-Za-z0-9_-]{32,64}$'
$owned = $false

if ($metadataValid) {
    $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $pidValue" -ErrorAction SilentlyContinue
    if ($null -ne $processInfo -and -not [string]::IsNullOrWhiteSpace($processInfo.CommandLine)) {
        $escapedId = [Regex]::Escape("--brainstorm-server-id=$serverId")
        $instancePattern = '(?:^|\s)"?{0}"?(?:\s|$)' -f $escapedId
        $owned = $processInfo.CommandLine -match $instancePattern
    }
}

if (-not $owned) {
    Remove-Item -LiteralPath $pidFile, $instanceFile -Force -ErrorAction SilentlyContinue
    Mark-Stopped -StateDir $stateDir -Reason 'stale_pid'
    Write-Result @{ status = 'stale_pid' }
    return
}

Stop-Process -Id $pidValue -ErrorAction SilentlyContinue
$deadline = [DateTime]::UtcNow.AddSeconds(2)
while ([DateTime]::UtcNow -lt $deadline -and (Get-Process -Id $pidValue -ErrorAction SilentlyContinue)) {
    Start-Sleep -Milliseconds 100
}

if (Get-Process -Id $pidValue -ErrorAction SilentlyContinue) {
    Stop-Process -Id $pidValue -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 100
}

if (Get-Process -Id $pidValue -ErrorAction SilentlyContinue) {
    Write-Result @{ status = 'failed'; error = 'process still running' }
    throw 'Visual Companion process is still running after forced stop.'
}

Remove-Item -LiteralPath $pidFile, $instanceFile -Force -ErrorAction SilentlyContinue
Mark-Stopped -StateDir $stateDir -Reason 'stop.ps1'
Write-Result @{ status = 'stopped' }
