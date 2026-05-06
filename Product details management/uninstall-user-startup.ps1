<#
Removes the Startup shortcut created by install-user-startup.ps1
#>

$startup = [Environment]::GetFolderPath('Startup')
$linkPath = Join-Path $startup 'ProductDetailsManagement Server.lnk'

if (Test-Path $linkPath) {
    try {
        Remove-Item $linkPath -ErrorAction Stop
        Write-Host "Removed startup shortcut: $linkPath" -ForegroundColor Green
    } catch {
        Write-Host "Failed to remove startup shortcut: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Startup shortcut not found: $linkPath" -ForegroundColor Yellow
}
