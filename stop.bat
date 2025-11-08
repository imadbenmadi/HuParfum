@echo off
REM ========================================
REM HuParfum - Stop All Services Script
REM ========================================

echo.
echo ╔════════════════════════════════════════════════╗
echo ║  Stopping HuParfum Services...                 ║
echo ╚════════════════════════════════════════════════╝
echo.

echo Searching for Node.js processes...
echo.

REM Kill all Node.js processes
tasklist | find /I "node.exe" >nul
if %errorlevel% equ 0 (
    echo [*] Found Node.js processes running
    echo [*] Terminating all Node.js processes...
    taskkill /IM node.exe /F >nul 2>nul
    echo [OK] All Node.js processes terminated
) else (
    echo [INFO] No Node.js processes found
)

echo.
echo ========================================
echo Services Stopped
echo ========================================
echo.
echo To restart, run: start.bat
echo.
pause
