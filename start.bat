@echo off
REM ========================================
REM HuParfum - Start Project Script
REM Starts both Backend and Frontend servers
REM ========================================


REM Set the project root directory
cd /d "%~dp0"

REM Colors and formatting
setlocal enabledelayedexpansion

echo [*] Checking prerequisites...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo [ERROR] Backend directory not found
    pause
    exit /b 1
)

echo [OK] Backend directory found
echo.

REM Check if frontend directory exists
if not exist "frontend" (
    echo [ERROR] Frontend directory not found
    pause
    exit /b 1
)

echo [OK] Frontend directory found
echo.

echo ========================================
echo Starting HuParfum Services...
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server (Port 5001)...
echo.
cd backend
start cmd /k "npm start"
echo [OK] Backend server starting in new window...
echo.

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend Server
cd ..
echo [2/2] Starting Frontend Server (Port 3002)...
echo.
cd frontend
start cmd /k "npm start"
echo [OK] Frontend server starting in new window...
echo.

echo ========================================
echo Services Starting...
echo ========================================
echo.
echo [✓] Backend:  http://localhost:5001
echo [✓] Frontend: http://localhost:3002
echo [✓] Admin:    http://localhost:3002/admin/login
echo.
echo Default Admin Credentials:
echo   Email:    admin@huparfum.com
echo   Password: admin123
echo.
echo [*] Waiting for services to initialize...
echo [*] This may take 30-60 seconds...
echo.

REM Wait for services to be ready
timeout /t 10 /nobreak

REM Open browser
echo [*] Opening application in default browser...
start http://localhost:3002

echo.
echo ========================================
echo [✓] HuParfum is Ready!
echo ========================================
echo.
echo Frontend:  http://localhost:3002
echo API:       http://localhost:5001/api/
echo Admin:     http://localhost:3002/admin/login
echo.
echo Press any key to close this window...
pause

endlocal
