// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Load saved theme
const savedTheme = localStorage.getItem('fehimaa-theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('fehimaa-theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('fehimaa-theme', 'light');
    }
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
let allPosts = [];

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm) {
        clearSearch.style.display = 'block';
        filterContent(searchTerm);
    } else {
        clearSearch.style.display = 'none';
        displayAllContent();
    }
});

clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    displayAllContent();
});

function filterContent(searchTerm) {
    const filteredPosts = allPosts.filter(post => {
        return (
            post.title.toLowerCase().includes(searchTerm) ||
            post.description.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm)
        );
    });
    
    displayFilteredPosts(filteredPosts);
}

function displayFilteredPosts(posts) {
    const newsGrid = document.getElementById('newsGrid');
    
    if (posts.length === 0) {
        newsGrid.innerHTML = `
            <div class="loading-container">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p>No results found for your search</p>
            </div>
        `;
        return;
    }
    
    newsGrid.innerHTML = '';
    posts.forEach(post => {
        const card = createNewsCard(post);
        newsGrid.appendChild(card);
    });
}

function displayAllContent() {
    loadNews();
}

// Active Navigation
const navItems = document.querySelectorAll('.nav-item');
const currentPage = window.location.pathname;

navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link && link.getAttribute('href') === currentPage.split('/').pop()) {
        item.classList.add('active');
    }
});

// Firebase Data Loading
async function loadNews() {
    const newsGrid = document.getElementById('newsGrid');
    
    try {
        const q = window.query(
            window.collection(window.db, 'announcements'),
            window.orderBy('createdAt', 'desc'),
            window.limit(6)
        );
        
        const querySnapshot = await window.getDocs(q);
        
        if (querySnapshot.empty) {
            newsGrid.innerHTML = `
                <div class="loading-container">
                    <i class="fas fa-newspaper" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>No announcements yet. Check back soon!</p>
                </div>
            `;
            return;
        }
        
        newsGrid.innerHTML = '';
        allPosts = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const post = {
                id: doc.id,
                title: data.title || 'Untitled',
                description: data.content || 'No description available',
                category: data.category || 'General',
                date: data.createdAt ? formatDate(data.createdAt.toDate()) : 'Recent',
                author: data.author || 'MJS Admin'
            };
            
            allPosts.push(post);
            const card = createNewsCard(post);
            newsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading news:', error);
        newsGrid.innerHTML = `
            <div class="loading-container">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--coral-orange); margin-bottom: 1rem;"></i>
                <p>Failed to load announcements. Please refresh the page.</p>
            </div>
        `;
    }
}

function createNewsCard(post) {
    const card = document.createElement('div');
    card.className = 'news-card glass-card';
    
    card.innerHTML = `
        <div class="card-header">
            <span class="card-category">${post.category}</span>
            <span class="card-date">
                <i class="far fa-clock"></i>
                ${post.date}
            </span>
        </div>
        <h3 class="card-title">${post.title}</h3>
        <p class="card-description">${truncateText(post.description, 150)}</p>
        <div class="card-footer">
            <span class="card-author">
                <i class="fas fa-user-circle"></i>
                ${post.author}
            </span>
            <span class="card-read-more">
                Read More
                <i class="fas fa-arrow-right"></i>
            </span>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `announcements.html?id=${post.id}`;
    });
    
    return card;
}

async function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    
    try {
        const q = window.query(
            window.collection(window.db, 'achievements'),
            window.orderBy('createdAt', 'desc'),
            window.limit(3)
        );
        
        const querySnapshot = await window.getDocs(q);
        
        if (querySnapshot.empty) {
            achievementsGrid.innerHTML = `
                <div class="loading-container">
                    <i class="fas fa-trophy" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>No achievements yet. Stay tuned!</p>
                </div>
            `;
            return;
        }
        
        achievementsGrid.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = createAchievementCard({
                id: doc.id,
                title: data.title || 'Untitled Achievement',
                description: data.description || 'No description available',
                category: data.category || 'Achievement',
                date: data.createdAt ? formatDate(data.createdAt.toDate()) : 'Recent',
                author: data.studentName || 'MJS Student'
            });
            achievementsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading achievements:', error);
        achievementsGrid.innerHTML = `
            <div class="loading-container">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--coral-orange); margin-bottom: 1rem;"></i>
                <p>Failed to load achievements. Please refresh the page.</p>
            </div>
        `;
    }
}

function createAchievementCard(achievement) {
    const card = document.createElement('div');
    card.className = 'achievement-card glass-card';
    
    card.innerHTML = `
        <div class="card-header">
            <span class="card-category">${achievement.category}</span>
            <span class="card-date">
                <i class="far fa-clock"></i>
                ${achievement.date}
            </span>
        </div>
        <h3 class="card-title">${achievement.title}</h3>
        <p class="card-description">${truncateText(achievement.description, 120)}</p>
        <div class="card-footer">
            <span class="card-author">
                <i class="fas fa-award"></i>
                ${achievement.author}
            </span>
            <span class="card-read-more">
                View Details
                <i class="fas fa-arrow-right"></i>
            </span>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `achievements.html?id=${achievement.id}`;
    });
    
    return card;
}

async function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    
    try {
        const q = window.query(
            window.collection(window.db, 'events'),
            window.orderBy('eventDate', 'asc'),
            window.limit(3)
        );
        
        const querySnapshot = await window.getDocs(q);
        
        if (querySnapshot.empty) {
            eventsGrid.innerHTML = `
                <div class="loading-container">
                    <i class="fas fa-calendar-alt" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>No upcoming events. Check back later!</p>
                </div>
            `;
            return;
        }
        
        eventsGrid.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = createEventCard({
                id: doc.id,
                title: data.title || 'Untitled Event',
                description: data.description || 'No description available',
                date: data.eventDate ? formatDate(data.eventDate.toDate()) : 'TBA',
                location: data.location || 'MJS Campus',
                category: data.category || 'Event'
            });
            eventsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsGrid.innerHTML = `
            <div class="loading-container">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--coral-orange); margin-bottom: 1rem;"></i>
                <p>Failed to load events. Please refresh the page.</p>
            </div>
        `;
    }
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card glass-card';
    
    card.innerHTML = `
        <div class="card-header">
            <span class="card-category">${event.category}</span>
            <span class="card-date">
                <i class="far fa-calendar"></i>
                ${event.date}
            </span>
        </div>
        <h3 class="card-title">${event.title}</h3>
        <p class="card-description">${truncateText(event.description, 120)}</p>
        <div class="card-footer">
            <span class="card-author">
                <i class="fas fa-map-marker-alt"></i>
                ${event.location}
            </span>
            <span class="card-read-more">
                Learn More
                <i class="fas fa-arrow-right"></i>
            </span>
        </div>
    `;
    
    return card;
}

// Utility Functions
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Fehimaa initialized');
    
    // Wait for Firebase to be ready
    setTimeout(() => {
        if (window.db) {
            loadNews();
            loadAchievements();
            loadEvents();
        } else {
            console.error('Firebase not initialized');
        }
    }, 500);
});
