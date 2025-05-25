#!/usr/bin/env python3
"""
Flask application to serve the K2 language website.
This allows you to view the website locally using Flask's development server.
"""

from flask import Flask, send_from_directory, render_template_string, redirect, url_for, abort
import os
import mimetypes

# Ensure proper MIME types are registered
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('image/svg+xml', '.svg')

# Create Flask app with the current directory as the static folder
app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def index():
    """Serve the main index.html page."""
    return send_from_directory('.', 'index.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    """Explicitly serve CSS files with the correct MIME type."""
    return send_from_directory('css', filename, mimetype='text/css')

@app.route('/js/<path:filename>')
def serve_js(filename):
    """Explicitly serve JavaScript files with the correct MIME type."""
    return send_from_directory('js', filename, mimetype='application/javascript')

@app.route('/images/<path:filename>')
def serve_images(filename):
    """Serve image files."""
    return send_from_directory('images', filename)

@app.route('/legal/<path:filename>')
def serve_legal(filename):
    """Serve legal pages."""
    return send_from_directory('legal', filename)

@app.route('/downloads/<path:filename>')
def download_file(filename):
    """Serve files from the downloads directory."""
    # For PDF files, don't force download but open in browser
    if filename.endswith('.pdf'):
        return send_from_directory('downloads', filename, as_attachment=False, mimetype='application/pdf')
    else:
        return send_from_directory('downloads', filename, as_attachment=True)

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve other static files from the website directory."""
    if os.path.exists(os.path.join('.', filename)):
        return send_from_directory('.', filename)
    else:
        abort(404)

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors by serving the custom 404 page."""
    if os.path.exists('404.html'):
        return send_from_directory('.', '404.html'), 404
    else:
        # Fallback 404 page if 404.html doesn't exist
        return render_template_string("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found | K2 Language</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #1e293b;
                    background-color: #f8fafc;
                    margin: 0;
                    padding: 0;
                }
                header {
                    background-color: white;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 1rem 2rem;
                }
                .logo h1 {
                    font-size: 2rem;
                    margin: 0;
                    color: #2563eb;
                }
                .tagline {
                    font-size: 0.9rem;
                    color: #64748b;
                }
                .error-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 80vh;
                    text-align: center;
                    padding: 2rem;
                }
                .error-code {
                    font-size: 8rem;
                    font-weight: bold;
                    color: #2563eb;
                    margin-bottom: 1rem;
                    line-height: 1;
                }
                .error-message {
                    font-size: 2rem;
                    margin-bottom: 2rem;
                }
                .home-link {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: #2563eb;
                    color: white;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                }
                .home-link:hover {
                    background-color: #1d4ed8;
                }
                footer {
                    text-align: center;
                    padding: 1rem;
                    background-color: #1e293b;
                    color: #94a3b8;
                }
            </style>
        </head>
        <body>
            <header>
                <div class="logo">
                    <h1>K2</h1>
                    <span class="tagline">Ultra-Fast Programming</span>
                </div>
            </header>
            
            <div class="error-container">
                <div class="error-code">404</div>
                <div class="error-message">Page Not Found</div>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <a href="/" class="home-link">Go to Homepage</a>
            </div>
            
            <footer>
                <p>&copy; 2023 K2 Language. All rights reserved.</p>
            </footer>
        </body>
        </html>
        """), 404

if __name__ == '__main__':
    print("K2 Language Website")
    print("===================")
    print("Server running at http://127.0.0.1:5000")
    print("Press Ctrl+C to stop the server")
    app.run(debug=True, host='0.0.0.0')