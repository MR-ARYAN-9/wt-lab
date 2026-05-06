
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$php = Get-Command php -ErrorAction SilentlyContinue
if ((-not $php) -and (Test-Path 'C:\xampp\php\php.exe')) {
    $php = 'C:\xampp\php\php.exe'
}

if (-not $php) {
    Write-Host 'PHP executable not found. Install PHP or use XAMPP/WAMP and ensure php.exe is on PATH.' -ForegroundColor Red
    exit 1
}

Write-Host "Starting PHP built-in server at http://127.0.0.1:8000 using $php"
& $php -S 127.0.0.1:8000
