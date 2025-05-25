#!/bin/bash

# K2 Language Website Deployment Script

# Check if a deployment method is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [github|netlify|vercel|local]"
    exit 1
fi

DEPLOY_METHOD=$1
WEBSITE_DIR=$(pwd)

case $DEPLOY_METHOD in
    github)
        echo "Deploying to GitHub Pages..."
        
        # Check if git is installed
        if ! command -v git &> /dev/null; then
            echo "Error: git is not installed. Please install git first."
            exit 1
        }
        
        # Initialize git repository if not already
        if [ ! -d ".git" ]; then
            git init
            git checkout -b main
        fi
        
        # Add all files
        git add .
        
        # Commit changes
        echo "Enter commit message:"
        read commit_message
        git commit -m "$commit_message"
        
        # Create gh-pages branch if it doesn't exist
        if ! git show-ref --verify --quiet refs/heads/gh-pages; then
            git checkout -b gh-pages
        else
            git checkout gh-pages
            git merge main -m "Merge main into gh-pages"
        fi
        
        echo "Now push to GitHub with:"
        echo "git remote add origin https://github.com/yourusername/k2-language-website.git"
        echo "git push -u origin gh-pages"
        ;;
        
    netlify)
        echo "Preparing for Netlify deployment..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "Netlify CLI is not installed. Would you like to install it? (y/n)"
            read install_netlify
            
            if [ "$install_netlify" = "y" ]; then
                npm install -g netlify-cli
            else
                echo "Please install Netlify CLI manually and try again."
                exit 1
            fi
        fi
        
        # Create netlify.toml configuration file
        cat > netlify.toml << EOF
[build]
  publish = "."
  command = "echo 'No build command needed for static site'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
        
        echo "Configuration complete. Deploy with:"
        echo "netlify deploy"
        ;;
        
    vercel)
        echo "Preparing for Vercel deployment..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Vercel CLI is not installed. Would you like to install it? (y/n)"
            read install_vercel
            
            if [ "$install_vercel" = "y" ]; then
                npm install -g vercel
            else
                echo "Please install Vercel CLI manually and try again."
                exit 1
            fi
        fi
        
        # Create vercel.json configuration file
        cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    { "src": "**/*", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
EOF
        
        echo "Configuration complete. Deploy with:"
        echo "vercel"
        ;;
        
    local)
        echo "Starting local web server..."
        
        # Check if Python is installed
        if command -v python3 &> /dev/null; then
            echo "Starting server at http://localhost:8000"
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            echo "Starting server at http://localhost:8000"
            python -m http.server 8000
        else
            echo "Python is not installed. Using Node.js http-server if available."
            
            if command -v npx &> /dev/null; then
                echo "Starting server with http-server"
                npx http-server -p 8000
            else
                echo "Neither Python nor Node.js is available. Please install one of them to run a local server."
                exit 1
            fi
        fi
        ;;
        
    *)
        echo "Unknown deployment method: $DEPLOY_METHOD"
        echo "Available methods: github, netlify, vercel, local"
        exit 1
        ;;
esac