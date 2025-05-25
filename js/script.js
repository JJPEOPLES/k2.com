// K2 Language Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
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
    
    const performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Variable Assignment', 'Integer Addition', 'Print Operation', 'Complex Expression'],
            datasets: [
                {
                    label: 'K2 (nanoseconds)',
                    data: [250, 135, 1500, 2500],
                    backgroundColor: '#2563eb',
                    borderColor: '#1d4ed8',
                    borderWidth: 1
                },
                {
                    label: 'Python (nanoseconds)',
                    data: [10000, 8000, 50000, 100000],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                },
                {
                    label: 'JavaScript (nanoseconds)',
                    data: [5000, 3000, 30000, 80000],
                    backgroundColor: '#60a5fa',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                },
                {
                    label: 'Ruby (nanoseconds)',
                    data: [15000, 12000, 60000, 150000],
                    backgroundColor: '#93c5fd',
                    borderColor: '#60a5fa',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'logarithmic',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Execution Time (nanoseconds, log scale)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Operation Type'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Performance Comparison (lower is better)'
                },
                tooltip: {
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