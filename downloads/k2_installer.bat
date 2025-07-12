@echo off
setlocal enabledelayedexpansion

echo K2 Programming Language Installer
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
set "INSTALL_DIR=C:\Program Files\K2"
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

:: Extract files from the installer package
echo Extracting files...
echo.

:: Copy K2 binaries
echo Copying K2 binaries...
copy /Y "bin\k2.exe" "%INSTALL_DIR%\bin\"
copy /Y "bin\k2_turbo.exe" "%INSTALL_DIR%\bin\"
copy /Y "bin\k2gui.dll" "%INSTALL_DIR%\bin\"
copy /Y "bin\k2gui_helper.dll" "%INSTALL_DIR%\bin\"

:: Copy K2 libraries
echo Copying K2 libraries...
copy /Y "lib\k2gui.k2" "%INSTALL_DIR%\lib\"
copy /Y "lib\k2gui_simple.k2" "%INSTALL_DIR%\lib\"

:: Copy examples
echo Copying examples...
copy /Y "examples\*.k2" "%INSTALL_DIR%\examples\"

:: Copy documentation
echo Copying documentation...
copy /Y "docs\*.md" "%INSTALL_DIR%\docs\"
copy /Y "docs\*.html" "%INSTALL_DIR%\docs\"

:: Create license and readme
echo Creating license and readme...
copy /Y "license.txt" "%INSTALL_DIR%\"
copy /Y "readme.md" "%INSTALL_DIR%\"

:: Add to PATH
echo Adding K2 to PATH...
setx /M PATH "%PATH%;%INSTALL_DIR%\bin"

:: Create Start Menu shortcuts
echo Creating Start Menu shortcuts...
set "STARTMENU_DIR=%PROGRAMDATA%\Microsoft\Windows\Start Menu\Programs\K2 Language"
if not exist "%STARTMENU_DIR%" mkdir "%STARTMENU_DIR%"

:: Create shortcut to K2 Command Prompt
echo @echo off > "%INSTALL_DIR%\k2_cmd.bat"
echo title K2 Command Prompt >> "%INSTALL_DIR%\k2_cmd.bat"
echo cd /d "%INSTALL_DIR%" >> "%INSTALL_DIR%\k2_cmd.bat"
echo echo K2 Programming Language >> "%INSTALL_DIR%\k2_cmd.bat"
echo echo Type 'k2 --help' for more information. >> "%INSTALL_DIR%\k2_cmd.bat"
echo cmd /k >> "%INSTALL_DIR%\k2_cmd.bat"

:: Create shortcuts
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU_DIR%\K2 Command Prompt.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\k2_cmd.bat'; $Shortcut.Save()"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU_DIR%\K2 Documentation.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\docs\index.html'; $Shortcut.Save()"

:: Create uninstaller
echo Creating uninstaller...
echo @echo off > "%INSTALL_DIR%\uninstall.bat"
echo echo K2 Programming Language Uninstaller >> "%INSTALL_DIR%\uninstall.bat"
echo echo ================================== >> "%INSTALL_DIR%\uninstall.bat"
echo echo. >> "%INSTALL_DIR%\uninstall.bat"
echo echo Removing K2 from PATH... >> "%INSTALL_DIR%\uninstall.bat"
echo setx /M PATH "%%PATH:%INSTALL_DIR%\bin;=%%"  >> "%INSTALL_DIR%\uninstall.bat"
echo echo Removing Start Menu shortcuts... >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%STARTMENU_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo echo Removing K2 files... >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%INSTALL_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo echo K2 has been uninstalled. >> "%INSTALL_DIR%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\uninstall.bat"

:: Create uninstaller shortcut
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU_DIR%\Uninstall K2.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\uninstall.bat'; $Shortcut.Save()"

echo.
echo Installation completed successfully!
echo.
echo K2 has been installed to: %INSTALL_DIR%
echo.
echo You can now run K2 from the command line by typing 'k2'.
echo.
echo Press any key to exit...
pause > nul