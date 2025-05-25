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
    apiUrl: '/api/account',
    
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
        const savedToken = localStorage.getItem('k2Token');
        
        if (savedUser && savedToken) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.currentUser.token = savedToken;
                console.log("User logged in:", this.currentUser.username);
                
                // Verify token with server (optional)
                this.verifyToken();
            } catch (e) {
                console.error("Error parsing saved user:", e);
                localStorage.removeItem('k2User');
                localStorage.removeItem('k2Token');
            }
        }
    },
    
    // Verify token with server
    verifyToken: function() {
        // In a real implementation, verify the token with the server
        // For now, we'll just assume it's valid
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
        
        // Show loading state
        const loginForm = document.getElementById('login-form');
        const loginButton = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
        
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        }
        
        // Make API call to verify credentials
        fetch(this.apiUrl + '?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Login successful
                this.currentUser = data.data;
                
                // Token is provided by the server
                const token = this.currentUser.token;
                if (!token) {
                    console.error("No token received from server");
                    this.showNotification("Authentication error. Please try again.", "error");
                    return;
                }
                
                // Save to localStorage
                localStorage.setItem('k2User', JSON.stringify(this.currentUser));
                localStorage.setItem('k2Token', token);
                
                // Update UI
                this.updateAccountUI();
                
                // Show success message
                this.showNotification("Login successful! Welcome, " + this.currentUser.username);
            } else {
                // Login failed
                this.showNotification(data.error.message || "Login failed. Please check your credentials.", "error");
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            this.showNotification("Login failed. Please try again later.", "error");
        })
        .finally(() => {
            // Reset button state
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.innerHTML = 'Sign In';
            }
        });
    },
    
    // Register function
    register: function(username, email, password) {
        console.log("Registering new user:", username, email);
        
        // Show loading state
        const registerForm = document.getElementById('register-form');
        const registerButton = registerForm ? registerForm.querySelector('button[type="submit"]') : null;
        
        if (registerButton) {
            registerButton.disabled = true;
            registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        }
        
        // Make API call to create a new account
        fetch(this.apiUrl + '?action=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Registration successful
                this.currentUser = data.data;
                
                // Token is provided by the server
                const token = this.currentUser.token;
                if (!token) {
                    console.error("No token received from server");
                    this.showNotification("Authentication error. Please try again.", "error");
                    return;
                }
                
                // Save to localStorage
                localStorage.setItem('k2User', JSON.stringify(this.currentUser));
                localStorage.setItem('k2Token', token);
                
                // Update UI
                this.updateAccountUI();
                
                // Show success message
                this.showNotification("Registration successful! Welcome to K2, " + this.currentUser.username);
            } else {
                // Registration failed
                this.showNotification(data.error.message || "Registration failed. Please try again.", "error");
            }
        })
        .catch(error => {
            console.error("Registration error:", error);
            this.showNotification("Registration failed. Please try again later.", "error");
        })
        .finally(() => {
            // Reset button state
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.innerHTML = 'Create Account';
            }
        });
    },
    
    // Logout function
    logout: function() {
        console.log("Logging out user:", this.currentUser?.username);
        
        // Clear current user
        this.currentUser = null;
        
        // Remove from localStorage
        localStorage.removeItem('k2User');
        localStorage.removeItem('k2Token');
        
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
        
        // Show loading state
        const saveButton = document.querySelector('#save-program-form button[type="submit"]') || 
                          document.querySelector('#save-program-modal button[type="submit"]');
        
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }
        
        // Make API call to save program
        fetch(this.apiUrl + '?action=save_program', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: this.currentUser.id,
                token: this.currentUser.token,
                name: name,
                code: code
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Program saved successfully
                
                // If we don't have savedPrograms array yet, create it
                if (!this.currentUser.saved_programs) {
                    this.currentUser.saved_programs = [];
                }
                
                // Add program to user's saved programs
                const program = data.data;
                
                // Check if program already exists (update)
                const existingIndex = this.currentUser.saved_programs.findIndex(p => p.id === program.id);
                if (existingIndex >= 0) {
                    this.currentUser.saved_programs[existingIndex] = program;
                } else {
                    this.currentUser.saved_programs.push(program);
                }
                
                // Save updated user data
                localStorage.setItem('k2User', JSON.stringify(this.currentUser));
                
                // Update UI
                this.loadSavedPrograms();
                
                // Show success message
                this.showNotification(`Program "${name}" saved successfully`);
                
                return true;
            } else {
                // Save failed
                this.showNotification(data.error.message || "Failed to save program", "error");
                return false;
            }
        })
        .catch(error => {
            console.error("Save program error:", error);
            this.showNotification("Failed to save program. Please try again later.", "error");
            return false;
        })
        .finally(() => {
            // Reset button state
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.innerHTML = 'Save Program';
            }
        });
        
        return true; // Return true to close modal, actual result handled in promise
    },
    
    // Load saved programs
    loadSavedPrograms: function() {
        if (!this.currentUser) return;
        
        const programsContainer = document.getElementById('saved-programs');
        if (!programsContainer) return;
        
        // Show loading state
        programsContainer.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Loading programs...</p>';
        
        // Make API call to get programs
        fetch(this.apiUrl + '?action=get_programs&user_id=' + this.currentUser.id + '&token=' + this.currentUser.token)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update user's saved programs
                this.currentUser.saved_programs = data.data.programs;
                
                // Save updated user data
                localStorage.setItem('k2User', JSON.stringify(this.currentUser));
                
                // Clear container
                programsContainer.innerHTML = '';
                
                // Add each program
                if (this.currentUser.saved_programs.length === 0) {
                    programsContainer.innerHTML = '<p>No saved programs yet.</p>';
                } else {
                    this.currentUser.saved_programs.forEach(program => {
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
            } else {
                // Load failed
                programsContainer.innerHTML = '<p>Failed to load programs. Please try again later.</p>';
                this.showNotification(data.error.message || "Failed to load programs", "error");
            }
        })
        .catch(error => {
            console.error("Load programs error:", error);
            programsContainer.innerHTML = '<p>Failed to load programs. Please try again later.</p>';
            this.showNotification("Failed to load programs. Please try again later.", "error");
        });
    },
    
    // Load a specific program
    loadProgram: function(programId) {
        if (!this.currentUser) return;
        
        // Show loading state
        const loadButton = document.querySelector(`.load-program[data-id="${programId}"]`);
        if (loadButton) {
            loadButton.disabled = true;
            loadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        
        // Make API call to get program code
        fetch(this.apiUrl + '?action=get_programs&user_id=' + this.currentUser.id + '&token=' + this.currentUser.token)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Find program in the response
                const program = data.data.programs.find(p => p.id == programId);
                
                if (program) {
                    // Load program into editor
                    if (window.K2Editor && window.K2Editor.setCode) {
                        window.K2Editor.setCode(program.code);
                        this.showNotification(`Program "${program.name}" loaded`);
                    }
                } else {
                    this.showNotification("Program not found", "error");
                }
            } else {
                // Load failed
                this.showNotification(data.error.message || "Failed to load program", "error");
            }
        })
        .catch(error => {
            console.error("Load program error:", error);
            this.showNotification("Failed to load program. Please try again later.", "error");
        })
        .finally(() => {
            // Reset button state
            if (loadButton) {
                loadButton.disabled = false;
                loadButton.innerHTML = 'Load';
            }
        });
    },
    
    // Delete a saved program
    deleteProgram: function(programId) {
        if (!this.currentUser) return;
        
        // Show loading state
        const deleteButton = document.querySelector(`.delete-program[data-id="${programId}"]`);
        if (deleteButton) {
            deleteButton.disabled = true;
            deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        
        // Make API call to delete program
        fetch(this.apiUrl + '?action=delete_program', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: this.currentUser.id,
                token: this.currentUser.token,
                program_id: programId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Program deleted successfully
                
                // Update local data
                if (this.currentUser.saved_programs) {
                    this.currentUser.saved_programs = this.currentUser.saved_programs.filter(p => p.id != programId);
                    
                    // Save updated user data
                    localStorage.setItem('k2User', JSON.stringify(this.currentUser));
                }
                
                // Update UI
                this.loadSavedPrograms();
                
                // Show success message
                this.showNotification("Program deleted successfully");
            } else {
                // Delete failed
                this.showNotification(data.error.message || "Failed to delete program", "error");
                
                // Reset button state
                if (deleteButton) {
                    deleteButton.disabled = false;
                    deleteButton.innerHTML = 'Delete';
                }
            }
        })
        .catch(error => {
            console.error("Delete program error:", error);
            this.showNotification("Failed to delete program. Please try again later.", "error");
            
            // Reset button state
            if (deleteButton) {
                deleteButton.disabled = false;
                deleteButton.innerHTML = 'Delete';
            }
        });
    },
    
    // Upgrade account tier
    upgradeTier: function(newTier) {
        if (!this.currentUser) return;
        if (!this.tiers[newTier]) return;
        
        console.log(`Upgrading user ${this.currentUser.username} to ${newTier} tier`);
        
        // Show loading state
        const upgradeButton = document.querySelector(`.upgrade-btn[data-tier="${newTier}"]`);
        if (upgradeButton) {
            upgradeButton.disabled = true;
            upgradeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Upgrading...';
        }
        
        // Make API call to upgrade tier
        fetch(this.apiUrl + '?action=upgrade', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: this.currentUser.id,
                token: this.currentUser.token,
                tier: newTier
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Upgrade successful
                
                // Update user tier
                this.currentUser.tier = newTier;
                
                // Save updated user data
                localStorage.setItem('k2User', JSON.stringify(this.currentUser));
                
                // Update UI
                this.updateAccountUI();
                
                // Show success message
                this.showNotification(`Your account has been upgraded to ${this.tiers[newTier].name} tier!`);
            } else {
                // Upgrade failed
                this.showNotification(data.error.message || "Failed to upgrade account", "error");
            }
        })
        .catch(error => {
            console.error("Upgrade error:", error);
            this.showNotification("Failed to upgrade account. Please try again later.", "error");
        })
        .finally(() => {
            // Reset button state
            if (upgradeButton) {
                upgradeButton.disabled = false;
                upgradeButton.innerHTML = `Upgrade to ${this.tiers[newTier].name}`;
            }
        });
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