@echo off
echo ========================================
echo Mental Health Companion - Quick Start
echo ========================================
echo.
echo Installing dependencies...
pip install Django djangorestframework python-dotenv openai
echo.
echo Running migrations...
cd mental_health_companion
python manage.py migrate
echo.
echo Starting server...
python manage.py runserver
