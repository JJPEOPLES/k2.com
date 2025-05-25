/**
 * K2 Accounts System
 * Provides user authentication, profiles, and tiered access to features
 */

// Account system configuration
const K2AccountSystem = {
    // Account tiers and their features
    tiers: {
        free: {
            name: "Free",
            features: [
                "Access to K2 online runner",
                "Save up to 5 programs",
                "Basic forum access"
            ],
            maxProgramSize: 1000, // lines
            maxSavedPrograms: 5
        },
        basic: {
            name: "Basic",
            features: [
                "Access to K2 online runner",
                "Save up to 20 programs",
                "Full forum access",
                "Code snippets library",
                "Basic debugging tools"
            ],
            maxProgramSize: 5000, // lines
            maxSavedPrograms: 20,
            price: "$5/month"
        },
        pro: {
            name: "Professional",
            features: [
                "Access to K2 online runner",
                "Unlimited saved programs",
                "Full forum access with priority support",
                "Advanced debugging tools",
                "Performance analytics",
                "Custom themes",
                "API access"
            ],
            maxProgramSize: 50000, // lines
            maxSavedPrograms: Infinity,
            price: "$15/month"
        }
    },
    
    // Current user state
    currentUser: null,
    
    // Initialize the account system
    init: function() {
        console.log("Initializing K2 Account System...");
        
        // Check if user is logged in (from localStorage)
        this.checkLoginStatus();
        
        // Set up login/register forms
        this.setupAuthForms();
        
        // Set up account UI elements
        this.updateAccountUI();
        
        console.log("K2 Account System initialized");
    },
    
    // Check if user is already logged in
    checkLoginStatus: function() {
        const savedUser = localStorage.getItem('k2User');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log("User logged in:", this.currentUser.username);
            } catch (e) {
                console.error("Error parsing saved user:", e);
                localStorage.removeItem('k2User');
            }
        }
    },
    
    // Set up authentication forms
    setupAuthForms: function() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                this.login(username, password);
            });
        }
        
        // Register form submission
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('register-username').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                this.register(username, email, password);
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    },
    
    // Update UI based on login status
    updateAccountUI: function() {
        const loginSection = document.getElementById('login-section');
        const accountSection = document.getElementById('account-section');
        const usernameDisplay = document.getElementById('username-display');
        const tierDisplay = document.getElementById('tier-display');
        
        if (this.currentUser) {
            // User is logged in
            if (loginSection) loginSection.style.display = 'none';
            if (accountSection) accountSection.style.display = 'block';
            if (usernameDisplay) usernameDisplay.textContent = this.currentUser.username;
            if (tierDisplay) tierDisplay.textContent = this.currentUser.tier;
            
            // Update feature access based on tier
            this.updateFeatureAccess();
            
            // Load user's saved programs
            this.loadSavedPrograms();
        } else {
            // User is not logged in
            if (loginSection) loginSection.style.display = 'block';
            if (accountSection) accountSection.style.display = 'none';
        }
    },
    
    // Login function
    login: function(username, password) {
        console.log("Attempting login for:", username);
        
        // In a real implementation, this would make an API call to verify credentials
        // For demo purposes, we'll simulate a successful login
        
        // Simulate API call
        setTimeout(() => {
            // Success response
            this.currentUser = {
                username: username,
                email: username + "@example.com",
                tier: "free",
                joinDate: new Date().toISOString(),
                savedPrograms: []
            };
            
            // Save to localStorage
            localStorage.setItem('k2User', JSON.stringify(this.currentUser));
            
            // Update UI
            this.updateAccountUI();
            
            // Show success message
            this.showNotification("Login successful! Welcome, " + username);
        }, 1000);
    },
    
    // Register function
    register: function(username, email, password) {
        console.log("Registering new user:", username, email);
        
        // In a real implementation, this would make an API call to create a new account
        // For demo purposes, we'll simulate a successful registration
        
        // Simulate API call
        setTimeout(() => {
            // Success response
            this.currentUser = {
                username: username,
                email: email,
                tier: "free",
                joinDate: new Date().toISOString(),
                savedPrograms: []
            };
            
            // Save to localStorage
            localStorage.setItem('k2User', JSON.stringify(this.currentUser));
            
            // Update UI
            this.updateAccountUI();
            
            // Show success message
            this.showNotification("Registration successful! Welcome to K2, " + username);
        }, 1000);
    },
    
    // Logout function
    logout: function() {
        console.log("Logging out user:", this.currentUser?.username);
        
        // Clear current user
        this.currentUser = null;
        
        // Remove from localStorage
        localStorage.removeItem('k2User');
        
        // Update UI
        this.updateAccountUI();
        
        // Show message
        this.showNotification("You have been logged out");
    },
    
    // Update feature access based on user tier
    updateFeatureAccess: function() {
        if (!this.currentUser) return;
        
        const tier = this.currentUser.tier;
        const tierInfo = this.tiers[tier];
        
        // Update max program size
        if (window.K2Editor) {
            K2Editor.maxLines = tierInfo.maxProgramSize;
        }
        
        // Update forum access
        const forumSection = document.getElementById('forum-section');
        if (forumSection) {
            if (tier === 'free') {
                // Basic access
                const advancedFeatures = forumSection.querySelectorAll('.advanced-feature');
                advancedFeatures.forEach(el => el.style.display = 'none');
            } else {
                // Full access
                const advancedFeatures = forumSection.querySelectorAll('.advanced-feature');
                advancedFeatures.forEach(el => el.style.display = 'block');
            }
        }
        
        // Update available features list
        const featuresContainer = document.getElementById('account-features');
        if (featuresContainer) {
            featuresContainer.innerHTML = '';
            tierInfo.features.forEach(feature => {
                const featureEl = document.createElement('li');
                featureEl.textContent = feature;
                featuresContainer.appendChild(featureEl);
            });
        }
    },
    
    // Save current program
    saveCurrentProgram: function(name, code) {
        if (!this.currentUser) {
            this.showNotification("Please log in to save programs", "error");
            return false;
        }
        
        // Check if user has reached their limit
        const tierInfo = this.tiers[this.currentUser.tier];
        if (this.currentUser.savedPrograms.length >= tierInfo.maxSavedPrograms) {
            this.showNotification(`You've reached your limit of ${tierInfo.maxSavedPrograms} saved programs. Upgrade to save more!`, "error");
            return false;
        }
        
        // Add program to user's saved programs
        const program = {
            id: Date.now().toString(),
            name: name,
            code: code,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.currentUser.savedPrograms.push(program);
        
        // Save updated user data
        localStorage.setItem('k2User', JSON.stringify(this.currentUser));
        
        // Update UI
        this.loadSavedPrograms();
        
        // Show success message
        this.showNotification(`Program "${name}" saved successfully`);
        
        return true;
    },
    
    // Load saved programs
    loadSavedPrograms: function() {
        if (!this.currentUser) return;
        
        const programsContainer = document.getElementById('saved-programs');
        if (!programsContainer) return;
        
        // Clear container
        programsContainer.innerHTML = '';
        
        // Add each program
        if (this.currentUser.savedPrograms.length === 0) {
            programsContainer.innerHTML = '<p>No saved programs yet.</p>';
        } else {
            this.currentUser.savedPrograms.forEach(program => {
                const programEl = document.createElement('div');
                programEl.className = 'saved-program';
                programEl.innerHTML = `
                    <h4>${program.name}</h4>
                    <p>Created: ${new Date(program.created).toLocaleDateString()}</p>
                    <div class="program-actions">
                        <button class="load-program" data-id="${program.id}">Load</button>
                        <button class="delete-program" data-id="${program.id}">Delete</button>
                    </div>
                `;
                programsContainer.appendChild(programEl);
            });
            
            // Add event listeners
            programsContainer.querySelectorAll('.load-program').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const programId = e.target.getAttribute('data-id');
                    this.loadProgram(programId);
                });
            });
            
            programsContainer.querySelectorAll('.delete-program').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const programId = e.target.getAttribute('data-id');
                    this.deleteProgram(programId);
                });
            });
        }
    },
    
    // Load a specific program
    loadProgram: function(programId) {
        if (!this.currentUser) return;
        
        const program = this.currentUser.savedPrograms.find(p => p.id === programId);
        if (!program) return;
        
        // Load program into editor
        if (window.K2Editor && window.K2Editor.setCode) {
            window.K2Editor.setCode(program.code);
            this.showNotification(`Program "${program.name}" loaded`);
        }
    },
    
    // Delete a saved program
    deleteProgram: function(programId) {
        if (!this.currentUser) return;
        
        // Filter out the program to delete
        this.currentUser.savedPrograms = this.currentUser.savedPrograms.filter(p => p.id !== programId);
        
        // Save updated user data
        localStorage.setItem('k2User', JSON.stringify(this.currentUser));
        
        // Update UI
        this.loadSavedPrograms();
        
        // Show success message
        this.showNotification("Program deleted");
    },
    
    // Upgrade account tier
    upgradeTier: function(newTier) {
        if (!this.currentUser) return;
        if (!this.tiers[newTier]) return;
        
        console.log(`Upgrading user ${this.currentUser.username} to ${newTier} tier`);
        
        // In a real implementation, this would handle payment processing
        // For demo purposes, we'll just update the tier
        
        // Update user tier
        this.currentUser.tier = newTier;
        
        // Save updated user data
        localStorage.setItem('k2User', JSON.stringify(this.currentUser));
        
        // Update UI
        this.updateAccountUI();
        
        // Show success message
        this.showNotification(`Your account has been upgraded to ${this.tiers[newTier].name} tier!`);
    },
    
    // Show notification to user
    showNotification: function(message, type = "success") {
        console.log(`Notification (${type}):`, message);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to document
        const notificationsContainer = document.getElementById('notifications');
        if (notificationsContainer) {
            notificationsContainer.appendChild(notification);
            
            // Remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    K2AccountSystem.init();
});