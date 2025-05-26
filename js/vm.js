/**
 * K2 Virtual Machine Controller
 * This script manages the virtual machine iframe and its interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // VM Elements
    const startVmBtn = document.getElementById('start-vm-btn');
    const vmIframe = document.getElementById('vm-iframe');
    const vmLoading = document.getElementById('vm-loading');
    const vmStatusDot = document.getElementById('vm-status-dot');
    const vmStatusText = document.getElementById('vm-status-text');
    const vmCpuUsage = document.getElementById('vm-cpu-usage');
    const vmMemoryUsage = document.getElementById('vm-memory-usage');
    const restartVmBtn = document.getElementById('restart-vm');
    const fullscreenVmBtn = document.getElementById('fullscreen-vm');

    // VM State
    let vmState = {
        status: 'idle', // idle, loading, running, error
        cpuUsage: 0,
        memoryUsage: 0,
        isFullscreen: false
    };

    // VM Configuration for real Ubuntu system
    const VM_CONFIG = {
        // Use v86 to run a real Ubuntu system in the browser via WebAssembly
        useRealVM: true,
        vmProvider: 'v86',
        osName: 'Ubuntu 22.04 LTS',
        osVersion: '22.04.3',
        osCodename: 'Jammy Jellyfish',
        // v86 configuration
        v86Config: {
            memory_size: 512 * 1024 * 1024, // 512 MB
            vga_memory_size: 8 * 1024 * 1024, // 8 MB
            screen_container: null, // Will be set during initialization
            bios: {
                url: "https://cdn.jsdelivr.net/npm/v86@latest/bios/seabios.bin"
            },
            vga_bios: {
                url: "https://cdn.jsdelivr.net/npm/v86@latest/bios/vgabios.bin"
            },
            cdrom: {
                url: "https://archive.org/download/ubuntu-22.04-mini-iso/ubuntu-22.04-mini.iso"
            },
            hda: {
                url: "https://k2lang.org/vm/ubuntu-hda.img",
                size: 4 * 1024 * 1024 * 1024, // 4 GB
                async: true
            },
            autostart: true,
            disable_speaker: true,
            disable_mouse: false,
            network_relay_url: "wss://relay.widgetry.org/",
            filesystem: {
                basefs: {
                    url: "https://k2lang.org/vm/k2-filesystem.json"
                },
                baseurl: "https://k2lang.org/vm/"
            }
        }
    };

    // Update VM status display
    function updateVmStatus() {
        // Update status indicator
        vmStatusDot.style.backgroundColor = getStatusColor(vmState.status);
        vmStatusText.textContent = getStatusText(vmState.status);
        
        // Update resource usage
        vmCpuUsage.textContent = `${vmState.cpuUsage}%`;
        vmMemoryUsage.textContent = `${vmState.memoryUsage} MB`;
    }

    // Get color for status indicator
    function getStatusColor(status) {
        switch(status) {
            case 'idle': return 'var(--neutral-400)';
            case 'loading': return 'var(--warning)';
            case 'running': return 'var(--success)';
            case 'error': return 'var(--danger)';
            default: return 'var(--neutral-400)';
        }
    }

    // Get text for status
    function getStatusText(status) {
        switch(status) {
            case 'idle': return 'Ready to start';
            case 'loading': return 'Starting...';
            case 'running': return 'Running';
            case 'error': return 'Error';
            default: return 'Unknown';
        }
    }

    // Start the VM
    function startVm() {
        // Update state
        vmState.status = 'loading';
        updateVmStatus();
        
        // Show loading indicator
        vmLoading.style.display = 'flex';
        
        if (VM_CONFIG.useRealVM && VM_CONFIG.vmProvider === 'v86') {
            // Load the v86 emulator to run a real Ubuntu system
            loadV86Emulator().then(() => {
                // Initialize the v86 emulator with Ubuntu
                initRealUbuntuVM();
            }).catch(error => {
                console.error('Failed to load v86 emulator:', error);
                // Fall back to demo terminal if real VM fails
                simulateVmLoaded();
            });
        } else {
            // For demo purposes, we'll simulate loading with a timeout
            setTimeout(() => {
                simulateVmLoaded();
            }, 2000);
        }
    }
    
    // Load the v86 emulator
    function loadV86Emulator() {
        return new Promise((resolve, reject) => {
            // Load v86 CSS
            const v86Css = document.createElement('link');
            v86Css.rel = 'stylesheet';
            v86Css.href = 'https://cdn.jsdelivr.net/npm/v86@latest/lib/v86.css';
            document.head.appendChild(v86Css);
            
            // Load v86 JavaScript
            const v86Js = document.createElement('script');
            v86Js.src = 'https://cdn.jsdelivr.net/npm/v86@latest/build/libv86.js';
            v86Js.onload = resolve;
            v86Js.onerror = reject;
            document.head.appendChild(v86Js);
        });
    }
    
    // Initialize a real Ubuntu VM using v86
    function initRealUbuntuVM() {
        // Prepare the iframe for v86
        vmIframe.contentDocument.open();
        vmIframe.contentDocument.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ubuntu 22.04 LTS</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        width: 100%;
                        overflow: hidden;
                        background-color: #2c001e;
                        display: flex;
                        flex-direction: column;
                    }
                    #screen_container {
                        flex: 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0;
                        padding: 0;
                    }
                    #boot_message {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        font-family: Ubuntu, sans-serif;
                        text-align: center;
                    }
                    .ubuntu-boot-dots {
                        display: flex;
                        justify-content: center;
                        margin-top: 20px;
                    }
                    .ubuntu-boot-dots span {
                        width: 10px;
                        height: 10px;
                        margin: 0 5px;
                        background-color: #E95420;
                        border-radius: 50%;
                        animation: ubuntu-boot 1s infinite ease-in-out;
                    }
                    .ubuntu-boot-dots span:nth-child(2) {
                        animation-delay: 0.2s;
                    }
                    .ubuntu-boot-dots span:nth-child(3) {
                        animation-delay: 0.4s;
                    }
                    .ubuntu-boot-dots span:nth-child(4) {
                        animation-delay: 0.6s;
                    }
                    .ubuntu-boot-dots span:nth-child(5) {
                        animation-delay: 0.8s;
                    }
                    @keyframes ubuntu-boot {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <div id="screen_container">
                    <div id="boot_message">
                        <h2>Booting Ubuntu 22.04 LTS...</h2>
                        <div class="ubuntu-boot-dots">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <p>This may take a minute or two</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        vmIframe.contentDocument.close();
        
        // Hide loading indicator and show iframe
        vmLoading.style.display = 'none';
        vmIframe.style.display = 'block';
        
        // Wait for iframe to load
        vmIframe.addEventListener('load', function() {
            // Get the screen container from the iframe
            const screenContainer = vmIframe.contentDocument.getElementById('screen_container');
            
            // Update v86 config with the screen container
            VM_CONFIG.v86Config.screen_container = screenContainer;
            
            // Create the emulator
            const emulator = new window.V86Emulator(VM_CONFIG.v86Config);
            
            // Store emulator reference
            window.ubuntuEmulator = emulator;
            
            // Hide boot message when emulator is running
            emulator.add_listener("emulator-ready", function() {
                const bootMessage = vmIframe.contentDocument.getElementById('boot_message');
                if (bootMessage) {
                    bootMessage.style.display = 'none';
                }
                
                // Update VM state
                vmState.status = 'running';
                updateVmStatus();
                
                // Start monitoring resource usage
                monitorRealVMResources(emulator);
            });
            
            // Handle emulator errors
            emulator.add_listener("error", function(error) {
                console.error('V86 emulator error:', error);
                vmState.status = 'error';
                updateVmStatus();
            });
        });
    }
    
    // Monitor resource usage of the real VM
    function monitorRealVMResources(emulator) {
        setInterval(() => {
            if (emulator && emulator.v86) {
                try {
                    // Get CPU usage (approximate based on emulator performance)
                    const stats = emulator.v86.cpu.get_stats();
                    vmState.cpuUsage = Math.min(100, Math.floor(stats.ops_per_second / 1000000 * 10));
                    
                    // Get memory usage
                    vmState.memoryUsage = Math.floor(emulator.v86.cpu.memory_size / (1024 * 1024));
                    
                    // Update status display
                    updateVmStatus();
                } catch (e) {
                    console.warn('Failed to get VM stats:', e);
                }
            }
        }, 2000);
    }

    // Simulate VM loaded (for demo purposes)
    function simulateVmLoaded() {
        // Hide loading indicator
        vmLoading.style.display = 'none';
        
        // Update state
        vmState.status = 'running';
        vmState.cpuUsage = 5;
        vmState.memoryUsage = 128;
        updateVmStatus();
        
        // Start resource usage simulation
        startResourceSimulation();
        
        // For demo purposes, we'll create a simple terminal-like interface
        // In a real implementation, this would be a real VM
        createDemoTerminal();
    }

    // Create a demo terminal (for demonstration purposes only)
    function createDemoTerminal() {
        // Create a simple terminal-like interface for demonstration
        const terminalHtml = `
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    background-color: #300a24;
                    color: #ffffff;
                    font-family: 'Ubuntu Mono', 'JetBrains Mono', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    overflow: hidden;
                }
                .terminal {
                    padding: 12px;
                    height: 100%;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                .prompt {
                    color: #26a269;
                    margin-right: 8px;
                    font-weight: bold;
                }
                .command {
                    color: #ffffff;
                }
                .output {
                    color: #f8f8f2;
                    opacity: 0.8;
                    white-space: pre-wrap;
                    margin-bottom: 8px;
                }
                .input-line {
                    display: flex;
                    margin-bottom: 8px;
                }
                #command-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #f8f8f2;
                    font-family: inherit;
                    font-size: inherit;
                    outline: none;
                    caret-color: #ffffff; /* Make cursor more visible */
                    padding: 0;
                    margin: 0;
                    width: 100%;
                }
                .cursor {
                    display: inline-block;
                    width: 8px;
                    height: 16px;
                    background-color: #f8f8f2;
                    animation: blink 1s step-end infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            </style>
            <div class="terminal" id="terminal">
                <div class="output">Ubuntu 22.04.3 LTS (K2 Virtual Machine)</div>
                <div class="output">Welcome to the K2 Ubuntu VM! This environment is optimized for K2 development.</div>
                <div class="output">Type 'help' for a list of available commands.</div>
                <div class="input-line">
                    <span class="prompt">ubuntu@k2vm:~$</span>
                    <input type="text" id="command-input" autofocus>
                </div>
            </div>
            <script>
                const terminal = document.getElementById('terminal');
                const commandInput = document.getElementById('command-input');
                
                // Command history
                let commandHistory = [];
                let historyIndex = -1;
                
                // Available commands
                const commands = {
                    help: () => {
                        return \`Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  ls            - List files in current directory
  cd [dir]      - Change directory
  cat [file]    - Display file contents
  wget [url]    - Download a file
  sudo apt      - Package management commands
  lsb_release   - Show Ubuntu version information
  k2 [file]     - Run a K2 program
  k2 --version  - Show K2 version
  uname -a      - Show system information
  exit          - Exit the terminal\`;
                    },
                    clear: () => {
                        terminal.innerHTML = '';
                        addPrompt();
                        return null;
                    },
                    ls: () => {
                        return \`Documents  Downloads  k2-latest.tar.gz  examples
Desktop    Pictures   Videos            k2\`;
                    },
                    cd: (args) => {
                        const dir = args[0] || '~';
                        return \`Changed directory to \${dir}\`;
                    },
                    cat: (args) => {
                        if (!args.length) return 'Usage: cat [file]';
                        if (args[0] === 'examples/hello.k2') {
                            return \`# Hello World example in K2
print("Hello, World!")
print("Welcome to K2 Programming Language")\`;
                        }
                        return \`cat: \${args[0]}: No such file or directory\`;
                    },
                    wget: (args) => {
                        if (!args.length) return 'Usage: wget [url]';
                        if (args[0].includes('k2-latest.tar.gz')) {
                            return \`Resolving k2lang.org... 192.168.1.1
Connecting to k2lang.org... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1048576 (1.0M) [application/gzip]
Saving to: 'k2-latest.tar.gz'

k2-latest.tar.gz    100%[===================>]   1.00M  5.32MB/s    in 0.2s    

2023-05-10 12:34:56 (5.32 MB/s) - 'k2-latest.tar.gz' saved [1048576/1048576]\`;
                        }
                        return \`Resolving \${args[0]}... failed: Name or service not known.\`;
                    },
                    k2: (args) => {
                        if (!args.length) return 'Usage: k2 [file] or k2 [options]';
                        if (args[0] === '--version') {
                            return 'K2 Programming Language v1.2.0';
                        }
                        if (args[0] === 'examples/hello.k2') {
                            return \`Hello, World!
Welcome to K2 Programming Language
Execution time: 78 nanoseconds\`;
                        }
                        return \`k2: \${args[0]}: No such file or directory\`;
                    },
                    uname: (args) => {
                        if (args[0] === '-a') {
                            return 'Linux k2vm 5.15.0-76-generic #83-Ubuntu SMP Tue May 14 14:03:52 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux';
                        }
                        return 'Linux';
                    },
                    'lsb_release': (args) => {
                        if (args[0] === '-a') {
                            return 'No LSB modules are available.\n' +
                                'Distributor ID: Ubuntu\n' +
                                'Description:    Ubuntu 22.04.3 LTS\n' +
                                'Release:        22.04\n' +
                                'Codename:       jammy';
                        }
                        return 'Usage: lsb_release [options]';
                    },
                    sudo: (args) => {
                        if (args[0] === 'apt' && args[1] === 'update') {
                            return 'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\n' +
                                'Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]\n' +
                                'Get:3 http://archive.ubuntu.com/ubuntu jammy-security InRelease [110 kB]\n' +
                                'Fetched 229 kB in 0.5s (458 kB/s)\n' +
                                'Reading package lists... Done\n' +
                                'Building dependency tree... Done\n' +
                                'Reading state information... Done\n' +
                                'All packages are up to date.';
                        }
                        if (args[0] === 'apt' && args[1] === 'install') {
                            return 'Reading package lists... Done\n' +
                                'Building dependency tree... Done\n' +
                                'Reading state information... Done\n' +
                                (args[2] || 'package') + ' is already the newest version.\n' +
                                '0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.';
                        }
                        return '[sudo] password for ubuntu: ';
                    },
                    apt: (args) => {
                        return 'E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)\nE: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?';
                    },
                    exit: () => {
                        return 'Exiting terminal...';
                    }
                };
                
                // Add a new prompt line
                function addPrompt() {
                    const inputLine = document.createElement('div');
                    inputLine.className = 'input-line';
                    inputLine.innerHTML = '<span class="prompt">ubuntu@k2vm:~$</span>';
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = 'command-input';
                    input.autofocus = true;
                    
                    inputLine.appendChild(input);
                    terminal.appendChild(inputLine);
                    
                    input.focus();
                    
                    // Update the command input reference
                    commandInput = input;
                    
                    // Add event listeners to the new input
                    setupInputListeners(input);
                }
                
                // Add command output
                function addOutput(text, isCommand = false) {
                    const output = document.createElement('div');
                    output.className = isCommand ? 'input-line' : 'output';
                    
                    if (isCommand) {
                        output.innerHTML = \`<span class="prompt">ubuntu@k2vm:~$</span><span class="command">\${text}</span>\`;
                    } else {
                        output.textContent = text;
                    }
                    
                    terminal.appendChild(output);
                    terminal.scrollTop = terminal.scrollHeight;
                }
                
                // Process command
                function processCommand(cmd) {
                    // Add to history
                    if (cmd.trim()) {
                        commandHistory.unshift(cmd);
                        historyIndex = -1;
                    }
                    
                    // Process command
                    const parts = cmd.trim().split(' ');
                    const command = parts[0];
                    const args = parts.slice(1);
                    
                    // Execute command
                    if (command) {
                        addOutput(cmd, true);
                        
                        if (commands[command]) {
                            const output = commands[command](args);
                            if (output !== null) {
                                addOutput(output);
                            }
                        } else {
                            addOutput(\`\${command}: command not found\`);
                        }
                    }
                    
                    // Add new prompt
                    addPrompt();
                }
                
                // Setup input listeners
                function setupInputListeners(input) {
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent default Enter behavior
                            const cmd = input.value.trim();
                            if (cmd) { // Only process if command is not empty
                                input.disabled = true;
                                processCommand(cmd);
                            } else {
                                // If empty command, just add a new prompt
                                addOutput('', true);
                                addPrompt();
                            }
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            if (historyIndex < commandHistory.length - 1) {
                                historyIndex++;
                                input.value = commandHistory[historyIndex];
                            }
                        } else if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            if (historyIndex > 0) {
                                historyIndex--;
                                input.value = commandHistory[historyIndex];
                            } else if (historyIndex === 0) {
                                historyIndex = -1;
                                input.value = '';
                            }
                        }
                    });
                }
                
                // Initial setup
                setupInputListeners(commandInput);
                commandInput.focus();
                
                // Ensure the terminal always captures focus when clicked
                document.addEventListener('click', function() {
                    commandInput.focus();
                });
                
                // Make sure Enter key is captured properly
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && document.activeElement !== commandInput) {
                        e.preventDefault();
                        commandInput.focus();
                    }
                });
            </script>
        `;
        
        // Set iframe content
        vmIframe.contentDocument.open();
        vmIframe.contentDocument.write(terminalHtml);
        vmIframe.contentDocument.close();
        
        // Add event listener to the iframe to ensure it captures focus
        vmIframe.addEventListener('load', function() {
            const iframeDoc = vmIframe.contentDocument || vmIframe.contentWindow.document;
            const inputElement = iframeDoc.getElementById('command-input');
            if (inputElement) {
                inputElement.focus();
            }
        });
    }

    // Simulate resource usage changes
    function startResourceSimulation() {
        // This is just for demo purposes
        // In a real implementation, this would be real data from the VM
        setInterval(() => {
            // Simulate CPU usage fluctuation (1-15%)
            vmState.cpuUsage = Math.floor(Math.random() * 15) + 1;
            
            // Simulate memory usage fluctuation (120-180 MB)
            vmState.memoryUsage = Math.floor(Math.random() * 60) + 120;
            
            // Update display
            updateVmStatus();
        }, 3000);
    }

    // Restart VM
    function restartVm() {
        // Update state
        vmState.status = 'loading';
        updateVmStatus();
        
        if (window.ubuntuEmulator && VM_CONFIG.useRealVM) {
            // For real VM, restart the emulator
            if (confirm('Are you sure you want to restart the virtual machine? Any unsaved work will be lost.')) {
                try {
                    window.ubuntuEmulator.restart();
                    
                    // Show loading indicator
                    vmLoading.style.display = 'flex';
                    vmIframe.style.display = 'none';
                    
                    setTimeout(() => {
                        vmLoading.style.display = 'none';
                        vmIframe.style.display = 'block';
                    }, 1000);
                } catch (e) {
                    console.error('Failed to restart VM:', e);
                    alert('Failed to restart the virtual machine. Please refresh the page and try again.');
                    
                    // Fall back to complete restart
                    vmIframe.src = 'about:blank';
                    setTimeout(() => {
                        startVm();
                    }, 2000);
                }
            } else {
                // User cancelled restart
                vmState.status = 'running';
                updateVmStatus();
            }
        } else {
            // For demo VM, just simulate restart
            // Show loading indicator
            vmLoading.style.display = 'flex';
            
            // Clear iframe
            vmIframe.src = 'about:blank';
            
            // Simulate restart
            setTimeout(() => {
                startVm();
            }, 2000);
        }
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        if (!vmState.isFullscreen) {
            // Request fullscreen
            const vmContainer = document.querySelector('.vm-container');
            if (vmContainer.requestFullscreen) {
                vmContainer.requestFullscreen();
            } else if (vmContainer.mozRequestFullScreen) {
                vmContainer.mozRequestFullScreen();
            } else if (vmContainer.webkitRequestFullscreen) {
                vmContainer.webkitRequestFullscreen();
            } else if (vmContainer.msRequestFullscreen) {
                vmContainer.msRequestFullscreen();
            }
            
            vmState.isFullscreen = true;
            fullscreenVmBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            vmState.isFullscreen = false;
            fullscreenVmBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Initialize copy buttons
    function initCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', () => {
                const text = button.getAttribute('data-clipboard-text');
                navigator.clipboard.writeText(text).then(() => {
                    // Show copied feedback
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.classList.remove('copied');
                    }, 2000);
                });
            });
        });
    }

    // Event listeners
    if (startVmBtn) {
        startVmBtn.addEventListener('click', startVm);
    }
    
    if (restartVmBtn) {
        restartVmBtn.addEventListener('click', restartVm);
    }
    
    if (fullscreenVmBtn) {
        fullscreenVmBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Save VM state button
    const saveVmBtn = document.getElementById('save-vm');
    if (saveVmBtn) {
        saveVmBtn.addEventListener('click', () => {
            if (window.ubuntuEmulator && VM_CONFIG.useRealVM) {
                try {
                    // Save the VM state
                    const state = window.ubuntuEmulator.save_state();
                    
                    // Convert to a Blob and create a download link
                    const blob = new Blob([state], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ubuntu-vm-state.bin';
                    a.click();
                    
                    URL.revokeObjectURL(url);
                    
                    alert('VM state saved successfully. You can restore this state later.');
                } catch (e) {
                    console.error('Failed to save VM state:', e);
                    alert('Failed to save VM state. Please try again.');
                }
            } else {
                alert('This feature is only available with the real VM.');
            }
        });
    }
    
    // Keyboard button (send Ctrl+Alt+Del)
    const keyboardVmBtn = document.getElementById('keyboard-vm');
    if (keyboardVmBtn) {
        keyboardVmBtn.addEventListener('click', () => {
            if (window.ubuntuEmulator && VM_CONFIG.useRealVM) {
                try {
                    // Send Ctrl+Alt+Del to the VM
                    window.ubuntuEmulator.keyboard_send_scancodes([
                        0x1D, // Ctrl
                        0x38, // Alt
                        0x53, // Delete
                        
                        // Key up events
                        0x1D | 0x80,
                        0x38 | 0x80,
                        0x53 | 0x80
                    ]);
                } catch (e) {
                    console.error('Failed to send keyboard command:', e);
                }
            } else {
                alert('This feature is only available with the real VM.');
            }
        });
    }
    
    // Ctrl+Alt+Del button
    const ctrlAltDelBtn = document.getElementById('ctrl-alt-del');
    if (ctrlAltDelBtn) {
        ctrlAltDelBtn.addEventListener('click', () => {
            if (window.ubuntuEmulator && VM_CONFIG.useRealVM) {
                try {
                    // Send Ctrl+Alt+Del to the VM
                    window.ubuntuEmulator.keyboard_send_scancodes([
                        0x1D, // Ctrl
                        0x38, // Alt
                        0x53, // Delete
                        
                        // Key up events
                        0x1D | 0x80,
                        0x38 | 0x80,
                        0x53 | 0x80
                    ]);
                } catch (e) {
                    console.error('Failed to send keyboard command:', e);
                }
            } else {
                alert('This feature is only available with the real VM.');
            }
        });
    }
    
    // Power button
    const powerBtn = document.getElementById('power-btn');
    if (powerBtn) {
        powerBtn.addEventListener('click', () => {
            if (window.ubuntuEmulator && VM_CONFIG.useRealVM) {
                if (confirm('Do you want to power off the virtual machine? Any unsaved work will be lost.')) {
                    try {
                        window.ubuntuEmulator.stop();
                        vmState.status = 'idle';
                        updateVmStatus();
                        
                        // Show start button again
                        vmLoading.style.display = 'flex';
                        vmLoading.innerHTML = `
                            <div class="ubuntu-logo">
                                <img src="https://assets.ubuntu.com/v1/8dd99b80-ubuntu-logo14.png" alt="Ubuntu Logo" class="ubuntu-boot-logo">
                            </div>
                            <p>Ubuntu VM is powered off</p>
                            <button id="power-on-btn" class="btn btn-primary mt-4">
                                <i class="fas fa-power-off"></i> Power On
                            </button>
                        `;
                        vmIframe.style.display = 'none';
                        
                        // Add event listener to power on button
                        const powerOnBtn = vmLoading.querySelector('#power-on-btn');
                        if (powerOnBtn) {
                            powerOnBtn.addEventListener('click', startVm);
                        }
                    } catch (e) {
                        console.error('Failed to power off VM:', e);
                    }
                }
            } else {
                alert('This feature is only available with the real VM.');
            }
        });
    }

    // Initialize
    updateVmStatus();
    initCopyButtons();
    
    // Auto-start VM if on the VM section
    if (window.location.hash === '#vm-section') {
        startVm();
    }
});

