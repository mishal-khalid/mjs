// Dashboard Script - Complete CRUD System
console.log('Dashboard script loaded');

let allPosts = [];
let auditLog = [];
let currentEditId = null;

// Authentication Check
window.onAuthStateChanged(window.auth, (user) => {
    if (user) {
        console.log('User authenticated:', user.email);
        document.getElementById('userEmail').textContent = user.email;
        initDashboard();
    } else {
        console.log('No user, redirecting to login');
        window.location.href = 'login.html';
    }
});

// Initialize Dashboard
function initDashboard() {
    loadPosts();
    loadAuditLog();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Post form
    document.getElementById('postForm').addEventListener('submit', handlePostSubmit);
    
    // Search and filter
    document.getElementById('postsSearch').addEventListener('input', handleSearch);
    document.getElementById('postsFilter').addEventListener('change', handleFilter);
    
    // Image preview
    document.getElementById('postImage').addEventListener('change', handleImagePreview);
}

// Switch Page
function switchPage(page) {
    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Update page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}Page`).classList.add('active');
    
    // Load data if needed
    if (page === 'posts') {
        displayPostsTable();
    } else if (page === 'audit') {
        displayAuditLog();
    }
}

// Load Posts
async function loadPosts() {
    try {
        console.log('Loading posts...');
        showLoading();
        
        const q = window.query(
            window.collection(window.db, 'bulletin_posts'),
            window.orderBy('createdAt', 'desc')
        );
        
        const snapshot = await window.getDocs(q);
        
        allPosts = [];
        snapshot.forEach(doc => {
            allPosts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`Loaded ${allPosts.length} posts`);
        
        updateStats();
        displayRecentPosts();
        displayPostsTable();
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showToast('Error loading posts', 'error');
    } finally {
        hideLoading();
    }
}

// Update Stats
function updateStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    
    allPosts.forEach(post => {
        if (!post.createdAt) return;
        const postDate = post.createdAt.toDate();
        
        if (postDate >= today) todayCount++;
        if (postDate >= weekAgo) weekCount++;
        if (postDate >= monthStart) monthCount++;
    });
    
    document.getElementById('statTotal').textContent = allPosts.length;
    document.getElementById('statToday').textContent = todayCount;
    document.getElementById('statWeek').textContent = weekCount;
    document.getElementById('statMonth').textContent = monthCount;
}

// Display Recent Posts
function displayRecentPosts() {
    const container = document.getElementById('recentPostsContainer');
    const recent = allPosts.slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">No posts yet</p>';
        return;
    }
    
    container.innerHTML = recent.map(post => `
        <div style="padding: 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h4 style="margin-bottom: 0.5rem;">${post.title}</h4>
                <small style="color: var(--text-light);">
                    ${post.category || 'General'} • 
                    ${post.createdAt ? formatDate(post.createdAt.toDate()) : 'Recently'}
                </small>
            </div>
            <div class="action-buttons">
                <button class="action-btn edit" onclick="editPost('${post.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deletePost('${post.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Display Posts Table
