$ErrorActionPreference = 'Stop'

$toolRoot = Split-Path -Parent $PSScriptRoot
$startScript = Join-Path $toolRoot 'start.ps1'
$stopScript = Join-Path $toolRoot 'stop.ps1'
$testRoot = Join-Path ([IO.Path]::GetTempPath()) ('agent-workflow-pwsh-' + [Guid]::NewGuid().ToString('N'))
$passed = 0
$failed = 0

function Pass([string]$Name) {
    $script:passed++
    Write-Host "  PASS: $Name"
}

function Fail([string]$Name, [string]$Details) {
    $script:failed++
    Write-Host "  FAIL: $Name"
    Write-Host "    $Details"
}

try {
    [IO.Directory]::CreateDirectory($testRoot) | Out-Null

    $tokens = $null
    $errors = $null
    [Management.Automation.Language.Parser]::ParseFile($startScript, [ref]$tokens, [ref]$errors) | Out-Null
    if ($errors.Count -eq 0) { Pass 'start.ps1 parses cleanly' } else { Fail 'start.ps1 parses cleanly' ($errors -join '; ') }
    $tokens = $null
    $errors = $null
    [Management.Automation.Language.Parser]::ParseFile($stopScript, [ref]$tokens, [ref]$errors) | Out-Null
    if ($errors.Count -eq 0) { Pass 'stop.ps1 parses cleanly' } else { Fail 'stop.ps1 parses cleanly' ($errors -join '; ') }

    $startOutput = & $startScript -ProjectRoot $testRoot -IdleTimeoutMinutes 5 2>&1 | Out-String
    $start = [pscustomobject]@{ ExitCode = 0; Output = $startOutput.Trim() }
    $info = $null
    try { $info = $start.Output | ConvertFrom-Json } catch {}
    if ($start.ExitCode -eq 0 -and $null -ne $info -and $info.type -eq 'server-started') {
        Pass 'start.ps1 returns server-started JSON'
    } else {
        Fail 'start.ps1 returns server-started JSON' "exit=$($start.ExitCode) output=$($start.Output)"
    }

    if ($null -ne $info -and $info.session_dir -like (Join-Path $testRoot 'workflow\.local\visual\*')) {
        Pass 'start.ps1 stores session under workflow/.local/visual'
    } else {
        Fail 'start.ps1 stores session under workflow/.local/visual' "session_dir=$($info.session_dir)"
    }

    if ($null -ne $info) {
        $pidFile = Join-Path $info.state_dir 'server.pid'
        $serverPid = [int](Get-Content -Raw -LiteralPath $pidFile)
        $stopOutput = & $stopScript -SessionDir $info.session_dir 2>&1 | Out-String
        $stop = [pscustomobject]@{ ExitCode = 0; Output = $stopOutput.Trim() }
        $stopResult = $null
        try { $stopResult = $stop.Output | ConvertFrom-Json } catch {}
        if ($stop.ExitCode -eq 0 -and $stopResult.status -eq 'stopped' -and -not (Get-Process -Id $serverPid -ErrorAction SilentlyContinue)) {
            Pass 'stop.ps1 proves ownership and stops the real server'
        } else {
            Fail 'stop.ps1 proves ownership and stops the real server' "exit=$($stop.ExitCode) output=$($stop.Output) pid=$serverPid"
            Stop-Process -Id $serverPid -Force -ErrorAction SilentlyContinue
        }
    }

    $staleSession = Join-Path $testRoot 'stale-session'
    $staleState = Join-Path $staleSession 'state'
    [IO.Directory]::CreateDirectory($staleState) | Out-Null
    $impostor = Start-Process -FilePath (Get-Command node).Source -ArgumentList @('-e', 'setInterval(()=>{},1000)') -WindowStyle Hidden -PassThru
    Start-Sleep -Milliseconds 200
    $impostor.Refresh()
    if ($impostor.HasExited) { throw 'Test setup failed: impostor Node process exited before stop.ps1 ran.' }
    [IO.File]::WriteAllText((Join-Path $staleState 'server.pid'), [string]$impostor.Id)
    [IO.File]::WriteAllText((Join-Path $staleState 'server-instance-id'), ('a' * 48))
    $staleOutput = & $stopScript -SessionDir $staleSession 2>&1 | Out-String
    $staleStop = [pscustomobject]@{ ExitCode = 0; Output = $staleOutput.Trim() }
    $staleResult = $null
    try { $staleResult = $staleStop.Output | ConvertFrom-Json } catch {}
    $impostor.Refresh()
    if ($staleStop.ExitCode -eq 0 -and $staleResult.status -eq 'stale_pid' -and -not $impostor.HasExited) {
        Pass 'stop.ps1 fails closed for an unrelated PID'
    } else {
        Fail 'stop.ps1 fails closed for an unrelated PID' "exit=$($staleStop.ExitCode) output=$($staleStop.Output) alive=$(-not $impostor.HasExited)"
    }
    Stop-Process -Id $impostor.Id -Force -ErrorAction SilentlyContinue
}
finally {
    Get-ChildItem -LiteralPath $testRoot -Filter server.pid -File -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
        $value = 0
        if ([int]::TryParse((Get-Content -Raw -LiteralPath $_.FullName).Trim(), [ref]$value)) {
            Stop-Process -Id $value -Force -ErrorAction SilentlyContinue
        }
    }
    Remove-Item -LiteralPath $testRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "--- Results: $passed passed, $failed failed ---"
if ($failed -gt 0) { exit 1 }
