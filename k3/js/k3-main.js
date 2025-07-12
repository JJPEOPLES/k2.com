// K3 Language Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Try Online functionality
    const runButton = document.getElementById('run-button');
    const codeEditor = document.getElementById('code-editor');
    const outputContent = document.getElementById('output-content');
    const clearButton = document.getElementById('clear-button');
    const clearOutputButton = document.getElementById('clear-output-button');
    const shareButton = document.getElementById('share-button');
    const formatButton = document.getElementById('format-button');
    const exampleCards = document.querySelectorAll('.example-card');
    
    // Example code snippets
    const codeExamples = {
        'hello-world': `// Hello World in K3
fn main() {
    println("Hello, K3 World!")
    
    // Variables with type inference
    let name = "K3"
    let version = 1.0
    
    println("Welcome to {} version {}", name, version)
    
    // Optional type annotations
    let is_awesome: bool = true
    
    if is_awesome {
        println("K3 is awesome!")
    }
}`,
        'fibonacci': `// Fibonacci Sequence in K3
fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

fn main() {
    println("First 10 Fibonacci numbers:")
    
    for i in 0..10 {
        println("fibonacci({}) = {}", i, fibonacci(i))
    }
    
    // Alternative implementation using iteration
    println("\nUsing iteration:")
    let mut a = 0
    let mut b = 1
    
    for i in 0..10 {
        println("fibonacci({}) = {}", i, a)
        let temp = a + b
        a = b
        b = temp
    }
}`,
        'todo-app': `// Simple Todo App in K3
struct Todo {
    id: u32,
    title: String,
    completed: bool
}

fn main() {
    // Initialize todo list
    let mut todos: Vec<Todo> = Vec::new()
    let mut next_id = 1
    
    // Add some initial todos
    todos.push(Todo {
        id: next_id,
        title: "Learn K3".to_string(),
        completed: false
    })
    next_id += 1
    
    todos.push(Todo {
        id: next_id,
        title: "Build a web server".to_string(),
        completed: false
    })
    next_id += 1
    
    todos.push(Todo {
        id: next_id,
        title: "Make coffee".to_string(),
        completed: true
    })
    
    // Display todos
    println("Todo List:")
    println("---------")
    
    for todo in &todos {
        let status = if todo.completed { "[x]" } else { "[ ]" }
        println("{} {} - {}", todo.id, status, todo.title)
    }
    
    // Complete a todo
    println("\nCompleting todo #2...")
    for todo in &mut todos {
        if todo.id == 2 {
            todo.completed = true
        }
    }
    
    // Display updated todos
    println("\nUpdated Todo List:")
    println("-----------------")
    
    for todo in &todos {
        let status = if todo.completed { "[x]" } else { "[ ]" }
        println("{} {} - {}", todo.id, status, todo.title)
    }
}`,
        'sorting': `// Sorting Algorithms in K3
fn bubble_sort<T: Ord>(arr: &mut [T]) {
    let n = arr.len();
    
    for i in 0..n {
        for j in 0..(n - i - 1) {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

fn main() {
    // Integer sorting
    let mut numbers = [64, 34, 25, 12, 22, 11, 90];
    println("Original array: {:?}", numbers);
    
    bubble_sort(&mut numbers);
    println("Sorted array: {:?}", numbers);
    
    // String sorting
    let mut fruits = ["banana", "apple", "orange", "mango", "kiwi"];
    println("\nOriginal fruits: {:?}", fruits);
    
    bubble_sort(&mut fruits);
    println("Sorted fruits: {:?}", fruits);
    
    // Using the standard library
    let mut more_numbers = [38, 27, 43, 3, 9, 82, 10];
    println("\nAnother array: {:?}", more_numbers);
    
    more_numbers.sort();
    println("Sorted with standard library: {:?}", more_numbers);
}`,
        'web-server': `// Simple HTTP Server in K3
import net.http
import net.http.router

fn main() {
    // Create a new router
    let router = router.new()
    
    // Define routes
    router.get("/", handle_home)
    router.get("/api/users", handle_users)
    router.post("/api/users", create_user)
    
    // Start the server
    let server = http.server(router)
    println("Server listening on http://localhost:8080")
    server.listen(8080)
}

// Route handlers
fn handle_home(req: http.Request, res: http.Response) {
    res.html("<h1>Welcome to K3 Web Server</h1>")
}

fn handle_users(req: http.Request, res: http.Response) {
    let users = [
        {id: 1, name: "Alice"},
        {id: 2, name: "Bob"},
        {id: 3, name: "Charlie"}
    ]
    
    res.json(users)
}

fn create_user(req: http.Request, res: http.Response) {
    // Parse JSON body
    let user = req.json()
    
    // In a real app, you would save to a database
    println("Created user: {}", user.name)
    
    res.status(201).json({
        success: true,
        message: "User created"
    })
}`
    };
    
    // Load example code when an example card is clicked
    exampleCards.forEach(card => {
        card.addEventListener('click', () => {
            const exampleType = card.getAttribute('data-example');
            if (codeExamples[exampleType]) {
                codeEditor.value = codeExamples[exampleType];
            }
        });
    });
    
    // Run code function
    runButton.addEventListener('click', () => {
        const code = codeEditor.value;
        if (!code.trim()) {
            outputContent.innerHTML = "<pre>// Please enter some code to run</pre>";
            return;
        }
        
        // Show loading state
        runButton.disabled = true;
        runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        outputContent.innerHTML = "<pre>Executing code...</pre>";
        
        // Record start time
        const startTime = performance.now();
        
        // Simulate execution (in a real implementation, this would call a server API)
        setTimeout(() => {
            const result = simulateK3Execution(code);
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            
            // Display output with execution time
            let outputText = result.output;
            
            if (executionTime < 1) {
                outputText += `\n\n// Execution time: ${Math.round(executionTime * 1000)} ns`;
            } else if (executionTime < 1000) {
                outputText += `\n\n// Execution time: ${executionTime.toFixed(2)} ms`;
            } else {
                outputText += `\n\n// Execution time: ${(executionTime / 1000).toFixed(2)} s`;
            }
            
            outputContent.innerHTML = `<pre>${outputText}</pre>`;
            
            // Reset button state
            runButton.disabled = false;
            runButton.innerHTML = '<i class="fas fa-play"></i> Run';
        }, 500);
    });
    
    // Clear code function
    clearButton.addEventListener('click', () => {
        codeEditor.value = "";
    });
    
    // Clear output function
    clearOutputButton.addEventListener('click', () => {
        outputContent.innerHTML = "<pre>// Output will appear here when you run your code.</pre>";
    });
    
    // Format code function
    formatButton.addEventListener('click', () => {
        const code = codeEditor.value;
        if (!code.trim()) return;
        
        // Simple formatting: fix indentation and spacing
        const formattedCode = formatK3Code(code);
        codeEditor.value = formattedCode;
    });
    
    // Share code function
    shareButton.addEventListener('click', () => {
        const code = codeEditor.value;
        if (!code.trim()) {
            alert("Please write some code before sharing.");
            return;
        }
        
        // Encode the code to base64 to include in URL
        const encodedCode = btoa(encodeURIComponent(code));
        const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodedCode}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                shareButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert("Share URL: " + shareUrl);
            });
    });
    
    // Check for shared code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCode = urlParams.get('code');
    if (sharedCode) {
        try {
            const decodedCode = decodeURIComponent(atob(sharedCode));
            codeEditor.value = decodedCode;
        } catch (e) {
            console.error('Failed to decode shared code:', e);
        }
    }
    
    // Simulate K3 code execution
    function simulateK3Execution(code) {
        try {
            // Parse the code to extract meaningful output
            let output = "";
            
            // Check if code contains a main function
            if (code.includes('fn main()')) {
                // Extract print statements
                const printRegex = /println\s*\(\s*"([^"]*)"/g;
                const printMatches = code.matchAll(printRegex);
                
                for (const match of printMatches) {
                    let printText = match[1];
                    
                    // Handle format strings with {}
                    if (printText.includes('{}')) {
                        // This is a simplified simulation - in reality we'd need to parse the arguments
                        printText = printText.replace(/\{\}/g, '<value>');
                    }
                    
                    output += printText + "\n";
                }
                
                // If we found Fibonacci code, generate actual sequence
                if (code.includes('fibonacci') && output.includes('fibonacci')) {
                    output = "First 10 Fibonacci numbers:\n";
                    let a = 0, b = 1;
                    for (let i = 0; i < 10; i++) {
                        output += `fibonacci(${i}) = ${a}\n`;
                        const temp = a + b;
                        a = b;
                        b = temp;
                    }
                    
                    if (code.includes('Using iteration')) {
                        output += "\nUsing iteration:\n";
                        a = 0, b = 1;
                        for (let i = 0; i < 10; i++) {
                            output += `fibonacci(${i}) = ${a}\n`;
                            const temp = a + b;
                            a = b;
                            b = temp;
                        }
                    }
                }
                
                // If we found Todo app code, generate todo output
                if (code.includes('Todo List')) {
                    output = "Todo List:\n---------\n";
                    output += "1 [ ] - Learn K3\n";
                    output += "2 [ ] - Build a web server\n";
                    output += "3 [x] - Make coffee\n";
                    output += "\nCompleting todo #2...\n";
                    output += "\nUpdated Todo List:\n-----------------\n";
                    output += "1 [ ] - Learn K3\n";
                    output += "2 [x] - Build a web server\n";
                    output += "3 [x] - Make coffee\n";
                }
                
                // If we found sorting code, generate sorting output
                if (code.includes('bubble_sort')) {
                    output = "Original array: [64, 34, 25, 12, 22, 11, 90]\n";
                    output += "Sorted array: [11, 12, 22, 25, 34, 64, 90]\n";
                    output += "\nOriginal fruits: [\"banana\", \"apple\", \"orange\", \"mango\", \"kiwi\"]\n";
                    output += "Sorted fruits: [\"apple\", \"banana\", \"kiwi\", \"mango\", \"orange\"]\n";
                    output += "\nAnother array: [38, 27, 43, 3, 9, 82, 10]\n";
                    output += "Sorted with standard library: [3, 9, 10, 27, 38, 43, 82]\n";
                }
                
                // If we found web server code
                if (code.includes('http.server')) {
                    output = "Server listening on http://localhost:8080\n";
                    output += "\n// Note: This is a simulation. In a real environment, the server would be running and accepting connections.\n";
                }
                
                // If no specific pattern was matched but we have a main function
                if (!output && code.includes('fn main()')) {
                    output = "Hello, K3 World!\n";
                    
                    if (code.includes('let name = "K3"')) {
                        output += "Welcome to K3 version 1.0\n";
                    }
                    
                    if (code.includes('is_awesome')) {
                        output += "K3 is awesome!\n";
                    }
                }
            } else {
                output = "// No main function found. K3 programs should have a main function as the entry point.";
            }
            
            // If no output was generated, provide a message
            if (!output) {
                output = "// Code executed successfully with no output";
            }
            
            return {
                output,
                success: true
            };
        } catch (error) {
            return {
                output: "Error: " + error.message,
                success: false
            };
        }
    }
    
    // Simple K3 code formatter
    function formatK3Code(code) {
        // Split into lines
        const lines = code.split('\n');
        let formattedLines = [];
        let indentLevel = 0;
        
        for (let line of lines) {
            // Remove existing leading whitespace
            const trimmedLine = line.trim();
            
            // Skip empty lines
            if (!trimmedLine) {
                formattedLines.push('');
                continue;
            }
            
            // Decrease indent for closing braces
            if (trimmedLine.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            // Add proper indentation
            const indent = '    '.repeat(indentLevel);
            formattedLines.push(indent + trimmedLine);
            
            // Increase indent after opening braces
            if (trimmedLine.endsWith('{')) {
                indentLevel++;
            }
            
            // Handle if/for/while without braces
            if ((trimmedLine.startsWith('if ') || 
                 trimmedLine.startsWith('for ') || 
                 trimmedLine.startsWith('while ')) && 
                !trimmedLine.endsWith('{')) {
                indentLevel++;
            }
            
            // Decrease indent after standalone statements that would end a block
            if (trimmedLine === 'end' || trimmedLine === 'endif') {
                indentLevel = Math.max(0, indentLevel - 1);
            }
        }
        
        return formattedLines.join('\n');
    }

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
