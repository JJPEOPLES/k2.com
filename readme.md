# K2 Language Website

This is the official website for the K2 programming language, an ultra-fast language with execution times between 70 nanoseconds and 9 milliseconds.

## Running the Website Locally

There are two ways to run the website locally:

### Option 1: Using Flask (Recommended)

1. Make sure you have Python 3 and pip installed
2. Run the provided script:

```bash
./run_website.sh
```

This will:
- Create a virtual environment if it doesn't exist
- Install the required dependencies
- Start the Flask development server

The website will be available at http://127.0.0.1:5000

### Option 2: Using a Simple HTTP Server

If you don't want to use Flask, you can use Python's built-in HTTP server:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

The website will be available at http://localhost:8000

## Website Structure

- `index.html` - Main HTML file
- `css/styles.css` - CSS styles
- `js/script.js` - JavaScript functionality
- `images/` - Website images and assets
- `downloads/` - Downloadable files (binaries, examples, documentation)
- `legal/` - Legal pages (privacy policy, terms of use)
- `app.py` - Flask application for serving the website
- `requirements.txt` - Python dependencies for the Flask application

## Download Files

The website includes several downloadable files:

- `downloads/k2` - K2 language binary
- `downloads/k2-language_1.0.0-1_amd64.deb` - Debian package
- `downloads/k2-documentation.pdf` - Documentation in PDF format
- `downloads/k2-examples.zip` - Example K2 programs
- `downloads/install.sh` - Installation script
- `downloads/LICENSE.txt` - License file

## Customization

To customize the website:

1. Edit `index.html` to update the main content
2. Modify `css/styles.css` to change the styling
3. Update `js/script.js` to modify the interactive elements
4. Replace files in the `downloads/` directory with your actual files

## Deployment

The website can be deployed to various platforms:

- **GitHub Pages**: Upload the entire website directory to a GitHub repository and enable GitHub Pages
- **Netlify**: Connect your GitHub repository to Netlify for automatic deployment
- **Vercel**: Similar to Netlify, connect your repository for automatic deployment
- **Traditional Hosting**: Upload the files to any web hosting service

## Browser Compatibility

The website is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)