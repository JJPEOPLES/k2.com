@echo off
echo Creating K2 Installer ZIP package...

:: Create temporary directory structure
set "TEMP_DIR=k2_installer_temp"
if exist "%TEMP_DIR%" rmdir /S /Q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"
mkdir "%TEMP_DIR%\bin"
mkdir "%TEMP_DIR%\lib"
mkdir "%TEMP_DIR%\examples"
mkdir "%TEMP_DIR%\docs"

:: Copy files
echo Copying files...

:: Copy binaries
copy "..\bin\k2.exe" "%TEMP_DIR%\bin\"
copy "..\bin\k2_turbo.exe" "%TEMP_DIR%\bin\"
copy "..\bin\k2gui.dll" "%TEMP_DIR%\bin\"
copy "..\bin\k2gui_helper.dll" "%TEMP_DIR%\bin\"

:: Copy libraries
copy "..\lib\k2gui.k2" "%TEMP_DIR%\lib\"
copy "..\lib\k2gui_simple.k2" "%TEMP_DIR%\lib\"

:: Copy examples
copy "..\examples\*.k2" "%TEMP_DIR%\examples\"

:: Copy documentation
copy "..\docs\*.md" "%TEMP_DIR%\docs\"
copy "..\docs\*.html" "%TEMP_DIR%\docs\"

:: Copy installer and other files
copy "k2_installer.bat" "%TEMP_DIR%\"
copy "..\license.txt" "%TEMP_DIR%\"
copy "..\readme.md" "%TEMP_DIR%\"

:: Create ZIP file
echo Creating ZIP file...
powershell -Command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath 'k2_installer.zip' -Force"

:: Clean up
echo Cleaning up...
rmdir /S /Q "%TEMP_DIR%"

echo Done! K2 Installer ZIP package created: k2_installer.zip