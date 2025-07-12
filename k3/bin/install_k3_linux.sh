#!/bin/bash

# K3 Language Linux Installer
# This script installs K3 Language on Linux systems

echo "K3 Language Installer for Linux"
echo "=============================="
echo

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

# Set installation directory
INSTALL_DIR="/usr/local/k3"
echo "Installation directory: $INSTALL_DIR"
echo

# Create installation directory
if [ ! -d "$INSTALL_DIR" ]; then
  echo "Creating installation directory..."
  mkdir -p "$INSTALL_DIR"
  if [ $? -ne 0 ]; then
    echo "Failed to create installation directory."
    exit 1
  fi
fi

# Create subdirectories
mkdir -p "$INSTALL_DIR/bin"
mkdir -p "$INSTALL_DIR/lib"
mkdir -p "$INSTALL_DIR/examples"
mkdir -p "$INSTALL_DIR/docs"

# Copy K3 binary
echo "Copying K3 binary..."
cp k3 "$INSTALL_DIR/bin/"
chmod +x "$INSTALL_DIR/bin/k3"

# Copy K3 libraries
echo "Copying K3 libraries..."
cp ../lib/*.k3 "$INSTALL_DIR/lib/" 2>/dev/null || echo "No libraries found."

# Copy examples
echo "Copying examples..."
cp ../examples/*.k3 "$INSTALL_DIR/examples/" 2>/dev/null || echo "No examples found."

# Copy documentation
echo "Copying documentation..."
cp ../docs/*.md "$INSTALL_DIR/docs/" 2>/dev/null || echo "No documentation found."
cp ../docs/*.html "$INSTALL_DIR/docs/" 2>/dev/null

# Create license and readme
echo "Creating license and readme..."
cp ../license.txt "$INSTALL_DIR/" 2>/dev/null || echo "No license found."
cp ../readme.md "$INSTALL_DIR/" 2>/dev/null || echo "No readme found."

# Create symlink
echo "Creating symlink..."
ln -sf "$INSTALL_DIR/bin/k3" /usr/local/bin/k3

# Create uninstaller
echo "Creating uninstaller..."
cat > "$INSTALL_DIR/uninstall.sh" << 'EOF'
#!/bin/bash

echo "K3 Language Uninstaller"
echo "======================"
echo

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

# Remove symlink
echo "Removing symlink..."
rm -f /usr/local/bin/k3

# Remove K3 files
echo "Removing K3 files..."
rm -rf /usr/local/k3

echo "K3 has been uninstalled."
EOF

chmod +x "$INSTALL_DIR/uninstall.sh"

echo
echo "Installation completed successfully!"
echo
echo "K3 has been installed to: $INSTALL_DIR"
echo
echo "You can now run K3 from the command line by typing 'k3'."
echo
echo "To uninstall K3, run: sudo $INSTALL_DIR/uninstall.sh"