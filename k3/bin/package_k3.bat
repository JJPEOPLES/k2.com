@echo off
echo Creating K3 distribution packages...

:: Create temporary directory structure
set "TEMP_DIR=k3_package_temp"
if exist "%TEMP_DIR%" rmdir /S /Q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"
mkdir "%TEMP_DIR%\bin"
mkdir "%TEMP_DIR%\lib"
mkdir "%TEMP_DIR%\examples"
mkdir "%TEMP_DIR%\docs"

:: Copy files
echo Copying files...

:: Copy binaries
copy "k3.exe" "%TEMP_DIR%\bin\"
copy "install_k3_windows.bat" "%TEMP_DIR%\"

:: Copy examples
copy "..\examples\*.k3" "%TEMP_DIR%\examples\" 2>nul
if %errorlevel% neq 0 echo No examples found.

:: Copy documentation
copy "..\docs\*.md" "%TEMP_DIR%\docs\" 2>nul
if %errorlevel% neq 0 echo No documentation found.
copy "..\docs\*.html" "%TEMP_DIR%\docs\" 2>nul

:: Create license and readme
echo # K3 Language > "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo K3 is a modern, high-performance programming language designed for building everything from system utilities to web applications. >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo ## Installation >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo Run `install_k3_windows.bat` as administrator to install K3. >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo ## Documentation >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo See the `docs` directory for documentation. >> "%TEMP_DIR%\readme.md"

echo MIT License > "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo Copyright (c) 2025 K3 Language Team >> "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo Permission is hereby granted, free of charge, to any person obtaining a copy >> "%TEMP_DIR%\license.txt"
echo of this software and associated documentation files (the "Software"), to deal >> "%TEMP_DIR%\license.txt"
echo in the Software without restriction, including without limitation the rights >> "%TEMP_DIR%\license.txt"
echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell >> "%TEMP_DIR%\license.txt"
echo copies of the Software, and to permit persons to whom the Software is >> "%TEMP_DIR%\license.txt"
echo furnished to do so, subject to the following conditions: >> "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo The above copyright notice and this permission notice shall be included in all >> "%TEMP_DIR%\license.txt"
echo copies or substantial portions of the Software. >> "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR >> "%TEMP_DIR%\license.txt"
echo IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, >> "%TEMP_DIR%\license.txt"
echo FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE >> "%TEMP_DIR%\license.txt"
echo AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER >> "%TEMP_DIR%\license.txt"
echo LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, >> "%TEMP_DIR%\license.txt"
echo OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE >> "%TEMP_DIR%\license.txt"
echo SOFTWARE. >> "%TEMP_DIR%\license.txt"

:: Create ZIP file
echo Creating ZIP file...
powershell -Command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '..\downloads\k3-1.0.0-windows-x64.zip' -Force"

:: Clean up
echo Cleaning up...
rmdir /S /Q "%TEMP_DIR%"

echo Done! K3 Windows package created: ..\downloads\k3-1.0.0-windows-x64.zip

:: Create Linux package structure
set "TEMP_DIR=k3_linux_package_temp"
if exist "%TEMP_DIR%" rmdir /S /Q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"
mkdir "%TEMP_DIR%\bin"
mkdir "%TEMP_DIR%\lib"
mkdir "%TEMP_DIR%\examples"
mkdir "%TEMP_DIR%\docs"

:: Copy Linux files
echo Copying Linux files...

:: Copy install script
copy "install_k3_linux.sh" "%TEMP_DIR%\"
copy "build_k3.sh" "%TEMP_DIR%\bin\"
copy "k3.cpp" "%TEMP_DIR%\bin\"

:: Copy examples
copy "..\examples\*.k3" "%TEMP_DIR%\examples\" 2>nul

:: Copy documentation
copy "..\docs\*.md" "%TEMP_DIR%\docs\" 2>nul
copy "..\docs\*.html" "%TEMP_DIR%\docs\" 2>nul

:: Create license and readme
echo # K3 Language > "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo K3 is a modern, high-performance programming language designed for building everything from system utilities to web applications. >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo ## Installation >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo 1. Build K3: `cd bin && ./build_k3.sh` >> "%TEMP_DIR%\readme.md"
echo 2. Install K3: `sudo ./install_k3_linux.sh` >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo ## Documentation >> "%TEMP_DIR%\readme.md"
echo. >> "%TEMP_DIR%\readme.md"
echo See the `docs` directory for documentation. >> "%TEMP_DIR%\readme.md"

echo MIT License > "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo Copyright (c) 2025 K3 Language Team >> "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo Permission is hereby granted, free of charge, to any person obtaining a copy >> "%TEMP_DIR%\license.txt"
echo of this software and associated documentation files (the "Software"), to deal >> "%TEMP_DIR%\license.txt"
echo in the Software without restriction, including without limitation the rights >> "%TEMP_DIR%\license.txt"
echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell >> "%TEMP_DIR%\license.txt"
echo copies of the Software, and to permit persons to whom the Software is >> "%TEMP_DIR%\license.txt"
echo furnished to do so, subject to the following conditions: >> "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo The above copyright notice and this permission notice shall be included in all >> "%TEMP_DIR%\license.txt"
echo copies or substantial portions of the Software. >> "%TEMP_DIR%\license.txt"
echo. >> "%TEMP_DIR%\license.txt"
echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR >> "%TEMP_DIR%\license.txt"
echo IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, >> "%TEMP_DIR%\license.txt"
echo FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE >> "%TEMP_DIR%\license.txt"
echo AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER >> "%TEMP_DIR%\license.txt"
echo LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, >> "%TEMP_DIR%\license.txt"
echo OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE >> "%TEMP_DIR%\license.txt"
echo SOFTWARE. >> "%TEMP_DIR%\license.txt"

:: Create Linux ZIP file
echo Creating Linux package...
powershell -Command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '..\downloads\k3-1.0.0-linux-x64.tar.gz' -Force"

:: Clean up
echo Cleaning up...
rmdir /S /Q "%TEMP_DIR%"

echo Done! K3 Linux package created: ..\downloads\k3-1.0.0-linux-x64.tar.gz

echo All K3 packages created successfully!