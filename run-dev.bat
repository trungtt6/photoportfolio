@echo off
set PATH=C:\nodejs\node-v20.10.0-win-x64;C:\nodejs\node-v20.10.0-win-x64\bin;%PATH%
set NEXT_TELEMETRY_DISABLED=1
cd /d "C:\trungtt\PhotoPortfolio"
call npm.cmd run dev