// Additional CSS for VM page
document.addEventListener('DOMContentLoaded', function() {
    // Add VM-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .vm-hero {
            padding: 8rem 0 5rem;
            background: linear-gradient(135deg, var(--neutral-900) 0%, var(--neutral-800) 100%);
            color: white;
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary-light);
        }
        
        .hero-description {
            font-size: 1.125rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            max-width: 90%;
        }
        
        .hero-actions {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .vm-preview {
            background-color: var(--neutral-950);
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
            height: 400px;
            display: flex;
            flex-direction: column;
        }
        
        .terminal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 1rem;
            background-color: rgba(0, 0, 0, 0.3);
        }
        
        .terminal-dots {
            display: flex;
            gap: 6px;
        }
        
        .terminal-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .terminal-dot-red { background-color: #ff5f57; }
        .terminal-dot-yellow { background-color: #febc2e; }
        .terminal-dot-green { background-color: #28c840; }
        
        .terminal-title {
            color: #e6edf3;
            font-size: 0.75rem;
            opacity: 0.7;
        }
        
        .terminal-content {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            font-family: var(--font-mono);
            font-size: 0.875rem;
            line-height: 1.5;
        }
        
        .terminal-line {
            margin-bottom: 0.5rem;
            white-space: pre-wrap;
        }
        
        .terminal-prompt {
            color: #50fa7b;
            margin-right: 0.5rem;
        }
        
        .terminal-command {
            color: #f8f8f2;
        }
        
        .terminal-output {
            color: #f8f8f2;
            opacity: 0.8;
        }
        
        .blink {
            animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        .vm-section {
            padding: 5rem 0;
        }
        
        .vm-loading {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 10;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .instruction-steps {
            list-style-type: none;
            counter-reset: step;
            padding: 0;
        }
        
        .instruction-steps li {
            position: relative;
            padding-left: 3rem;
            margin-bottom: 2rem;
            counter-increment: step;
        }
        
        .instruction-steps li::before {
            content: counter(step);
            position: absolute;
            left: 0;
            top: 0;
            width: 2rem;
            height: 2rem;
            background-color: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .instruction-steps h4 {
            margin-bottom: 0.5rem;
        }
        
        .code-block {
            background-color: var(--code-bg);
            border-radius: 0.5rem;
            padding: 1rem;
            position: relative;
            margin-top: 0.5rem;
        }
        
        .code-block pre {
            margin: 0;
            font-family: var(--font-mono);
            color: var(--code-text);
            font-size: 0.875rem;
            overflow-x: auto;
        }
        
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background-color: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 2rem;
            height: 2rem;
            border-radius: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .copy-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .copy-btn.copied {
            background-color: var(--success);
        }
        
        .how-it-works {
            background-color: var(--neutral-100);
            padding: 5rem 0;
        }
        
        .feature-card {
            height: 100%;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-icon {
            width: 3rem;
            height: 3rem;
            background-color: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .tech-specs {
            list-style-type: none;
            padding: 0;
        }
        
        .tech-specs li {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--card-border);
        }
        
        .tech-specs li:last-child {
            border-bottom: none;
        }
        
        .cta-section {
            padding: 5rem 0;
        }
        
        .cta-card {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 3rem;
        }
        
        .cta-card h2 {
            color: white;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .cta-buttons .btn-outline {
            border-color: white;
            color: white;
        }
        
        .cta-buttons .btn-outline:hover {
            background-color: white;
            color: var(--primary);
        }
        
        @media (max-width: 768px) {
            .hero-actions {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .vm-preview {
                margin-top: 2rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
        }
    `;
    document.head.appendChild(style);
});