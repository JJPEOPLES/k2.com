#!/bin/bash

echo "Building K3 Language Interpreter..."

# Detect compiler
if command -v g++ &> /dev/null; then
    echo "Using g++ compiler"
    g++ -std=c++17 -O3 -march=native -o k3 k3.cpp -lpthread
elif command -v clang++ &> /dev/null; then
    echo "Using clang++ compiler"
    clang++ -std=c++17 -O3 -march=native -o k3 k3.cpp -lpthread
else
    echo "Error: No C++ compiler found. Please install g++ or clang++."
    exit 1
fi

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "K3 Language Interpreter built at: k3"
    chmod +x k3
else
    echo "Build failed!"
    exit 1
fi