@echo off
setlocal enabledelayedexpansion
set PATH=C:\nodejs\node-v20.10.0-win-x64;C:\nodejs\node-v20.10.0-win-x64\bin;%PATH%
cd /d "C:\trungtt\PhotoPortfolio"

echo.
echo Starting Next.js dev server...
echo.

REM Start npm dev in background
start "" cmd /k "npm run dev"

REM Wait for server to start
timeout /t 6 /nobreak

REM Run tests
echo.
echo Running comprehensive test suite...
echo.
node test-complete-system.js

pause
