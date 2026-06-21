// Dashboard Main Script - Fully Functional
console.log('Dashboard script starting...');

// Authentication Check
window.onAuthStateChanged(window.auth, (user) => {
    if (user) {
        console.log('User authenticated:', user.email);
        document.getElementById('userName').textContent = user.email.split('@')[0];
        document.getElementById('welcomeName').textContent = user.email.split('@')[0];
        
        // Load dashboard data
        loadDashboardStats();
        loadRecentAnnouncements();
        loadRecentEvents();
    } else {
        console.log('No user authenticated, redirecting to login');
        window.location.href = 'login.html';
    }
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await window.signOut(window.auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed. Please try again.');
    }
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Load Dashboard Stats
async function loadDashboardStats() {
    try {
        console.log('Loading dashboard stats...');
        
        // Count Announcements
        const announcementsQuery = window.query(
            window.collection(window.db, 'announcements')
        );
        const announcementsSnapshot = await window.getDocs(announcementsQuery);
        document.getElementById('totalAnnouncements').textContent = announcementsSnapshot.size;
        
        // Count Achievements
        const achievementsQuery = window.query(
            window.collection(window.db, 'achievements')
        );
        const achievementsSnapshot = await window.getDocs(achievementsQuery);
        document.getElementById('totalAchievements').textContent = achievementsSnapshot.size;
        
        // Count Total Events
        const eventsQuery = window.query(
            window.collection(window.db, 'events')
        );
        const eventsSnapshot = await window.getDocs(eventsQuery);
        document.getElementById('totalEvents').textContent = eventsSnapshot.size;
        
        // Count Upcoming Events
        const now = new Date();
        let upcomingCount = 0;
        eventsSnapshot.forEach((doc) => {
            const eventData = doc.data();
            if (eventData.eventDate) {
                const eventDate = eventData.eventDate.toDate();
                if (eventDate >= now) {
                    upcomingCount++;
                }
            }
        });
        document.getElementById('upcomingEvents').textContent = upcomingCount;
        
        console.log('Dashboard stats loaded successfully');
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Recent Announcements
async function loadRecentAnnouncements() {
    const container = document.getElementById('announcementsContainer');
    
    try {
        console.log('Loading recent announcements...');
        
        const q = window.query(
            window.collection(window.db, 'announcements'),
            window.orderBy('createdAt', 'desc'),
            window.limit(3)
        );
        
        const querySnapshot = await window.getDocs(q);
        
        if (querySnapshot.empty) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No announcements yet.</p>';
            return;
        }
        
        container.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = createItemCard(doc.id, data, 'announcement');
            container.appendChild(card);
        });
        
        console.log('Recent announcements loaded');
    } catch (error) {
        console.error('Error loading announcements:', error);
        container.innerHTML = '<p style="text-align: center; color: #f00; padding: 2rem;">Error loading announcements</p>';
    }
}

// Load Recent Events
async function loadRecentEvents() {
    const container = document.getElementById('eventsContainer');
    
    try {
        console.log('Loading recent events...');
        
        const q = window.query(
            window.collection(window.db, 'events'),
            window.orderBy('eventDate', 'asc'),
            window.limit(3)
        );
        
        const querySnapshot = await window.getDocs(q);
        
        if (querySnapshot.empty) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No upcoming events.</p>';
            return;
        }
        
        container.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = createItemCard(doc.id, data, 'event');
            container.appendChild(card);
        });
        
        console.log('Recent events loaded');
    } catch (error) {
        console.error('Error loading events:', error);
        container.innerHTML = '<p style="text-align: center; color: #f00; padding: 2rem;">Error loading events</p>';
    }
}

