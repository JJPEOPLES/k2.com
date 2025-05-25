#!/bin/bash

# Script to run the K2 language website using Flask

# Set the working directory to the script's directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is required but not installed. Please install pip3."
    exit 1
fi

# Check if virtual environment exists, if not create one
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Check if the CSS directory exists
if [ ! -d "css" ]; then
    echo "Error: css directory not found. Make sure you're running this script from the website directory."
    exit 1
fi

# Check if the JS directory exists
if [ ! -d "js" ]; then
    echo "Error: js directory not found. Make sure you're running this script from the website directory."
    exit 1
fi

# Run the Flask application
echo "Starting K2 Language website..."
echo "Server running at http://127.0.0.1:5000"
echo "Press Ctrl+C to stop the server"

# Run Flask with the correct working directory
FLASK_APP=app.py FLASK_DEBUG=1 python app.py