function displayPostsTable(posts = allPosts) {
    const tbody = document.getElementById('postsTableBody');
    
    if (posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #999;">No posts found</td></tr>';
        return;
    }
    
    tbody.innerHTML = posts.map(post => `
        <tr>
            <td class="post-title-cell">${post.title}</td>
            <td>
                <span class="category-badge ${post.category || 'announcement'}">
                    ${post.category || 'General'}
                </span>
            </td>
            <td>${post.author || 'Admin'}</td>
            <td>${post.createdAt ? formatDate(post.createdAt.toDate()) : 'Recently'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editPost('${post.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete" onclick="deletePost('${post.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Show Create Modal
window.showCreateModal = function() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Create New Post';
    document.getElementById('submitBtnText').textContent = 'Create Post';
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('postModal').classList.add('active');
};

// Edit Post
window.editPost = async function(id) {
    try {
        showLoading();
        
        const post = allPosts.find(p => p.id === id);
        if (!post) {
            showToast('Post not found', 'error');
            return;
        }
        
        currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Post';
        document.getElementById('submitBtnText').textContent = 'Update Post';
        document.getElementById('postId').value = id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category || '';
        document.getElementById('postContent').value = post.content || '';
        
        if (post.imageUrl) {
            document.getElementById('imagePreview').innerHTML = `
                <img src="${post.imageUrl}" style="max-width: 100%; border-radius: 8px; margin-top: 1rem;">
            `;
        }
        
        document.getElementById('postModal').classList.add('active');
        
    } catch (error) {
        console.error('Error editing post:', error);
        showToast('Error loading post', 'error');
    } finally {
        hideLoading();
    }
};

// Delete Post
window.deletePost = async function(id) {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
        return;
    }
    
    try {
        showLoading();
        
        const post = allPosts.find(p => p.id === id);
        
        // Delete image from storage if exists
        if (post.imageUrl) {
            try {
                const imageRef = window.storageRef(window.storage, post.imageUrl);
                await window.deleteObject(imageRef);
            } catch (error) {
                console.log('Image deletion error (may not exist):', error);
            }
        }
        
        // Delete from Firestore
        await window.deleteDoc(window.doc(window.db, 'bulletin_posts', id));
        
        // Log action
        await logAction('delete', `Deleted post: ${post.title}`);
        
        showToast('Post deleted successfully', 'success');
        loadPosts();
        
    } catch (error) {
        console.error('Error deleting post:', error);
        showToast('Error deleting post', 'error');
    } finally {
        hideLoading();
    }
};

// Handle Post Submit
async function handlePostSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    const postId = document.getElementById('postId').value;
    
    if (!title || !category || !content) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    try {
        showLoading();
        
        let imageUrl = null;
        
        // Upload image if provided
        if (imageFile) {
            const imageRef = window.storageRef(
                window.storage, 
                `bulletin_images/${Date.now()}_${imageFile.name}`
            );
            await window.uploadBytes(imageRef, imageFile);
            imageUrl = await window.getDownloadURL(imageRef);
            console.log('Image uploaded:', imageUrl);
        }
        
        const postData = {
            title,
            category,
            content,
            author: window.auth.currentUser.email.split('@')[0],
            authorEmail: window.auth.currentUser.email,
            updatedAt: window.serverTimestamp()
        };
        
        if (imageUrl) {
            postData.imageUrl = imageUrl;
        }
        
        if (postId) {
            // Update existing post
            const existingPost = allPosts.find(p => p.id === postId);
            
            // Keep existing image if no new image
            if (!imageUrl && existingPost.imageUrl) {
                postData.imageUrl = existingPost.imageUrl;
            }
            
            await window.updateDoc(
                window.doc(window.db, 'bulletin_posts', postId),
                postData
            );
            
            await logAction('update', `Updated post: ${title}`);
            showToast('Post updated successfully', 'success');
            
        } else {
            // Create new post
            postData.createdAt = window.serverTimestamp();
            
            await window.addDoc(
                window.collection(window.db, 'bulletin_posts'),
                postData
            );
            
            await logAction('create', `Created post: ${title}`);
            showToast('Post created successfully', 'success');
        }
        
        closeModal();
        loadPosts();
        
    } catch (error) {
        console.error('Error saving post:', error);
        showToast('Error saving post: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Handle Image Preview
function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('imagePreview').innerHTML = `
                <img src="${e.target.result}" style="max-width: 100%; border-radius: 8px; margin-top: 1rem;">
            `;
        };
        reader.readAsDataURL(file);
    }
}

// Handle Search
function handleSearch(e) {
    const term = e.target.value.toLowerCase().trim();
    
    if (!term) {
        displayPostsTable(allPosts);
        return;
    }
    
    const filtered = allPosts.filter(post => 
        post.title.toLowerCase().includes(term) ||
        (post.content && post.content.toLowerCase().includes(term)) ||
        (post.category && post.category.toLowerCase().includes(term))
    );
    
    displayPostsTable(filtered);
}

// Handle Filter
function handleFilter(e) {
    const category = e.target.value;
    
    if (category === 'all') {
        displayPostsTable(allPosts);
        return;
    }
    
    const filtered = allPosts.filter(post => 
        post.category && post.category.toLowerCase() === category.toLowerCase()
    );
    
    displayPostsTable(filtered);
}

// Close Modal
window.closeModal = function() {
    document.getElementById('postModal').classList.remove('active');
    document.getElementById('postForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    currentEditId = null;
};

// Load Audit Log
async function loadAuditLog() {
    try {
        const q = window.query(
            window.collection(window.db, 'bulletin_audit'),
            window.orderBy('timestamp', 'desc')
        );
        
        const snapshot = await window.getDocs(q);
        
        auditLog = [];
        snapshot.forEach(doc => {
            auditLog.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`Loaded ${auditLog.length} audit entries`);
        
    } catch (error) {
        console.error('Error loading audit log:', error);
    }
}

// Display Audit Log
function displayAuditLog() {
    const container = document.getElementById('auditLogContent');
    
    if (auditLog.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">No audit entries yet</p>';
        return;
    }
    
    container.innerHTML = auditLog.map(entry => `
        <div class="audit-entry ${entry.action}">
            <div class="audit-entry-header">
                <span class="audit-entry-title">
                    <i class="fas fa-${getActionIcon(entry.action)}"></i>
                    ${entry.action.toUpperCase()}
                </span>
                <span class="audit-entry-time">
                    ${entry.timestamp ? formatDateTime(entry.timestamp.toDate()) : 'Recently'}
                </span>
            </div>
            <div class="audit-entry-details">
                ${entry.details} by ${entry.user}
            </div>
        </div>
    `).join('');
}

// Log Action
async function logAction(action, details) {
    try {
        await window.addDoc(window.collection(window.db, 'bulletin_audit'), {
            action,
            details,
            user: window.auth.currentUser.email,
            timestamp: window.serverTimestamp()
        });
        
        await loadAuditLog();
    } catch (error) {
        console.error('Error logging action:', error);
    }
}

// Export Audit Log
window.exportAuditLog = function() {
    if (auditLog.length === 0) {
        showToast('No audit entries to export', 'error');
        return;
    }
    
    const csv = [
        ['Action', 'Details', 'User', 'Timestamp'],
        ...auditLog.map(entry => [
            entry.action,
            entry.details,
            entry.user,
            entry.timestamp ? entry.timestamp.toDate().toLocaleString() : 'Recently'
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${Date.now()}.csv`;
    a.click();
    
    showToast('Audit log exported', 'success');
};

// Logout
async function logout() {
    try {
        await window.signOut(window.auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'error');
    }
}

// Utility Functions
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getActionIcon(action) {
    switch(action) {
        case 'create': return 'plus-circle';
        case 'update': return 'edit';
        case 'delete': return 'trash';
        default: return 'circle';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = `toast ${type} show`;
    toastMessage.textContent = message;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

console.log('Dashboard ready - Full CRUD operations available');
