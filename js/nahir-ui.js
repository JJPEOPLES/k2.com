// Nahir UI Framework JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Nahir UI components
    initNahirUI();
    
    // Add event listener to the Nahir button in the demo
    const nahirButton = document.querySelector('.nahir-button');
    if (nahirButton) {
        nahirButton.addEventListener('click', function() {
            // Show the console output when button is clicked
            const consoleContent = document.querySelector('.nahir-console-content');
            if (consoleContent) {
                consoleContent.style.display = 'block';
                
                // Add animation to the console lines
                const consoleLines = document.querySelectorAll('.nahir-console-line');
                consoleLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.opacity = '1';
                    }, index * 300);
                });
            }
        });
    }
});

function initNahirUI() {
    console.log('Nahir UI Framework initialized');
    
    // Hide console content initially
    const consoleContent = document.querySelector('.nahir-console-content');
    if (consoleContent) {
        consoleContent.style.display = 'none';
    }
    
    // Set initial opacity for console lines
    const consoleLines = document.querySelectorAll('.nahir-console-line');
    consoleLines.forEach(line => {
        line.style.opacity = '0';
        line.style.transition = 'opacity 0.3s ease';
    });
    
    // Add animation to Nahir feature cards
    const featureCards = document.querySelectorAll('.nahir-feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Animate cards when they come into view
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
}

// Add ramdisk cache integration for Nahir UI components
class NahirCache {
    constructor() {
        this.cacheEnabled = true;
        this.cachePrefix = 'nahir_';
    }
    
    // Store component state in cache
    storeComponent(componentId, state) {
        if (!this.cacheEnabled) return;
        
        try {
            localStorage.setItem(this.cachePrefix + componentId, JSON.stringify(state));
            console.log(`Component ${componentId} cached successfully`);
        } catch (error) {
            console.error('Error caching component:', error);
        }
    }
    
    // Retrieve component state from cache
    retrieveComponent(componentId) {
        if (!this.cacheEnabled) return null;
        
        try {
            const cachedState = localStorage.getItem(this.cachePrefix + componentId);
            return cachedState ? JSON.parse(cachedState) : null;
        } catch (error) {
            console.error('Error retrieving cached component:', error);
            return null;
        }
    }
    
    // Clear component from cache
    clearComponent(componentId) {
        if (!this.cacheEnabled) return;
        
        try {
            localStorage.removeItem(this.cachePrefix + componentId);
            console.log(`Component ${componentId} removed from cache`);
        } catch (error) {
            console.error('Error clearing cached component:', error);
        }
    }
    
    // Clear all Nahir components from cache
    clearAllComponents() {
        if (!this.cacheEnabled) return;
        
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.cachePrefix)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('All Nahir components cleared from cache');
        } catch (error) {
            console.error('Error clearing all cached components:', error);
        }
    }
    
    // Enable or disable caching
    setEnabled(enabled) {
        this.cacheEnabled = enabled;
        console.log(`Nahir caching ${enabled ? 'enabled' : 'disabled'}`);
    }
}

// Initialize the Nahir cache
const nahirCache = new NahirCache();