// K3 Website Loading Bar
document.addEventListener('DOMContentLoaded', function() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    // Create loading container
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    
    // Create K3 logo
    const logo = document.createElement('div');
    logo.className = 'loading-logo';
    logo.innerHTML = '<span>K3</span>';
    
    // Create loading bar
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    
    // Create loading progress
    const loadingProgress = document.createElement('div');
    loadingProgress.className = 'loading-progress';
    loadingProgress.style.background = 'linear-gradient(90deg, #15AABF, #4C6EF5)';
    
    // Create loading text
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = 'Initializing...';
    
    // Append elements
    loadingBar.appendChild(loadingProgress);
    loadingContainer.appendChild(logo);
    loadingContainer.appendChild(loadingBar);
    loadingContainer.appendChild(loadingText);
    loadingOverlay.appendChild(loadingContainer);
    document.body.appendChild(loadingOverlay);
    
    // Loading messages
    const loadingMessages = [
        'Initializing K3 environment...',
        'Loading advanced type system...',
        'Preparing Stellar UI components...',
        'Configuring memory-safe operations...',
        'Establishing connection to K3 server...',
        'Loading documentation...',
        'Optimizing performance...',
        'Almost ready...'
    ];
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress >= 100) {
            progress = 100;
            loadingText.textContent = 'Ready!';
            
            // Hide loading overlay after a short delay
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 500);
            
            clearInterval(interval);
        } else {
            // Update loading message
            const messageIndex = Math.min(
                Math.floor(progress / (100 / loadingMessages.length)),
                loadingMessages.length - 1
            );
            loadingText.textContent = loadingMessages[messageIndex];
        }
        
        // Update loading bar
        loadingProgress.style.width = `${progress}%`;
    }, 250);
});