/* ===================================
   HISTORY.JS - JavaScript for History Page
   Dark Mode, Parallax Effects, Animations
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add animation effect
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    
    // ========== PARALLAX EFFECT FOR HERO IMAGE ==========
    const parallaxHero = document.getElementById('parallax-hero');
    const heroImage = parallaxHero ? parallaxHero.querySelector('.hero-image') : null;
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            // Parallax transform
            heroImage.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
        });
        
        // Mouse move parallax effect

    }
    
    
    // ========== FADE-IN ANIMATIONS ON SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe content blocks
    const contentBlocks = document.querySelectorAll('.content-block');
    contentBlocks.forEach(function(block, index) {
        block.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(block);
    });
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(function(item, index) {
        item.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(item);
    });
    
    
    // ========== MOBILE MENU TOGGLE ==========
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                const isClickInsideMenu = navMenu.contains(event.target);
                const isClickOnToggle = mobileToggle.contains(event.target);
                
                if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    
                    const spans = mobileToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }
    
    
    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbar = document.querySelector('.ultimate-navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const offset = navbarHeight + 20;
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.ultimate-navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.padding = '1rem 3rem';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1.5rem 3rem';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
    
    
    // ========== PERFORMANCE: THROTTLE SCROLL EVENT ==========
    let isScrolling = false;
    
    function throttleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                // Scroll logic here
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    window.addEventListener('scroll', throttleScroll, { passive: true });
    
    
    // ========== ACCESSIBILITY: ESC KEY TO CLOSE MOBILE MENU ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    
    // ========== LOGO ANIMATION ON SCROLL ==========
    const logoSquare = document.querySelector('.logo-square');
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (logoSquare) {
            logoSquare.style.transform = `rotate(${scrollPercent * 3.6}deg)`;
        }
    });
    
    
    console.log('✅ History Page JavaScript Loaded Successfully');
    console.log('🌓 Dark Mode: Ready');
    console.log('📜 Parallax: Active');
    console.log('✨ Animations: Ready');
    
});

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format number with leading zero (e.g., 5 -> 05)
function formatTimeUnit(value) {
    return value < 10 ? '0' + value : value;
}

// Format large numbers (e.g., 1000 -> 1,000)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
