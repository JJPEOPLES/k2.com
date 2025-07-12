@echo off
echo Building K2 Installer...

:: Check if NSIS is installed
where makensis >nul 2>&1
if %errorlevel% neq 0 (
    echo NSIS is not installed or not in PATH.
    echo Please install NSIS from https://nsis.sourceforge.io/Download
    exit /b 1
)

:: Build the installer
makensis k2_installer.nsi

if %errorlevel% equ 0 (
    echo Installer built successfully!
    echo Output: K2_Language_Setup_2.0.0.exe
) else (
    echo Failed to build installer.
)

pause