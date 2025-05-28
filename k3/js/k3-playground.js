// K3 Playground JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Ace Editor if it exists
    if (typeof ace !== 'undefined' && document.getElementById('editor')) {
        const editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/javascript"); // Using JavaScript mode as a fallback
        editor.setShowPrintMargin(false);
        
        // Custom syntax highlighting for K3
        // This would be more comprehensive in a real implementation
        const customMode = {
            getTokenizer: function() {
                return {
                    getLineTokens: function(line, state) {
                        // Simple tokenization for demo purposes
                        const tokens = [];
                        let current = '';
                        let type = 'text';
                        
                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            
                            // Handle comments
                            if (char === '/' && line[i + 1] === '/') {
                                if (current) {
                                    tokens.push({ type, value: current });
                                    current = '';
                                }
                                tokens.push({ type: 'comment', value: line.substring(i) });
                                break;
                            }
                            
                            // Handle keywords
                            if (/\s/.test(char) && current) {
                                const keywords = ['fn', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'class', 'interface', 'import', 'export', 'this', 'new', 'true', 'false', 'null'];
                                if (keywords.includes(current)) {
                                    tokens.push({ type: 'keyword', value: current });
                                } else {
                                    tokens.push({ type, value: current });
                                }
                                tokens.push({ type: 'text', value: char });
                                current = '';
                                type = 'text';
                                continue;
                            }
                            
                            // Handle strings
                            if (char === '"' || char === "'") {
                                if (type === 'string') {
                                    current += char;
                                    tokens.push({ type, value: current });
                                    current = '';
                                    type = 'text';
                                } else {
                                    if (current) {
                                        tokens.push({ type, value: current });
                                        current = '';
                                    }
                                    current = char;
                                    type = 'string';
                                }
                                continue;
                            }
                            
                            current += char;
                        }
                        
                        if (current) {
                            tokens.push({ type, value: current });
                        }
                        
                        return { tokens, state };
                    }
                };
            }
        };
        
        // Register custom mode
        ace.define('ace/mode/k3', ['require', 'exports', 'module'], function(require, exports, module) {
            exports.Mode = function() {
                this.getTokenizer = customMode.getTokenizer;
            };
        });
        
        // Set custom mode
        editor.session.setMode('ace/mode/k3');
    }
    
    // Example code snippets
    const examples = {
        hello: `// Hello World in K3
fn main() {
    println("Hello, World from K3!")
}`,
        fibonacci: `// Fibonacci sequence in K3
fn main() {
    println("Fibonacci Sequence:")
    for (let i = 0; i < 10; i++) {
        println("fib(" + i + ") = " + fibonacci(i))
    }
}

fn fibonacci(n: int) -> int {
    if (n <= 1) {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}`,
        classes: `// Classes and inheritance in K3
fn main() {
    let circle = new Circle(5.0)
    let rectangle = new Rectangle(4.0, 6.0)
    
    println("Circle area: " + circle.area())
    println("Rectangle area: " + rectangle.area())
}

interface Shape {
    fn area() -> float
    fn perimeter() -> float
}

class Circle implements Shape {
    let radius: float
    
    fn constructor(r: float) {
        this.radius = r
    }
    
    fn area() -> float {
        return 3.14159 * this.radius * this.radius
    }
    
    fn perimeter() -> float {
        return 2 * 3.14159 * this.radius
    }
}

class Rectangle implements Shape {
    let width: float
    let height: float
    
    fn constructor(w: float, h: float) {
        this.width = w
        this.height = h
    }
    
    fn area() -> float {
        return this.width * this.height
    }
    
    fn perimeter() -> float {
        return 2 * (this.width + this.height)
    }
}`,
        generics: `// Generics in K3
fn main() {
    let numbers = [1, 2, 3, 4, 5]
    let doubled = map(numbers, fn(x) -> int { return x * 2 })
    
    println("Original numbers: " + numbers)
    println("Doubled numbers: " + doubled)
    
    let stack = new Stack<string>()
    stack.push("Hello")
    stack.push("World")
    
    println(stack.pop())  // World
    println(stack.pop())  // Hello
}

fn map<T, U>(array: T[], mapper: fn(T) -> U) -> U[] {
    let result: U[] = []
    for (let i = 0; i < array.length; i++) {
        result.push(mapper(array[i]))
    }
    return result
}

class Stack<T> {
    let items: T[] = []
    
    fn push(item: T) -> void {
        this.items.push(item)
    }
    
    fn pop() -> T? {
        if (this.items.length == 0) {
            return null
        }
        return this.items.pop()
    }
}`,
        stellar: `// Stellar UI example in K3
import Stellar from "stellar/ui"

fn main() {
    Stellar.render(<App />, "#app")
}

class Counter extends Stellar.Component {
    state = {
        count: 0
    }
    
    fn increment() {
        this.setState({ count: this.state.count + 1 })
    }
    
    fn decrement() {
        this.setState({ count: this.state.count - 1 })
    }
    
    fn render() -> Stellar.Element {
        return <div class="counter">
            <h2>Counter: {this.state.count}</h2>
            <div class="buttons">
                <button onClick={this.decrement}>-</button>
                <button onClick={this.increment}>+</button>
            </div>
        </div>
    }
}

class App extends Stellar.Component {
    fn render() -> Stellar.Element {
        return <div class="app">
            <h1>Stellar UI Demo</h1>
            <Counter />
        </div>
    }
}`
    };
    
    // Load example code if example buttons exist
    document.querySelectorAll('.example-item').forEach(item => {
        item.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            if (examples[example] && typeof ace !== 'undefined') {
                const editor = ace.edit("editor");
                editor.setValue(examples[example]);
                editor.clearSelection();
                
                // Close examples menu if it exists
                const examplesMenu = document.getElementById('examples-menu');
                if (examplesMenu) {
                    examplesMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Run button functionality
    const runButton = document.getElementById('run-button');
    if (runButton) {
        runButton.addEventListener('click', function() {
            const editor = ace.edit("editor");
            const code = editor.getValue();
            const output = document.getElementById('output');
            
            if (!output) return;
            
            // Clear previous output
            output.innerHTML = '';
            
            // Simulate running the code
            output.innerHTML += '> Compiling K3 code...\n';
            
            setTimeout(() => {
                output.innerHTML += '> Running program...\n\n';
                
                // Simple simulation of program execution
                if (code.includes('println')) {
                    const printStatements = code.match(/println\((.*?)\)/g);
                    if (printStatements) {
                        printStatements.forEach(statement => {
                            try {
                                // Extract the content inside println()
                                const content = statement.match(/println\((.*?)\)/)[1];
                                
                                // Simple evaluation (this is just a simulation)
                                let result = content;
                                
                                // Handle string literals
                                if (content.startsWith('"') && content.endsWith('"')) {
                                    result = content.slice(1, -1);
                                }
                                
                                // Handle simple string concatenation
                                result = result.replace(/"\s*\+\s*"/g, '');
                                result = result.replace(/"\s*\+\s*([\w\.]+)/g, (match, p1) => {
                                    if (p1 === 'version') return '1.0';
                                    if (p1 === 'name') return 'K3';
                                    if (p1.includes('numbers')) return '[1, 2, 3, 4, 5]';
                                    if (p1.includes('sum')) return '15';
                                    if (p1.includes('fibonacci')) {
                                        const num = parseInt(p1.match(/\d+/));
                                        if (!isNaN(num)) {
                                            const fibs = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
                                            return fibs[num] || 'n';
                                        }
                                    }
                                    if (p1.includes('area')) return p1.includes('Circle') ? '78.53975' : '24.0';
                                    return p1;
                                });
                                result = result.replace(/([\w\.]+)\s*\+\s*"/g, (match, p1) => {
                                    return p1 + '';
                                });
                                
                                output.innerHTML += result + '\n';
                            } catch (e) {
                                output.innerHTML += 'Error evaluating print statement\n';
                            }
                        });
                    }
                } else {
                    output.innerHTML += 'Program executed successfully with no output.\n';
                }
                
                output.innerHTML += '\n> Program finished with exit code 0';
            }, 500);
        });
    }
    
    // Format button functionality
    const formatButton = document.getElementById('format-button');
    if (formatButton) {
        formatButton.addEventListener('click', function() {
            // Simple formatting simulation
            const editor = ace.edit("editor");
            const code = editor.getValue();
            
            // Add missing semicolons (K3 doesn't require them, but for demonstration)
            let formatted = code;
            
            editor.setValue(formatted);
            editor.clearSelection();
        });
    }
    
    // Clear button functionality
    const clearButton = document.getElementById('clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            const output = document.getElementById('output');
            if (output) {
                output.innerHTML = '// Run your code to see the output here';
            }
        });
    }
    
    // Examples dropdown
    const examplesButton = document.getElementById('examples-button');
    const examplesMenu = document.getElementById('examples-menu');
    
    if (examplesButton && examplesMenu) {
        examplesButton.addEventListener('click', function() {
            examplesMenu.classList.toggle('active');
        });
        
        // Close examples menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!examplesButton.contains(event.target) && !examplesMenu.contains(event.target)) {
                examplesMenu.classList.remove('active');
            }
        });
    }
});