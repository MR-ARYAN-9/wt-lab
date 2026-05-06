@echo off
cd /d %~dp0
if exist "C:\xampp\php\php.exe" (
  "C:\xampp\php\php.exe" -S 127.0.0.1:8000
) else (
  php -S 127.0.0.1:8000
)
pause
