// K3 Language Website JavaScript

document.addEventListener('DOMContentLoaded', function() {

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Code highlighting effect
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const rawCode = block.textContent;
        const lines = rawCode.split('
');

function safeHighlight(line) {
  // Avoid highlighting inside tags
  return line.replace(/(color|state|return|let|input|name|value)/g, function(match) {
    // Do not highlight inside existing span or tag
    if (/<[^>]*$/.test(line)) return match;
    return '<span style="color: #CE9178;">' + match + '</span>';
  });
}

        let highlightedCode = '';
        
        lines.forEach(line => {
            // Highlight comments
            line = line.replace(/(\/\/.*)/g, '<span style="color: #6A9955;">$1</span>');
            
            // Highlight keywords
            const keywords = ['import', 'from', 'class', 'extends', 'fn', 'function', 'return', 'if', 'else', 'for', 'while', 'in', 'of', 'let', 'const', 'var', 'async', 'await', 'try', 'catch', 'switch', 'case', 'break', 'continue', 'default', 'static', 'this', 'super', 'new', 'null', 'undefined', 'true', 'false'];
            
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                line = safeHighlight(line);
            });
            
            // Highlight strings
            line = line.replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color: #CE9178;">$1</span>');
            
            // Highlight function calls
            line = line.replace(/(\w+)(\s*\()/g, '<span style="color: #DCDCAA;">$1</span>$2');
            
            // Highlight types
            line = line.replace(/(\w+)(?=:)/g, '<span style="color: #9CDCFE;">$1</span>');
            line = line.replace(/(:\s*)(\w+)/g, '$1<span style="color: #4EC9B0;">$2</span>');
            
            highlightedCode += line + '\n';
        });
        
        block.innerHTML = highlightedCode;
    });
    
    // Benchmark tabs
    const benchmarkTabs = document.querySelectorAll('.benchmark-tab');
    const benchmarkDescription = document.querySelector('.benchmark-description');
    
    benchmarkTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            benchmarkTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update benchmark description
            const benchmark = tab.getAttribute('data-benchmark');
            
            switch (benchmark) {
                case 'fibonacci':
                    benchmarkDescription.innerHTML = `
                        <h3>Fibonacci Benchmark</h3>
                        <p>This benchmark calculates the 45th Fibonacci number recursively, testing function call overhead and integer performance. K3's optimizing compiler produces code that's within 5% of C++ performance while maintaining memory safety.</p>
                    `;
                    break;
                case 'sorting':
                    benchmarkDescription.innerHTML = `
                        <h3>Sorting Benchmark</h3>
                        <p>This benchmark sorts an array of 1 million random integers, testing memory management and algorithm implementation. K3's efficient memory model and optimized standard library deliver performance comparable to C++ and Rust.</p>
                    `;
                    break;
                case 'webserver':
                    benchmarkDescription.innerHTML = `
                        <h3>Web Server Benchmark</h3>
                        <p>This benchmark measures requests per second for a simple HTTP server. K3's lightweight concurrency model and efficient I/O handling make it competitive with Go for web server workloads, while being much faster than JavaScript and Python.</p>
                    `;
                    break;
                case 'image':
                    benchmarkDescription.innerHTML = `
                        <h3>Image Processing Benchmark</h3>
                        <p>This benchmark applies a Gaussian blur to a 4K image, testing floating-point performance and memory throughput. K3's SIMD optimizations and cache-friendly memory layout enable performance close to C++ for this compute-intensive task.</p>
                    `;
                    break;
            }
        });
    });
    
    // Example tabs
    const exampleTabs = document.querySelectorAll('.example-tab');
    const exampleContents = document.querySelectorAll('.example-content');
    
    exampleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            exampleTabs.forEach(t => t.classList.remove('active'));
            exampleContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const example = tab.getAttribute('data-example');
            document.getElementById(`${example}-example`).classList.add('active');
        });
    });
    
    // Installation tabs
    const installationTabs = document.querySelectorAll('.installation-tab');
    const installationContents = document.querySelectorAll('.installation-content');
    
    installationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            installationTabs.forEach(t => t.classList.remove('active'));
            installationContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const os = tab.getAttribute('data-os');
            document.getElementById(`${os}-installation`).classList.add('active');
        });
    });
    
    // Mobile navigation
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
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        }
    });
    
    // Initialize performance chart
    if (document.getElementById('performanceChart')) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Chart data
        const chartData = {
            labels: ['K3', 'C++', 'Rust', 'Go', 'JavaScript', 'Python'],
            datasets: [{
                label: 'Relative Performance (higher is better)',
                data: [95, 100, 98, 85, 15, 5],
                backgroundColor: [
                    'rgba(76, 110, 245, 0.8)',
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(255, 153, 0, 0.8)',
                    'rgba(0, 173, 181, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(32, 201, 151, 0.8)'
                ],
                borderColor: [
                    'rgba(76, 110, 245, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(255, 153, 0, 1)',
                    'rgba(0, 173, 181, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(32, 201, 151, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        // Chart options
        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Performance (relative to C++)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% of C++ performance';
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    }
});
