@echo off
echo Building K3 Language Interpreter...

REM Detect compiler
where g++ >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using g++ compiler
    g++ -std=c++17 -O3 -march=native -o k3.exe k3.cpp -lpthread
) else (
    where cl >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Using MSVC compiler
        cl /EHsc /O2 /std:c++17 /Fe:k3.exe k3.cpp
    ) else (
        echo Error: No C++ compiler found. Please install g++ or MSVC.
        exit /b 1
    )
)

if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    echo K3 Language Interpreter built at: k3.exe
) else (
    echo Build failed!
    exit /b 1
)