// Create Item Card
function createItemCard(id, data, type) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const category = data.category || 'General';
    const title = data.title || 'Untitled';
    const description = type === 'event' ? data.description : data.content;
    const truncatedDesc = description ? (description.length > 100 ? description.substring(0, 100) + '...' : description) : 'No description';
    
    let dateText = '';
    if (type === 'event' && data.eventDate) {
        dateText = formatDate(data.eventDate.toDate());
    } else if (data.createdAt) {
        dateText = formatDate(data.createdAt.toDate());
    }
    
    card.innerHTML = `
        <span class="item-category">${category}</span>
        <h4 class="item-title">${title}</h4>
        <p class="item-description">${truncatedDesc}</p>
        <div class="item-footer">
            <span class="item-date">
                <i class="far fa-clock"></i>
                ${dateText}
            </span>
            <div class="item-actions">
                <button class="item-action-btn" onclick="viewItem('${id}', '${type}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="item-action-btn" onclick="deleteItem('${id}', '${type}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Format Date
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

// View Item
window.viewItem = function(id, type) {
    const collectionName = type === 'event' ? 'events' : 'announcements';
    window.location.href = `dashboard/${type === 'event' ? 'events' : 'posts'}.html?id=${id}`;
};

// Delete Item
window.deleteItem = async function(id, type) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const collectionName = type === 'event' ? 'events' : 'announcements';
    
    try {
        showLoading();
        await window.deleteDoc(window.doc(window.db, collectionName, id));
        showToast('Item deleted successfully!');
        
        // Reload data
        loadDashboardStats();
        if (type === 'event') {
            loadRecentEvents();
        } else {
            loadRecentAnnouncements();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Error deleting item');
    } finally {
        hideLoading();
    }
};

// Quick Action Buttons
document.getElementById('btnQuickAnnouncement').addEventListener('click', () => {
    document.getElementById('postModalTitle').textContent = 'Create New Announcement';
    document.getElementById('postType').value = 'announcement';
    document.getElementById('postModal').classList.add('active');
});

document.getElementById('btnQuickAchievement').addEventListener('click', () => {
    document.getElementById('postModalTitle').textContent = 'Create New Achievement';
    document.getElementById('postType').value = 'achievement';
    document.getElementById('postModal').classList.add('active');
});

document.getElementById('btnQuickEvent').addEventListener('click', () => {
    document.getElementById('eventModal').classList.add('active');
});

// Post Modal Handlers
document.getElementById('btnClosePostModal').addEventListener('click', () => {
    document.getElementById('postModal').classList.remove('active');
    document.getElementById('postForm').reset();
    document.getElementById('postImagePreview').innerHTML = '';
});

document.getElementById('btnCancelPost').addEventListener('click', () => {
    document.getElementById('postModal').classList.remove('active');
    document.getElementById('postForm').reset();
    document.getElementById('postImagePreview').innerHTML = '';
});

// Event Modal Handlers
document.getElementById('btnCloseEventModal').addEventListener('click', () => {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('eventForm').reset();
    document.getElementById('eventImagePreview').innerHTML = '';
});

document.getElementById('btnCancelEvent').addEventListener('click', () => {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('eventForm').reset();
    document.getElementById('eventImagePreview').innerHTML = '';
});

// Post Image Preview
document.getElementById('postImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('postImagePreview').innerHTML = `<img src="${e.target.result}" style="max-width: 100%; border-radius: 12px;">`;
        };
        reader.readAsDataURL(file);
    }
});

// Event Image Preview
document.getElementById('eventImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('eventImagePreview').innerHTML = `<img src="${e.target.result}" style="max-width: 100%; border-radius: 12px;">`;
        };
        reader.readAsDataURL(file);
    }
});

// Submit Post Form
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value.trim();
    const type = document.getElementById('postType').value;
    const category = document.getElementById('postCategory').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    
    if (!title || !type || !category || !content) {
        showToast('Please fill in all required fields');
        return;
    }
    
    try {
        showLoading();
        
        let imageUrl = null;
        
        // Upload image if provided
        if (imageFile) {
            const imageRef = window.storageRef(window.storage, `posts/${Date.now()}_${imageFile.name}`);
            await window.uploadBytes(imageRef, imageFile);
            imageUrl = await window.getDownloadURL(imageRef);
            console.log('Image uploaded:', imageUrl);
        }
        
        // Prepare post data
        const postData = {
            title,
            category,
            content,
            author: window.auth.currentUser.email.split('@')[0],
            authorEmail: window.auth.currentUser.email,
            createdAt: window.serverTimestamp(),
            updatedAt: window.serverTimestamp()
        };
        
        if (imageUrl) {
            postData.imageUrl = imageUrl;
        }
        
        // Add to correct collection
        const collectionName = type === 'achievement' ? 'achievements' : 'announcements';
        const docRef = await window.addDoc(window.collection(window.db, collectionName), postData);
        
        console.log('Post created successfully:', docRef.id);
        
        // Close modal and reset form
        document.getElementById('postModal').classList.remove('active');
        document.getElementById('postForm').reset();
        document.getElementById('postImagePreview').innerHTML = '';
        
        showToast(`${type === 'achievement' ? 'Achievement' : 'Announcement'} created successfully!`);
        
        // Reload data
        loadDashboardStats();
        loadRecentAnnouncements();
        
    } catch (error) {
        console.error('Error creating post:', error);
        showToast('Error creating post: ' + error.message);
    } finally {
        hideLoading();
    }
});

// Submit Event Form
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value.trim();
    const category = document.getElementById('eventCategory').value.trim();
    const imageFile = document.getElementById('eventImage').files[0];
    
    if (!title || !description || !eventDate || !eventTime || !category) {
        showToast('Please fill in all required fields');
        return;
    }
    
    try {
        showLoading();
        
        let imageUrl = null;
        
        // Upload image if provided
        if (imageFile) {
            const imageRef = window.storageRef(window.storage, `events/${Date.now()}_${imageFile.name}`);
            await window.uploadBytes(imageRef, imageFile);
            imageUrl = await window.getDownloadURL(imageRef);
            console.log('Image uploaded:', imageUrl);
        }
        
        // Combine date and time
        const eventDateTime = new Date(`${eventDate}T${eventTime}`);
        
        // Prepare event data
        const eventData = {
            title,
            description,
            eventDate: window.Timestamp.fromDate(eventDateTime),
            location: location || 'TBA',
            category,
            organizer: window.auth.currentUser.email.split('@')[0],
            organizerEmail: window.auth.currentUser.email,
            createdAt: window.serverTimestamp(),
            status: eventDateTime > new Date() ? 'upcoming' : 'past'
        };
        
        if (imageUrl) {
            eventData.imageUrl = imageUrl;
        }
        
        // Add to events collection
        const docRef = await window.addDoc(window.collection(window.db, 'events'), eventData);
        
        console.log('Event created successfully:', docRef.id);
        
        // Close modal and reset form
        document.getElementById('eventModal').classList.remove('active');
        document.getElementById('eventForm').reset();
        document.getElementById('eventImagePreview').innerHTML = '';
        
        showToast('Event created successfully!');
        
        // Reload data
        loadDashboardStats();
        loadRecentEvents();
        
    } catch (error) {
        console.error('Error creating event:', error);
        showToast('Error creating event: ' + error.message);
    } finally {
        hideLoading();
    }
});

// Utility Functions
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
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

console.log('Dashboard script loaded successfully');
