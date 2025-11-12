@echo off
echo ========================================
echo Mental Health Companion - Setup Script
echo ========================================
echo.

echo [1/4] Checking Python installation...
python --version
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo [2/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    echo Try running: pip install --upgrade pip
    pause
    exit /b 1
)
echo.

echo [3/4] Running migrations...
cd mental_health_companion
python manage.py migrate
if errorlevel 1 (
    echo Error: Failed to run migrations
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo To start the server, run:
echo   run_server.bat
echo.
echo Then open http://localhost:8000 in your browser
echo ========================================
echo.
pause
