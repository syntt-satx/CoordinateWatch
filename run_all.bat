@echo off
title CoordinateWatch AI - Launch All
cd /d "%~dp0"
echo ============================================================
echo Launching CoordinateWatch AI Intelligence Platform
echo ============================================================
echo [1/2] Launching Backend on http://localhost:8000 ...
start "CoordinateWatch Backend" "%~dp0start_backend.bat"

echo [2/2] Launching Frontend on http://localhost:5173 ...
start "CoordinateWatch Frontend" "%~dp0start_frontend.bat"

echo.
echo All services launched in separate windows!
echo Open your browser at: http://localhost:5173
echo.
pause
