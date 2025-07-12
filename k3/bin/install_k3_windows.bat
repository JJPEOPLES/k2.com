@echo off
setlocal enabledelayedexpansion

echo K3 Language Installer for Windows
echo ================================
echo.

:: Check for admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This installer requires administrator privileges.
    echo Please right-click on this file and select "Run as administrator".
    echo.
    pause
    exit /b 1
)

:: Set installation directory
set "INSTALL_DIR=C:\Program Files\K3"
echo Installation directory: %INSTALL_DIR%
echo.

:: Create installation directory
if not exist "%INSTALL_DIR%" (
    echo Creating installation directory...
    mkdir "%INSTALL_DIR%"
    if !errorlevel! neq 0 (
        echo Failed to create installation directory.
        pause
        exit /b 1
    )
)

:: Create subdirectories
if not exist "%INSTALL_DIR%\bin" mkdir "%INSTALL_DIR%\bin"
if not exist "%INSTALL_DIR%\lib" mkdir "%INSTALL_DIR%\lib"
if not exist "%INSTALL_DIR%\examples" mkdir "%INSTALL_DIR%\examples"
if not exist "%INSTALL_DIR%\docs" mkdir "%INSTALL_DIR%\docs"

:: Copy K3 binary
echo Copying K3 binary...
copy /Y "k3.exe" "%INSTALL_DIR%\bin\"

:: Copy K3 libraries
echo Copying K3 libraries...
copy /Y "..\lib\*.k3" "%INSTALL_DIR%\lib\" 2>nul
if %errorlevel% neq 0 echo No libraries found.

:: Copy examples
echo Copying examples...
copy /Y "..\examples\*.k3" "%INSTALL_DIR%\examples\" 2>nul
if %errorlevel% neq 0 echo No examples found.

:: Copy documentation
echo Copying documentation...
copy /Y "..\docs\*.md" "%INSTALL_DIR%\docs\" 2>nul
if %errorlevel% neq 0 echo No documentation found.
copy /Y "..\docs\*.html" "%INSTALL_DIR%\docs\" 2>nul

:: Create license and readme
echo Creating license and readme...
copy /Y "..\license.txt" "%INSTALL_DIR%\" 2>nul
if %errorlevel% neq 0 echo No license found.
copy /Y "..\readme.md" "%INSTALL_DIR%\" 2>nul
if %errorlevel% neq 0 echo No readme found.

:: Add to PATH
echo Adding K3 to PATH...
setx /M PATH "%PATH%;%INSTALL_DIR%\bin"

:: Create Start Menu shortcuts
echo Creating Start Menu shortcuts...
set "STARTMENU_DIR=%PROGRAMDATA%\Microsoft\Windows\Start Menu\Programs\K3 Language"
if not exist "%STARTMENU_DIR%" mkdir "%STARTMENU_DIR%"

:: Create shortcut to K3 Command Prompt
echo @echo off > "%INSTALL_DIR%\k3_cmd.bat"
echo title K3 Command Prompt >> "%INSTALL_DIR%\k3_cmd.bat"
echo cd /d "%INSTALL_DIR%" >> "%INSTALL_DIR%\k3_cmd.bat"
echo echo K3 Language >> "%INSTALL_DIR%\k3_cmd.bat"
echo echo Type 'k3 --help' for more information. >> "%INSTALL_DIR%\k3_cmd.bat"
echo cmd /k >> "%INSTALL_DIR%\k3_cmd.bat"

:: Create shortcuts
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU_DIR%\K3 Command Prompt.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\k3_cmd.bat'; $Shortcut.Save()"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU_DIR%\K3 Documentation.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\docs\index.html'; $Shortcut.Save()"

:: Create uninstaller
echo Creating uninstaller...
echo @echo off > "%INSTALL_DIR%\uninstall.bat"
echo echo K3 Language Uninstaller >> "%INSTALL_DIR%\uninstall.bat"
echo echo ====================== >> "%INSTALL_DIR%\uninstall.bat"
echo echo. >> "%INSTALL_DIR%\uninstall.bat"
echo echo Removing K3 from PATH... >> "%INSTALL_DIR%\uninstall.bat"
echo setx /M PATH "%%PATH:%INSTALL_DIR%\bin;=%%"  >> "%INSTALL_DIR%\uninstall.bat"
echo echo Removing Start Menu shortcuts... >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%STARTMENU_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo echo Removing K3 files... >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%INSTALL_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo echo K3 has been uninstalled. >> "%INSTALL_DIR%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\uninstall.bat"

:: Create uninstaller shortcut
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU_DIR%\Uninstall K3.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\uninstall.bat'; $Shortcut.Save()"

echo.
echo Installation completed successfully!
echo.
echo K3 has been installed to: %INSTALL_DIR%
echo.
echo You can now run K3 from the command line by typing 'k3'.
echo.
echo Press any key to exit...
pause > nul