#!/bin/bash

echo "Building K2 Turbo Interpreter..."

# Detect compiler
if command -v g++ &> /dev/null; then
    echo "Using g++ compiler"
    g++ -std=c++17 -O3 -march=native -o k2_turbo k2_turbo.cpp -lpthread
elif command -v clang++ &> /dev/null; then
    echo "Using clang++ compiler"
    clang++ -std=c++17 -O3 -march=native -o k2_turbo k2_turbo.cpp -lpthread
else
    echo "Error: No C++ compiler found. Please install g++ or clang++."
    exit 1
fi

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "K2 Turbo Interpreter built at: k2_turbo"
    chmod +x k2_turbo
else
    echo "Build failed!"
    exit 1
fi