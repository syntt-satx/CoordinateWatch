@echo off
title CoordinateWatch AI - Backend Server
cd /d "%~dp0backend"
echo ============================================================
echo Starting CoordinateWatch AI FastAPI Backend (Port 8000)
echo Working Directory: %CD%
echo ============================================================
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    python generate_data.py
) else (
    call venv\Scripts\activate
)
uvicorn main:app --reload --port 8000
pause
