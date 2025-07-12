@echo off
echo Building K2 Turbo Interpreter...

REM Detect compiler
where g++ >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using g++ compiler
    g++ -std=c++17 -O3 -march=native -o k2_turbo.exe k2_turbo.cpp -lpthread
) else (
    where cl >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Using MSVC compiler
        cl /EHsc /O2 /std:c++17 /Fe:k2_turbo.exe k2_turbo.cpp
    ) else (
        echo Error: No C++ compiler found. Please install g++ or MSVC.
        exit /b 1
    )
)

if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    echo K2 Turbo Interpreter built at: k2_turbo.exe
) else (
    echo Build failed!
    exit /b 1
)