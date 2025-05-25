/**
 * K2 Forum System
 * Provides discussion forums, code sharing, and community features
 */

const K2ForumSystem = {
    // Forum categories
    categories: [
        {
            id: "announcements",
            name: "Announcements",
            description: "Official announcements about K2 language and platform",
            isReadOnly: true
        },
        {
            id: "general",
            name: "General Discussion",
            description: "General discussion about K2 programming language",
            isReadOnly: false
        },
        {
            id: "help",
            name: "Help & Support",
            description: "Get help with K2 programming problems",
            isReadOnly: false
        },
        {
            id: "showcase",
            name: "Project Showcase",
            description: "Share your K2 projects and get feedback",
            isReadOnly: false
        },
        {
            id: "tutorials",
            name: "Tutorials & Resources",
            description: "Tutorials, guides, and learning resources",
            isReadOnly: false
        },
        {
            id: "advanced",
            name: "Advanced Techniques",
            description: "Advanced programming techniques and optimizations",
            isReadOnly: false,
            requiresPro: true
        }
    ],
    
    // Current forum state
    currentCategory: null,
    currentThread: null,
    
    // Sample threads (in a real implementation, these would come from a database)
    sampleThreads: {
        "announcements": [
            {
                id: "ann1",
                title: "K2 Language v1.5 Released",
                author: "admin",
                date: "2023-06-15T10:00:00Z",
                content: "We're excited to announce the release of K2 Language v1.5! This update includes performance improvements, new string manipulation functions, and better error handling.",
                replies: [
                    {
                        author: "user123",
                        date: "2023-06-15T10:30:00Z",
                        content: "Great update! The new string functions are exactly what I needed."
                    },
                    {
                        author: "coder42",
                        date: "2023-06-15T11:15:00Z",
                        content: "The performance improvements are impressive. My complex algorithms run 30% faster now."
                    }
                ]
            },
            {
                id: "ann2",
                title: "Introducing K2 Account System",
                author: "admin",
                date: "2023-07-01T09:00:00Z",
                content: "Today we're launching the new K2 Account System! This brings tiered accounts, saved programs, and forum access to all K2 users.",
                replies: [
                    {
                        author: "newbie",
                        date: "2023-07-01T09:45:00Z",
                        content: "This is awesome! I've been waiting for a way to save my programs."
                    }
                ]
            }
        ],
        "general": [
            {
                id: "gen1",
                title: "What are you building with K2?",
                author: "curious_coder",
                date: "2023-06-20T14:30:00Z",
                content: "I'm curious what kinds of projects everyone is working on with K2. I'm currently building a simple game engine. What about you?",
                replies: [
                    {
                        author: "dev_jane",
                        date: "2023-06-20T15:10:00Z",
                        content: "I'm working on a data visualization tool for scientific research. K2's performance makes it perfect for processing large datasets."
                    },
                    {
                        author: "programmer_bob",
                        date: "2023-06-20T16:45:00Z",
                        content: "I'm teaching K2 to my students. We're building simple algorithms and games to learn programming concepts."
                    }
                ]
            }
        ],
        "help": [
            {
                id: "help1",
                title: "How to optimize recursive functions?",
                author: "optimization_needed",
                date: "2023-06-25T11:20:00Z",
                content: "I'm writing a recursive function to calculate Fibonacci numbers, but it's very slow for large inputs. Any tips for optimizing this in K2?",
                replies: [
                    {
                        author: "performance_guru",
                        date: "2023-06-25T11:45:00Z",
                        content: "You should use memoization to store previously calculated values. Here's an example:\n\n```\nvar memo = {};\n\nfunction fib(n) {\n    if (n in memo) return memo[n];\n    if (n <= 1) return n;\n    memo[n] = fib(n-1) + fib(n-2);\n    return memo[n];\n}\n```"
                    },
                    {
                        author: "algorithm_expert",
                        date: "2023-06-25T12:30:00Z",
                        content: "Another approach is to use an iterative solution instead of recursion:\n\n```\nfunction fib(n) {\n    if (n <= 1) return n;\n    var a = 0, b = 1;\n    for (var i = 2; i <= n; i++) {\n        var c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}\n```"
                    }
                ]
            }
        ],
        "showcase": [
            {
                id: "show1",
                title: "K2 Pathfinding Visualization",
                author: "graph_lover",
                date: "2023-06-28T16:00:00Z",
                content: "I built a pathfinding algorithm visualization using K2. It demonstrates A*, Dijkstra's, and BFS algorithms on various grid layouts. Check it out and let me know what you think!\n\n```\n// Sample code from the project\nfunction aStar(start, goal) {\n    var openSet = [start];\n    var cameFrom = {};\n    var gScore = {};\n    gScore[start] = 0;\n    var fScore = {};\n    fScore[start] = heuristic(start, goal);\n    \n    // Rest of algorithm...\n}\n```",
                replies: [
                    {
                        author: "algorithm_fan",
                        date: "2023-06-28T16:45:00Z",
                        content: "This is really impressive! The visualization is clear and the code is well-structured. Have you considered adding bidirectional search?"
                    }
                ]
            }
        ],
        "tutorials": [
            {
                id: "tut1",
                title: "Beginner's Guide to K2 Programming",
                author: "teacher_dev",
                date: "2023-06-10T13:00:00Z",
                content: "I've created a comprehensive guide for beginners learning K2. It covers basic syntax, variables, control structures, and functions with plenty of examples.\n\nPart 1: Getting Started\n\n```\n// Your first K2 program\nprint(\"Hello, World!\");\n\n// Variables\nvar name = \"K2 Programmer\";\nvar age = 25;\nprint(\"Hello, \" + name);\n```",
                replies: [
                    {
                        author: "complete_newbie",
                        date: "2023-06-10T14:20:00Z",
                        content: "Thank you so much for this guide! I've been struggling to get started with K2, and this explains everything clearly."
                    },
                    {
                        author: "teacher_dev",
                        date: "2023-06-10T15:00:00Z",
                        content: "You're welcome! I'll be posting Part 2 next week, covering more advanced topics like arrays and objects."
                    }
                ]
            }
        ],
        "advanced": [
            {
                id: "adv1",
                title: "Implementing a Custom Memory Manager in K2",
                author: "performance_wizard",
                date: "2023-06-30T09:15:00Z",
                content: "I've been working on a custom memory manager for K2 to optimize memory usage in large applications. Here's my approach and some benchmark results.\n\n```\n// Custom memory pool implementation\nfunction MemoryPool(blockSize, totalBlocks) {\n    this.memory = new Array(blockSize * totalBlocks);\n    this.blockSize = blockSize;\n    this.freeList = [];\n    \n    // Initialize free list\n    for (var i = 0; i < totalBlocks; i++) {\n        this.freeList.push(i);\n    }\n    \n    // Allocation and deallocation methods...\n}\n```",
                replies: [
                    {
                        author: "systems_programmer",
                        date: "2023-06-30T10:30:00Z",
                        content: "Interesting approach! Have you considered using a buddy allocator system instead? It might give better performance for varying allocation sizes."
                    }
                ]
            }
        ]
    },
    
    // Initialize the forum system
    init: function() {
        console.log("Initializing K2 Forum System...");
        
        // Set up forum UI
        this.setupForumUI();
        
        // Load categories
        this.loadCategories();
        
        console.log("K2 Forum System initialized");
    },
    
    // Set up forum UI elements
    setupForumUI: function() {
        // Category selection
        const categoryLinks = document.querySelectorAll('.forum-category-link');
        if (categoryLinks) {
            categoryLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const categoryId = e.target.getAttribute('data-category');
                    this.loadCategory(categoryId);
                });
            });
        }
        
        // New thread button
        const newThreadBtn = document.getElementById('new-thread-btn');
        if (newThreadBtn) {
            newThreadBtn.addEventListener('click', () => {
                this.showNewThreadForm();
            });
        }
        
        // New thread form submission
        const newThreadForm = document.getElementById('new-thread-form');
        if (newThreadForm) {
            newThreadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('thread-title').value;
                const content = document.getElementById('thread-content').value;
                this.createNewThread(title, content);
            });
        }
    },
    
    // Load forum categories
    loadCategories: function() {
        const categoriesContainer = document.getElementById('forum-categories');
        if (!categoriesContainer) return;
        
        // Clear container
        categoriesContainer.innerHTML = '';
        
        // Add each category
        this.categories.forEach(category => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'forum-category';
            
            // Check if category requires pro account
            let proTag = '';
            if (category.requiresPro) {
                proTag = '<span class="pro-tag">PRO</span>';
            }
            
            categoryEl.innerHTML = `
                <h3>
                    <a href="#" class="forum-category-link" data-category="${category.id}">
                        ${category.name} ${proTag}
                    </a>
                </h3>
                <p>${category.description}</p>
                <div class="category-stats">
                    <span>${this.getThreadCount(category.id)} threads</span>
                </div>
            `;
            categoriesContainer.appendChild(categoryEl);
        });
        
        // Add event listeners
        categoriesContainer.querySelectorAll('.forum-category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryId = e.target.getAttribute('data-category');
                this.loadCategory(categoryId);
            });
        });
    },
    
    // Get thread count for a category
    getThreadCount: function(categoryId) {
        if (this.sampleThreads[categoryId]) {
            return this.sampleThreads[categoryId].length;
        }
        return 0;
    },
    
    // Load a specific category
    loadCategory: function(categoryId) {
        console.log("Loading category:", categoryId);
        
        // Find category
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        // Check if category requires pro account
        if (category.requiresPro && (!window.K2AccountSystem || !window.K2AccountSystem.currentUser || window.K2AccountSystem.currentUser.tier !== 'pro')) {
            if (window.K2AccountSystem) {
                window.K2AccountSystem.showNotification("This category requires a Pro account", "error");
            }
            return;
        }
        
        // Set current category
        this.currentCategory = category;
        
        // Update UI
        const categoriesSection = document.getElementById('forum-categories-section');
        const threadsSection = document.getElementById('forum-threads-section');
        const threadSection = document.getElementById('forum-thread-section');
        
        if (categoriesSection) categoriesSection.style.display = 'none';
        if (threadsSection) threadsSection.style.display = 'block';
        if (threadSection) threadSection.style.display = 'none';
        
        // Update category title
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = category.name;
        }
        
        // Load threads
        this.loadThreads(categoryId);
        
        // Update new thread button visibility
        const newThreadBtn = document.getElementById('new-thread-btn');
        if (newThreadBtn) {
            if (category.isReadOnly) {
                newThreadBtn.style.display = 'none';
            } else {
                newThreadBtn.style.display = 'block';
            }
        }
    },
    
    // Load threads for a category
    loadThreads: function(categoryId) {
        const threadsContainer = document.getElementById('forum-threads');
        if (!threadsContainer) return;
        
        // Clear container
        threadsContainer.innerHTML = '';
        
        // Get threads for category
        const threads = this.sampleThreads[categoryId] || [];
        
        // Add each thread
        if (threads.length === 0) {
            threadsContainer.innerHTML = '<p>No threads in this category yet.</p>';
        } else {
            threads.forEach(thread => {
                const threadEl = document.createElement('div');
                threadEl.className = 'forum-thread-item';
                threadEl.innerHTML = `
                    <h4>
                        <a href="#" class="thread-link" data-thread="${thread.id}">
                            ${thread.title}
                        </a>
                    </h4>
                    <div class="thread-meta">
                        <span>By: ${thread.author}</span>
                        <span>Date: ${new Date(thread.date).toLocaleDateString()}</span>
                        <span>Replies: ${thread.replies ? thread.replies.length : 0}</span>
                    </div>
                `;
                threadsContainer.appendChild(threadEl);
            });
            
            // Add event listeners
            threadsContainer.querySelectorAll('.thread-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const threadId = e.target.getAttribute('data-thread');
                    this.loadThread(threadId);
                });
            });
        }
    },
    
    // Load a specific thread
    loadThread: function(threadId) {
        console.log("Loading thread:", threadId);
        
        // Find thread
        let thread = null;
        for (const categoryId in this.sampleThreads) {
            const found = this.sampleThreads[categoryId].find(t => t.id === threadId);
            if (found) {
                thread = found;
                break;
            }
        }
        
        if (!thread) return;
        
        // Set current thread
        this.currentThread = thread;
        
        // Update UI
        const categoriesSection = document.getElementById('forum-categories-section');
        const threadsSection = document.getElementById('forum-threads-section');
        const threadSection = document.getElementById('forum-thread-section');
        
        if (categoriesSection) categoriesSection.style.display = 'none';
        if (threadsSection) threadsSection.style.display = 'none';
        if (threadSection) threadSection.style.display = 'block';
        
        // Update thread title
        const threadTitle = document.getElementById('thread-title-display');
        if (threadTitle) {
            threadTitle.textContent = thread.title;
        }
        
        // Load thread content and replies
        this.displayThread(thread);
    },
    
    // Display thread content and replies
    displayThread: function(thread) {
        const threadContainer = document.getElementById('thread-content-container');
        if (!threadContainer) return;
        
        // Clear container
        threadContainer.innerHTML = '';
        
        // Add original post
        const originalPost = document.createElement('div');
        originalPost.className = 'thread-post original-post';
        originalPost.innerHTML = `
            <div class="post-meta">
                <span class="post-author">${thread.author}</span>
                <span class="post-date">${new Date(thread.date).toLocaleString()}</span>
            </div>
            <div class="post-content">
                ${this.formatContent(thread.content)}
            </div>
        `;
        threadContainer.appendChild(originalPost);
        
        // Add replies
        if (thread.replies && thread.replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.className = 'thread-replies';
            
            thread.replies.forEach(reply => {
                const replyEl = document.createElement('div');
                replyEl.className = 'thread-post reply-post';
                replyEl.innerHTML = `
                    <div class="post-meta">
                        <span class="post-author">${reply.author}</span>
                        <span class="post-date">${new Date(reply.date).toLocaleString()}</span>
                    </div>
                    <div class="post-content">
                        ${this.formatContent(reply.content)}
                    </div>
                `;
                repliesContainer.appendChild(replyEl);
            });
            
            threadContainer.appendChild(repliesContainer);
        }
        
        // Add reply form
        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form-container';
        replyForm.innerHTML = `
            <h4>Post a Reply</h4>
            <form id="reply-form">
                <textarea id="reply-content" placeholder="Write your reply here..."></textarea>
                <button type="submit" class="btn">Post Reply</button>
            </form>
        `;
        threadContainer.appendChild(replyForm);
        
        // Add event listener for reply form
        const form = threadContainer.querySelector('#reply-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const content = document.getElementById('reply-content').value;
                this.postReply(content);
            });
        }
    },
    
    // Format content (convert markdown-like syntax to HTML)
    formatContent: function(content) {
        // Convert code blocks
        content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Convert line breaks
        content = content.replace(/\n/g, '<br>');
        
        return content;
    },
    
    // Show new thread form
    showNewThreadForm: function() {
        if (!window.K2AccountSystem || !window.K2AccountSystem.currentUser) {
            if (window.K2AccountSystem) {
                window.K2AccountSystem.showNotification("Please log in to create a new thread", "error");
            }
            return;
        }
        
        const newThreadModal = document.getElementById('new-thread-modal');
        if (newThreadModal) {
            newThreadModal.style.display = 'block';
        }
    },
    
    // Create a new thread
    createNewThread: function(title, content) {
        if (!this.currentCategory) return;
        if (!window.K2AccountSystem || !window.K2AccountSystem.currentUser) return;
        
        console.log("Creating new thread:", title);
        
        // Create thread object
        const thread = {
            id: 'thread_' + Date.now(),
            title: title,
            author: window.K2AccountSystem.currentUser.username,
            date: new Date().toISOString(),
            content: content,
            replies: []
        };
        
        // Add to sample threads (in a real implementation, this would be saved to a database)
        if (!this.sampleThreads[this.currentCategory.id]) {
            this.sampleThreads[this.currentCategory.id] = [];
        }
        this.sampleThreads[this.currentCategory.id].unshift(thread);
        
        // Close modal
        const newThreadModal = document.getElementById('new-thread-modal');
        if (newThreadModal) {
            newThreadModal.style.display = 'none';
        }
        
        // Reload threads
        this.loadThreads(this.currentCategory.id);
        
        // Show success message
        if (window.K2AccountSystem) {
            window.K2AccountSystem.showNotification("Thread created successfully");
        }
    },
    
    // Post a reply to the current thread
    postReply: function(content) {
        if (!this.currentThread) return;
        if (!window.K2AccountSystem || !window.K2AccountSystem.currentUser) {
            if (window.K2AccountSystem) {
                window.K2AccountSystem.showNotification("Please log in to post a reply", "error");
            }
            return;
        }
        
        console.log("Posting reply to thread:", this.currentThread.id);
        
        // Create reply object
        const reply = {
            author: window.K2AccountSystem.currentUser.username,
            date: new Date().toISOString(),
            content: content
        };
        
        // Add to thread replies
        if (!this.currentThread.replies) {
            this.currentThread.replies = [];
        }
        this.currentThread.replies.push(reply);
        
        // Reload thread
        this.displayThread(this.currentThread);
        
        // Clear reply form
        const replyContent = document.getElementById('reply-content');
        if (replyContent) {
            replyContent.value = '';
        }
        
        // Show success message
        if (window.K2AccountSystem) {
            window.K2AccountSystem.showNotification("Reply posted successfully");
        }
    },
    
    // Navigate back to categories
    backToCategories: function() {
        // Update UI
        const categoriesSection = document.getElementById('forum-categories-section');
        const threadsSection = document.getElementById('forum-threads-section');
        const threadSection = document.getElementById('forum-thread-section');
        
        if (categoriesSection) categoriesSection.style.display = 'block';
        if (threadsSection) threadsSection.style.display = 'none';
        if (threadSection) threadSection.style.display = 'none';
        
        // Reset current category and thread
        this.currentCategory = null;
        this.currentThread = null;
    },
    
    // Navigate back to threads
    backToThreads: function() {
        if (!this.currentCategory) return;
        
        // Update UI
        const categoriesSection = document.getElementById('forum-categories-section');
        const threadsSection = document.getElementById('forum-threads-section');
        const threadSection = document.getElementById('forum-thread-section');
        
        if (categoriesSection) categoriesSection.style.display = 'none';
        if (threadsSection) threadsSection.style.display = 'block';
        if (threadSection) threadSection.style.display = 'none';
        
        // Reset current thread
        this.currentThread = null;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    K2ForumSystem.init();
});