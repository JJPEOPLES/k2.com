#!/usr/bin/env python3
"""
Simple script to run the K2 language website using Flask without needing a virtual environment.
Just run: python3 run_simple.py
"""

import os
import sys
import webbrowser
from threading import Timer

# Check if Flask is installed
try:
    from flask import Flask
except ImportError:
    print("Flask is not installed. Installing Flask...")
    os.system(f"{sys.executable} -m pip install flask")
    print("Flask installed successfully.")
    from flask import Flask

# Import the app from app.py
try:
    from app import app
except ImportError:
    print("Error: Could not import app from app.py")
    print("Make sure you're running this script from the website directory.")
    sys.exit(1)

def open_browser():
    """Open the browser to the Flask app."""
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == '__main__':
    print("K2 Language Website")
    print("===================")
    print("Server running at http://127.0.0.1:5000")
    print("Opening browser automatically...")
    print("Press Ctrl+C to stop the server")
    
    # Open browser after a short delay
    Timer(1.5, open_browser).start()
    
    # Run the Flask app
    app.run(debug=True, port=5000)