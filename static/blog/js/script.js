
// Blog Application
class BlogApp {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.categories = JSON.parse(localStorage.getItem('blogCategories')) || ['Tech', 'Life', 'Learning', 'Random'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPosts();
        this.updateStats();
        this.loadCategories();
        this.loadRecentPosts();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Form submission
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPost();
            });
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    loadPosts() {
        const postsContainer = document.getElementById('blog-posts');
        if (!postsContainer) return;

        if (this.posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-feather-alt"></i>
                    <h3>No posts yet</h3>
                    <p>Create your first post to get started!</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = this.posts.map((post, index) => `
            <div class="blog-post" data-index="${index}">
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <span class="post-category">${post.category}</span>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                <div class="post-footer">
                    <div class="post-date">
                        <i class="far fa-calendar"></i>
                        ${post.date}
                    </div>
                    <div class="post-actions">
                        <button class="action-btn" onclick="blogApp.editPost(${index})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn" onclick="blogApp.deletePost(${index})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadCategories() {
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) return;

        categoriesContainer.innerHTML = this.categories.map(category => `
            <div class="category" onclick="blogApp.filterByCategory('${category}')">
                ${category}
            </div>
        `).join('');
    }

    loadRecentPosts() {
        const recentContainer = document.getElementById('recent-posts-list');
        if (!recentContainer) return;

        const recentPosts = this.posts.slice(0, 3);
        recentContainer.innerHTML = recentPosts.map((post, index) => `
            <div class="recent-post" onclick="blogApp.scrollToPost(${index})">
                <strong>${post.title}</strong><br>
                <small>${post.date}</small>
            </div>
        `).join('');
    }

    createPost() {
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;

        if (!title || !category || !content) {
            alert('Please fill in all fields');
            return;
        }

        const newPost = {
            title: title,
            category: category,
            content: content,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            timestamp: Date.now()
        };

        this.posts.unshift(newPost);
        this.saveToLocalStorage();

        // Add new category if it doesn't exist
        if (!this.categories.includes(category)) {
            this.categories.push(category);
            this.saveCategories();
        }

        // Reset form
        document.getElementById('post-form').reset();
        hideNewPostForm();

        // Update UI
        this.loadPosts();
        this.updateStats();
        this.loadCategories();
        this.loadRecentPosts();

        // Show success message
        this.showNotification('Post published successfully!', 'success');
    }

    editPost(index) {
        const post = this.posts[index];
        if (!post) return;

        document.getElementById('post-title').value = post.title;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-content').value = post.content;

        showNewPostForm();

        // Change form to update mode
        const form = document.getElementById('post-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.updatePost(index);
        };

        const submitBtn = form.querySelector('.publish-btn');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Post';
    }

    updatePost(index) {
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;

        this.posts[index] = {
            ...this.posts[index],
            title: title,
            category: category,
            content: content
        };

        this.saveToLocalStorage();
        this.loadPosts();
        this.updateStats();
        this.loadCategories();
        this.loadRecentPosts();

        // Reset form
        document.getElementById('post-form').reset();
        hideNewPostForm();

        // Reset form handler
        const form = document.getElementById('post-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            blogApp.createPost();
        };

        const submitBtn = form.querySelector('.publish-btn');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish';

        this.showNotification('Post updated successfully!', 'success');
    }

    deletePost(index) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.posts.splice(index, 1);
            this.saveToLocalStorage();
            this.loadPosts();
            this.updateStats();
            this.loadRecentPosts();
            this.showNotification('Post deleted successfully!', 'info');
        }
    }

    filterByCategory(category) {
        const postsContainer = document.getElementById('blog-posts');
        const filteredPosts = this.posts.filter(post => post.category === category);

        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No posts in ${category}</h3>
                    <p>Try another category or create a new post!</p>
                </div>
            `;
        } else {
            postsContainer.innerHTML = filteredPosts.map((post, index) => `
                <div class="blog-post">
                    <div class="post-header">
                        <h3 class="post-title">${post.title}</h3>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <div class="post-content">
                        ${post.content}
                    </div>
                    <div class="post-footer">
                        <div class="post-date">
                            <i class="far fa-calendar"></i>
                            ${post.date}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        this.showNotification(`Showing posts in: ${category}`, 'info');
    }

    scrollToPost(index) {
        const posts = document.querySelectorAll('.blog-post');
        if (posts[index]) {
            posts[index].scrollIntoView({ behavior: 'smooth' });
            posts[index].style.animation = 'highlight 1s';
            setTimeout(() => {
                posts[index].style.animation = '';
            }, 1000);
        }
    }

    updateStats() {
        document.getElementById('post-count').textContent = this.posts.length;
        document.getElementById('category-count').textContent = this.categories.length;
    }

    saveToLocalStorage() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    saveCategories() {
        localStorage.setItem('blogCategories', JSON.stringify(this.categories));
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        `;

        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                @keyframes highlight {
                    0% { background-color: var(--light-color); }
                    50% { background-color: #fff8e1; }
                    100% { background-color: var(--light-color); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize Blog App
const blogApp = new BlogApp();

// Global functions for HTML onclick handlers
function showNewPostForm() {
    document.getElementById('new-post-form').classList.remove('hidden');
    document.getElementById('about-section').classList.add('hidden');
    document.getElementById('posts-container').classList.add('hidden');

    // Reset form
    document.getElementById('post-form').reset();
    const submitBtn = document.querySelector('.publish-btn');
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish';

    // Reset form handler
    const form = document.getElementById('post-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        blogApp.createPost();
    };
}

function hideNewPostForm() {
    document.getElementById('new-post-form').classList.add('hidden');
    document.getElementById('posts-container').classList.remove('hidden');
}

function showAbout() {
    document.getElementById('about-section').classList.remove('hidden');
    document.getElementById('new-post-form').classList.add('hidden');
    document.getElementById('posts-container').classList.add('hidden');
}

function showBlogPosts() {
    document.getElementById('posts-container').classList.remove('hidden');
    document.getElementById('new-post-form').classList.add('hidden');
    document.getElementById('about-section').classList.add('hidden');
}

// Add some sample posts if empty
if (blogApp.posts.length === 0) {
    const samplePosts = [
        {
            title: "Welcome to My Blog!",
            category: "Life",
            content: "This is my first blog post. I'm excited to share my thoughts and experiences with you all. Stay tuned for more content!",
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            timestamp: Date.now()
        },
        {
            title: "Learning Web Development",
            category: "Tech",
            content: "Today I started learning about responsive web design. It's fascinating how CSS can make websites work on all devices!",
            date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            timestamp: Date.now() - 86400000
        }
    ];

    blogApp.posts = samplePosts;
    blogApp.saveToLocalStorage();
    blogApp.loadPosts();
    blogApp.updateStats();
    blogApp.loadRecentPosts();
}