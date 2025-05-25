// K2 Language Website JavaScript - Modern UI 2025

document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        
        // Update chart colors if chart exists
        if (window.performanceChart) {
            updateChartColors();
        }
    });
    
    // Function to update chart colors based on theme
    function updateChartColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        const textColor = isDark ? '#f8fafc' : '#1e293b';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        window.performanceChart.options.scales.y.grid.color = gridColor;
        window.performanceChart.options.scales.x.grid.color = gridColor;
        window.performanceChart.options.scales.y.ticks.color = textColor;
        window.performanceChart.options.scales.x.ticks.color = textColor;
        window.performanceChart.options.scales.y.title.color = textColor;
        window.performanceChart.options.scales.x.title.color = textColor;
        window.performanceChart.options.plugins.title.color = textColor;
        window.performanceChart.options.plugins.legend.labels.color = textColor;
        
        window.performanceChart.update();
    }
    
    // Add animations to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .stat-card, .download-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (nav.classList.contains('nav-active') && 
            !nav.contains(event.target) && 
            !burger.contains(event.target)) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            
            navLinks.forEach((link) => {
                link.style.animation = '';
            });
        }
    });
    
    // Example Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // Documentation Sidebar
    const docLinks = document.querySelectorAll('.docs-sidebar a');
    const docSections = document.querySelectorAll('.docs-section');
    
    docLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sectionId = link.getAttribute('href').substring(1);
            
            // Remove active class from all links and sections
            docLinks.forEach(lnk => lnk.classList.remove('active'));
            docSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to current link and section
            link.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Performance Chart
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Determine if dark mode is active
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#f8fafc' : '#1e293b';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Chart gradient for K2 bar
    const k2Gradient = ctx.createLinearGradient(0, 0, 0, 400);
    k2Gradient.addColorStop(0, '#2563eb');
    k2Gradient.addColorStop(1, '#10b981');
    
    window.performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Variable Assignment', 'Integer Addition', 'Print Operation', 'Complex Expression'],
            datasets: [
                {
                    label: 'K2 (nanoseconds)',
                    data: [250, 135, 1500, 2500],
                    backgroundColor: k2Gradient,
                    borderColor: '#1d4ed8',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Python (nanoseconds)',
                    data: [10000, 8000, 50000, 100000],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'JavaScript (nanoseconds)',
                    data: [5000, 3000, 30000, 80000],
                    backgroundColor: '#60a5fa',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Ruby (nanoseconds)',
                    data: [15000, 12000, 60000, 150000],
                    backgroundColor: '#93c5fd',
                    borderColor: '#60a5fa',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    beginAtZero: true,
                    grid: {
                        color: gridColor,
                        borderColor: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: 'Execution Time (nanoseconds, log scale)',
                        color: textColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor,
                        borderColor: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: 'Operation Type',
                        color: textColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            size: 13
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Performance Comparison (lower is better)',
                    color: textColor,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 30
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1e293b' : 'rgba(255, 255, 255, 0.9)',
                    titleColor: isDarkMode ? '#f8fafc' : '#1e293b',
                    bodyColor: isDarkMode ? '#f8fafc' : '#1e293b',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    boxPadding: 6,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toLocaleString() + ' ns';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (nav.classList.contains('nav-active')) {
                        nav.classList.remove('nav-active');
                        burger.classList.remove('toggle');
                    }
                    
                    // Calculate header height for offset
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Highlight active nav link based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        // Get all sections with IDs
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Online K2 Runner
    const codeEditor = document.getElementById('code-editor');
    const codeOutput = document.getElementById('code-output');
    const runButton = document.getElementById('run-code');
    const clearCodeButton = document.getElementById('clear-code');
    const clearOutputButton = document.getElementById('clear-output');
    const copyCodeButton = document.getElementById('copy-code');
    const executionTimeValue = document.getElementById('execution-time-value');
    const memoryUsageValue = document.getElementById('memory-usage-value');
    const exampleButtons = document.querySelectorAll('.example-btn');
    
    // Example code snippets
    const codeExamples = {
        hello: `// Hello World Example
var greeting = "Hello, World!";
print(greeting);

// Using string concatenation
var name = "K2";
print("Welcome to " + name + " programming language!");`,

        fibonacci: `// Fibonacci Sequence
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

// Calculate first 10 Fibonacci numbers
print("Fibonacci Sequence:");
for (var i = 0; i < 10; i++) {
    print(i + ": " + fibonacci(i));
}`,

        factorial: `// Factorial Calculation
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n-1);
}

// Calculate factorials from 1 to 10
print("Factorials:");
for (var i = 1; i <= 10; i++) {
    print(i + "! = " + factorial(i));
}`,

        sorting: `// Bubble Sort Implementation
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// Test with random array
var numbers = [64, 34, 25, 12, 22, 11, 90];
print("Original array: " + numbers);
print("Sorted array: " + bubbleSort(numbers));`
    };
    
    // Load example code
    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const exampleType = button.getAttribute('data-example');
            if (codeExamples[exampleType]) {
                codeEditor.value = codeExamples[exampleType];
            }
        });
    });
    
    // Run code function
    runButton.addEventListener('click', () => {
        const code = codeEditor.value;
        if (!code.trim()) {
            codeOutput.textContent = "// Please enter some code to run";
            return;
        }
        
        // Simulate execution (in a real implementation, this would call the K2 interpreter)
        const startTime = performance.now();
        
        try {
            // Simulate K2 execution
            const output = simulateK2Execution(code);
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            
            // Display output
            codeOutput.textContent = output;
            
            // Update execution metrics
            if (executionTime < 1) {
                executionTimeValue.textContent = Math.round(executionTime * 1000) + " ns";
            } else if (executionTime < 1000) {
                executionTimeValue.textContent = executionTime.toFixed(2) + " ms";
            } else {
                executionTimeValue.textContent = (executionTime / 1000).toFixed(2) + " s";
            }
            
            // Simulate memory usage
            const codeSize = new Blob([code]).size;
            const memoryUsage = codeSize * 2 + Math.random() * 1000;
            
            if (memoryUsage < 1024) {
                memoryUsageValue.textContent = Math.round(memoryUsage) + " B";
            } else {
                memoryUsageValue.textContent = Math.round(memoryUsage / 1024) + " KB";
            }
        } catch (error) {
            codeOutput.textContent = "Error: " + error.message;
            executionTimeValue.textContent = "N/A";
            memoryUsageValue.textContent = "N/A";
        }
    });
    
    // Clear code function
    clearCodeButton.addEventListener('click', () => {
        codeEditor.value = "";
    });
    
    // Clear output function
    clearOutputButton.addEventListener('click', () => {
        codeOutput.textContent = "// Output will appear here when you run your code";
        executionTimeValue.textContent = "0 ns";
        memoryUsageValue.textContent = "0 KB";
    });
    
    // Copy code function
    copyCodeButton.addEventListener('click', () => {
        codeEditor.select();
        document.execCommand('copy');
        
        // Visual feedback
        copyCodeButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyCodeButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
    
    // Simulate K2 execution (this is just a simulation for the demo)
    function simulateK2Execution(code) {
        // This is a very simple simulation that doesn't actually execute the code
        // In a real implementation, this would call the K2 interpreter
        
        let output = "";
        const lines = code.split('\n');
        
        for (const line of lines) {
            // Simulate print statements
            if (line.trim().startsWith('print(') && line.trim().endsWith(');')) {
                try {
                    // Extract content inside print()
                    const content = line.trim().substring(6, line.trim().length - 2);
                    
                    // Very basic string handling
                    if (content.startsWith('"') && content.endsWith('"')) {
                        output += content.substring(1, content.length - 1) + "\n";
                    } else if (content.startsWith("'") && content.endsWith("'")) {
                        output += content.substring(1, content.length - 1) + "\n";
                    } else if (!isNaN(content)) {
                        output += content + "\n";
                    } else if (content.includes('+')) {
                        // Very simple string concatenation
                        const parts = content.split('+').map(p => p.trim());
                        let result = "";
                        
                        for (const part of parts) {
                            if (part.startsWith('"') && part.endsWith('"')) {
                                result += part.substring(1, part.length - 1);
                            } else if (part.startsWith("'") && part.endsWith("'")) {
                                result += part.substring(1, part.length - 1);
                            } else if (!isNaN(part)) {
                                result += part;
                            } else {
                                // Assume it's a variable with value "variable_name"
                                result += part;
                            }
                        }
                        
                        output += result + "\n";
                    } else {
                        // Assume it's a variable with value "variable_name"
                        output += content + "\n";
                    }
                } catch (e) {
                    output += "Error evaluating print statement\n";
                }
            }
        }
        
        // If no output was generated, provide a default message
        if (!output) {
            output = "// Code executed successfully with no output\n// (Note: This is a simulation - only print() statements are processed)";
        }
        
        // Add a small delay to simulate processing time
        return output;
    }
});