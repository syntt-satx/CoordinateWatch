@echo off
title CoordinateWatch AI - Frontend Server
cd /d "%~dp0frontend"
echo ============================================================
echo Starting CoordinateWatch AI React / Vite Frontend (Port 5173)
echo Working Directory: %CD%
echo ============================================================
if not exist node_modules (
    echo Installing node dependencies...
    npm install
)
npm run dev
pause
