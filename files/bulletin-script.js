// Homepage Script - Fully Functional
console.log('Bulletin script loaded');

let allPosts = [];
let displayedPosts = [];
const POSTS_PER_PAGE = 9;
let currentPage = 1;

// Load posts on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', handleFilter);
    
    // Load more
    document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
    
    // Close modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Close modal on outside click
    document.getElementById('postModal').addEventListener('click', (e) => {
        if (e.target.id === 'postModal') {
            closeModal();
        }
    });
    
    // Mobile toggle
    document.getElementById('mobileToggle').addEventListener('click', toggleMobileMenu);
}

// Load posts from Firebase
async function loadPosts() {
    try {
        console.log('Loading posts from Firebase...');
        
        const postsQuery = window.query(
            window.collection(window.db, 'bulletin_posts'),
            window.orderBy('createdAt', 'desc')
        );
        
        const snapshot = await window.getDocs(postsQuery);
        
        allPosts = [];
        snapshot.forEach((doc) => {
            allPosts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`Loaded ${allPosts.length} posts`);
        
        updateStats();
        displayPosts();
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Unable to load posts. Please check your connection.');
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalPosts').textContent = allPosts.length;
    
    // Count this month's posts
    const now = new Date();
    const thisMonth = allPosts.filter(post => {
        if (!post.createdAt) return false;
        const postDate = post.createdAt.toDate();
        return postDate.getMonth() === now.getMonth() && 
               postDate.getFullYear() === now.getFullYear();
    });
    document.getElementById('thisMonth').textContent = thisMonth.length;
    
    // Last updated
    if (allPosts.length > 0 && allPosts[0].createdAt) {
        const lastPost = allPosts[0].createdAt.toDate();
        document.getElementById('lastUpdated').textContent = formatTimeAgo(lastPost);
    }
}

// Display posts
function displayPosts(posts = allPosts) {
    const container = document.getElementById('postsContainer');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-inbox" style="font-size: 4rem; color: var(--text-light);"></i>
                <p>No posts found</p>
            </div>
        `;
        return;
    }
    
    displayedPosts = posts.slice(0, currentPage * POSTS_PER_PAGE);
    
    container.innerHTML = '';
    displayedPosts.forEach(post => {
        const card = createPostCard(post);
        container.appendChild(card);
    });
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (displayedPosts.length < posts.length) {
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Create post card
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.onclick = () => openPost(post);
    
    const categoryClass = post.category ? post.category.toLowerCase() : '';
    const excerpt = post.content ? 
        (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content) : 
        'No content available';
    
    const date = post.createdAt ? formatDate(post.createdAt.toDate()) : 'Recently';
    const author = post.author || 'Admin';
    
    card.innerHTML = `
        ${post.imageUrl ? 
            `<img src="${post.imageUrl}" alt="${post.title}" class="post-image">` : 
            '<div class="post-image"></div>'}
        <div class="post-content">
            <span class="post-category ${categoryClass}">${post.category || 'General'}</span>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${excerpt}</p>
            <div class="post-meta">
                <span class="post-author">
                    <i class="fas fa-user"></i>
                    ${author}
                </span>
                <span class="post-date">
                    <i class="far fa-clock"></i>
                    ${date}
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// Open post in modal
function openPost(post) {
    const modal = document.getElementById('postModal');
    const modalBody = document.getElementById('modalBody');
    
    const date = post.createdAt ? formatDate(post.createdAt.toDate()) : 'Recently';
    const author = post.author || 'Admin';
    const categoryClass = post.category ? post.category.toLowerCase() : '';
    
    modalBody.innerHTML = `
        <div class="modal-body-content">
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="modal-image">` : ''}
            <span class="post-category ${categoryClass}">${post.category || 'General'}</span>
            <h2 class="modal-title">${post.title}</h2>
            <div class="post-meta" style="margin-bottom: 2rem;">
                <span class="post-author">
                    <i class="fas fa-user"></i>
                    ${author}
                </span>
                <span class="post-date">
                    <i class="far fa-clock"></i>
                    ${date}
                </span>
            </div>
            <div class="modal-text">${post.content || 'No content available'}</div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('postModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    currentPage = 1;
    
    if (!searchTerm) {
        displayPosts(allPosts);
        return;
    }
    
    const filtered = allPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        (post.content && post.content.toLowerCase().includes(searchTerm)) ||
        (post.category && post.category.toLowerCase().includes(searchTerm))
    );
    
    displayPosts(filtered);
}

// Handle filter
function handleFilter(e) {
    const category = e.target.value;
    currentPage = 1;
    
    if (category === 'all') {
        displayPosts(allPosts);
        return;
    }
    
    const filtered = allPosts.filter(post => 
        post.category && post.category.toLowerCase() === category.toLowerCase()
    );
    
    displayPosts(filtered);
}

// Load more posts
function loadMore() {
    currentPage++;
    displayPosts(allPosts);
}

// Format date
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

// Format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return formatDate(date);
}

// Show error
function showError(message) {
    const container = document.getElementById('postsContainer');
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: var(--danger);"></i>
            <p>${message}</p>
        </div>
    `;
}

// Toggle mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

console.log('Homepage script ready');
