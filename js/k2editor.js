/**
 * K2 Editor System
 * Provides enhanced code editing capabilities with account integration
 */

const K2Editor = {
    // Editor configuration
    maxLines: 1000, // Default limit, will be updated based on account tier
    currentCode: '',
    editor: null,
    output: null,
    
    // Initialize the editor
    init: function() {
        console.log("Initializing K2 Editor System...");
        
        // Get editor elements
        this.editor = document.getElementById('code-editor');
        this.output = document.getElementById('code-output');
        
        if (!this.editor) {
            console.warn("Code editor element not found");
            return;
        }
        
        // Set up editor events
        this.setupEditorEvents();
        
        // Load saved code if available
        this.loadSavedCode();
        
        // Update max lines based on account tier
        this.updateMaxLines();
        
        console.log("K2 Editor System initialized");
    },
    
    // Set up editor events
    setupEditorEvents: function() {
        if (!this.editor) return;
        
        // Auto-save code as user types
        this.editor.addEventListener('input', () => {
            this.currentCode = this.editor.value;
            this.saveCodeToLocalStorage();
        });
        
        // Tab key handling
        this.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                
                // Insert tab at cursor position
                const start = this.editor.selectionStart;
                const end = this.editor.selectionEnd;
                
                this.editor.value = this.editor.value.substring(0, start) + '    ' + this.editor.value.substring(end);
                
                // Move cursor after the inserted tab
                this.editor.selectionStart = this.editor.selectionEnd = start + 4;
                
                // Update saved code
                this.currentCode = this.editor.value;
                this.saveCodeToLocalStorage();
            }
        });
        
        // Check line count on change
        this.editor.addEventListener('input', () => {
            this.checkLineCount();
        });
    },
    
    // Load saved code from localStorage
    loadSavedCode: function() {
        if (!this.editor) return;
        
        const savedCode = localStorage.getItem('k2_current_code');
        if (savedCode) {
            this.editor.value = savedCode;
            this.currentCode = savedCode;
        }
    },
    
    // Save code to localStorage
    saveCodeToLocalStorage: function() {
        localStorage.setItem('k2_current_code', this.currentCode);
    },
    
    // Set code in the editor
    setCode: function(code) {
        if (!this.editor) return;
        
        this.editor.value = code;
        this.currentCode = code;
        this.saveCodeToLocalStorage();
        this.checkLineCount();
    },
    
    // Get code from the editor
    getCode: function() {
        return this.currentCode;
    },
    
    // Check if code exceeds line limit
    checkLineCount: function() {
        if (!this.editor) return;
        
        const lines = this.editor.value.split('\n');
        const lineCount = lines.length;
        
        if (lineCount > this.maxLines) {
            // Show warning
            if (window.K2AccountSystem) {
                window.K2AccountSystem.showNotification(`You've exceeded the ${this.maxLines} line limit for your account tier. Please upgrade to write longer programs.`, "error");
            }
            
            // Truncate code to max lines
            this.editor.value = lines.slice(0, this.maxLines).join('\n');
            this.currentCode = this.editor.value;
            this.saveCodeToLocalStorage();
        }
    },
    
    // Update max lines based on account tier
    updateMaxLines: function() {
        if (window.K2AccountSystem && window.K2AccountSystem.currentUser) {
            const tier = window.K2AccountSystem.currentUser.tier;
            const tierInfo = window.K2AccountSystem.tiers[tier];
            
            if (tierInfo && tierInfo.maxProgramSize) {
                this.maxLines = tierInfo.maxProgramSize;
                console.log(`Updated max lines to ${this.maxLines} based on ${tier} tier`);
            }
        }
    },
    
    // Clear the editor
    clearCode: function() {
        if (!this.editor) return;
        
        this.editor.value = '';
        this.currentCode = '';
        this.saveCodeToLocalStorage();
    },
    
    // Clear the output
    clearOutput: function() {
        if (!this.output) return;
        
        this.output.textContent = '// Output will appear here when you run your code';
    },
    
    // Set output text
    setOutput: function(text) {
        if (!this.output) return;
        
        this.output.textContent = text;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    K2Editor.init();
});