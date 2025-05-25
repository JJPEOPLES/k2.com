// K2 Language Website JavaScript - Modern UI 2024

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
});