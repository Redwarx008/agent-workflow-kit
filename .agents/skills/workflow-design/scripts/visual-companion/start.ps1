[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectRoot,

    [string]$HostName = '127.0.0.1',

    [string]$UrlHost,

    [ValidateRange(1, 35791)]
    [int]$IdleTimeoutMinutes = 240,

    [switch]$Open
)

$ErrorActionPreference = 'Stop'

function Set-PrivateTextFile {
    param([string]$Path, [string]$Value)
    [IO.File]::WriteAllText($Path, $Value + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
}

$resolvedRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$toolRoot = $PSScriptRoot
$serverPath = Join-Path $toolRoot 'server.cjs'
$runtimeRoot = Join-Path $resolvedRoot 'workflow\.local\visual'
$sessionId = '{0}-{1}-{2}' -f $PID, [DateTimeOffset]::UtcNow.ToUnixTimeSeconds(), ([Guid]::NewGuid().ToString('N').Substring(0, 8))
$sessionDir = Join-Path $runtimeRoot $sessionId
$contentDir = Join-Path $sessionDir 'content'
$stateDir = Join-Path $sessionDir 'state'
$pidFile = Join-Path $stateDir 'server.pid'
$instanceFile = Join-Path $stateDir 'server-instance-id'
$logFile = Join-Path $stateDir 'server.log'
$errorLogFile = Join-Path $stateDir 'server.err.log'
$infoFile = Join-Path $stateDir 'server-info'

[IO.Directory]::CreateDirectory($contentDir) | Out-Null
[IO.Directory]::CreateDirectory($stateDir) | Out-Null

$serverId = [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(24)).ToLowerInvariant()
Set-PrivateTextFile -Path $instanceFile -Value $serverId

if ([string]::IsNullOrWhiteSpace($UrlHost)) {
    $UrlHost = if ($HostName -in @('127.0.0.1', 'localhost')) { 'localhost' } else { $HostName }
}

$node = Get-Command node -ErrorAction Stop
$environmentNames = @(
    'BRAINSTORM_DIR', 'BRAINSTORM_HOST', 'BRAINSTORM_URL_HOST',
    'BRAINSTORM_OWNER_PID', 'BRAINSTORM_PORT_FILE', 'BRAINSTORM_TOKEN_FILE',
    'BRAINSTORM_IDLE_TIMEOUT_MS', 'BRAINSTORM_OPEN'
)
$previousEnvironment = @{}
foreach ($name in $environmentNames) {
    $previousEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}

try {
    $env:BRAINSTORM_DIR = $sessionDir
    $env:BRAINSTORM_HOST = $HostName
    $env:BRAINSTORM_URL_HOST = $UrlHost
    $env:BRAINSTORM_OWNER_PID = ''
    $env:BRAINSTORM_PORT_FILE = Join-Path $runtimeRoot '.last-port'
    $env:BRAINSTORM_TOKEN_FILE = Join-Path $runtimeRoot '.last-token'
    $env:BRAINSTORM_IDLE_TIMEOUT_MS = [string]($IdleTimeoutMinutes * 60 * 1000)
    $env:BRAINSTORM_OPEN = if ($Open) { '1' } else { $null }

    $quotedServerPath = '"' + $serverPath + '"'
    $process = Start-Process -FilePath $node.Source `
        -ArgumentList @($quotedServerPath, "--brainstorm-server-id=$serverId") `
        -RedirectStandardOutput $logFile `
        -RedirectStandardError $errorLogFile `
        -WindowStyle Hidden `
        -PassThru

    Set-PrivateTextFile -Path $pidFile -Value ([string]$process.Id)

    $deadline = [DateTime]::UtcNow.AddSeconds(8)
    while ([DateTime]::UtcNow -lt $deadline) {
        if (Test-Path -LiteralPath $infoFile) {
            $info = Get-Content -Raw -LiteralPath $infoFile
            Write-Output $info.TrimEnd()
            return
        }
        if ($process.HasExited) {
            $details = if (Test-Path -LiteralPath $errorLogFile) { Get-Content -Raw -LiteralPath $errorLogFile } else { '' }
            throw "Visual Companion exited during startup. $details"
        }
        Start-Sleep -Milliseconds 100
        $process.Refresh()
    }

    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    throw 'Visual Companion did not publish server-info within 8 seconds.'
}
finally {
    foreach ($name in $environmentNames) {
        [Environment]::SetEnvironmentVariable($name, $previousEnvironment[$name], 'Process')
    }
}
