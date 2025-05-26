#!/bin/bash

# K2 Language Installation Script

echo "K2 Language Installer"
echo "====================="
echo

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo: sudo ./install.sh"
  exit 1
fi

# Create installation directories
echo "Creating installation directories..."
mkdir -p /usr/local/bin
mkdir -p /usr/local/lib/k2
mkdir -p /usr/local/share/k2/examples
mkdir -p /usr/local/share/man/man1

# Download K2 binary if not provided
if [ ! -f "k2" ]; then
    echo "Downloading K2 binary..."
    wget -q https://k2lang.org/downloads/k2 -O k2
    if [ $? -ne 0 ]; then
        echo "Failed to download K2 binary. Please check your internet connection."
        exit 1
    fi
fi

# Make binary executable
chmod +x k2

# Install K2
echo "Installing K2..."
cp k2 /usr/local/bin/
cp k2 /usr/local/lib/k2/

# Download and install example programs
echo "Installing example programs..."
if [ ! -f "k2-examples.zip" ]; then
    wget -q https://k2lang.org/downloads/k2-examples.zip -O k2-examples.zip
    if [ $? -ne 0 ]; then
        echo "Failed to download example programs. Continuing without examples."
    else
        unzip -q k2-examples.zip -d /usr/local/share/k2/examples/
    fi
else
    unzip -q k2-examples.zip -d /usr/local/share/k2/examples/
fi

# Create man page
echo "Installing documentation..."
cat > /usr/local/share/man/man1/k2.1 << 'EOF'
.TH K2 1 "2023" "K2 Language" "K2 Language Manual"
.SH NAME
k2 \- ultra-fast programming language interpreter
.SH SYNOPSIS
.B k2
[\fIFILENAME\fR]
.br
.B k2
\fB-e\fR "\fIEXPRESSION\fR"
.SH DESCRIPTION
.B k2
is an ultra-fast programming language designed to execute operations in the range of 70 nanoseconds to 9 milliseconds.
.SH OPTIONS
.TP
.BR \-e " " \fIEXPRESSION\fR
Execute a single K2 expression.
.SH EXAMPLES
.TP
Execute a K2 program file:
.B k2 program.k2
.TP
Execute a single expression:
.B k2 -e "print 100 + 200"
.SH FILES
.TP
.I /usr/local/share/k2/examples/
Example K2 programs
.SH AUTHOR
K2 Language Team
EOF

# Update man database
if command -v mandb &> /dev/null; then
    mandb -q
fi

echo
echo "K2 language has been installed successfully!"
echo "You can now run K2 programs from anywhere using the 'k2' command:"
echo "  k2 program.k2"
echo "  k2 -e \"print 100 + 200\""
echo
echo "Example programs are available in /usr/local/share/k2/examples/"
echo "Documentation is available via 'man k2'"
echo
echo "Thank you for installing K2!"