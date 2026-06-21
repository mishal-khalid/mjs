/* ===================================
   SUBPAGES.JS - Modern Theme Update
   Completely Remade & Bug-Free
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========== COUNTDOWN TIMER (HEADER) ==========
    const igcseDate = new Date('2026-01-29T00:00:00').getTime();
    
    const headerCountdown = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes')
    };
    
    function formatTime(value) {
        return value < 10 ? '0' + value : value.toString();
    }
    
    function formatDays(value) {
        if (value < 10) return '00' + value;
        if (value < 100) return '0' + value;
        return value.toString();
    }
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = igcseDate - now;
        
        if (distance < 0) {
            if (headerCountdown.days) headerCountdown.days.textContent = '000';
            if (headerCountdown.hours) headerCountdown.hours.textContent = '00';
            if (headerCountdown.minutes) headerCountdown.minutes.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        if (headerCountdown.days) headerCountdown.days.textContent = formatDays(days);
        if (headerCountdown.hours) headerCountdown.hours.textContent = formatTime(hours);
        if (headerCountdown.minutes) headerCountdown.minutes.textContent = formatTime(minutes);
    }
    
    // Initial update and set interval
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // ========== SCROLL ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content blocks
    const contentBlocks = document.querySelectorAll('.content-block');
    contentBlocks.forEach(function(block, index) {
        block.style.opacity = '0';
        block.style.transform = 'translateY(30px)';
        block.style.transition = 'all 0.6s ease-out ' + (index * 0.1) + 's';
        fadeInObserver.observe(block);
    });
    
    // Observe principal card
    const principalCard = document.querySelector('.principal-card');
    if (principalCard) {
        principalCard.style.opacity = '0';
        principalCard.style.transform = 'translateY(30px)';
        principalCard.style.transition = 'all 0.8s ease-out';
        fadeInObserver.observe(principalCard);
    }
    
    // Observe VP cards
    const vpCards = document.querySelectorAll('.vp-card');
    vpCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out ' + (index * 0.15) + 's';
        fadeInObserver.observe(card);
    });
    
    // Observe teacher cards
    const teacherCards = document.querySelectorAll('.teacher-card');
    teacherCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out ' + (index * 0.1) + 's';
        fadeInObserver.observe(card);
    });
    
    // Observe timeline items (for history page, etc.)
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(function(item, index) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease-out ' + (index * 0.15) + 's';
        fadeInObserver.observe(item);
    });
    
    console.log('%c✅ Subpage JavaScript Loaded Successfully', 'color: #10B981; font-size: 14px; font-weight: bold;');
});

/* ===================================
   CLUBS & ACTIVITIES PAGE JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Back to Navigation Button
    const backToNavBtn = document.getElementById('backToNav');
    const pageNavigation = document.querySelector('.page-navigation');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    if (backToNavBtn && pageNavigation) {
        
        // Show button when clicking any navigation button
        navButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the target section
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Show back button after a short delay
                    setTimeout(function() {
                        backToNavBtn.classList.add('visible');
                    }, 500);
                }
            });
        });
        
        // Click back button to return to navigation
        backToNavBtn.addEventListener('click', function() {
            // Scroll to navigation
            pageNavigation.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Hide button after scrolling
            setTimeout(function() {
                backToNavBtn.classList.remove('visible');
            }, 500);
        });
        
        // Hide button when scrolling back to top manually
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                const navPosition = pageNavigation.getBoundingClientRect().top;
                
                // If navigation is in viewport, hide button
                if (navPosition > 0 && navPosition < window.innerHeight) {
                    backToNavBtn.classList.remove('visible');
                }
            }, 100);
        });
        
        console.log('%c✅ Clubs & Activities JavaScript Loaded', 'color: #10B981; font-size: 14px;');
    }
});

/* ===================================
   SMOOTH SCROLL FOR SUBPAGES
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Smooth scroll for all anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/* ===================================
   ACTIVE DROPDOWN HIGHLIGHT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Highlight active dropdown menu item
    const currentPath = window.location.pathname;
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    
    dropdownLinks.forEach(function(link) {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add('active');
            
            // Also mark parent dropdown as active
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('active');
            }
        }
    });
});

/* ===================================
   IMAGE LAZY LOADING ERROR HANDLER
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Handle image loading errors gracefully
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('error', function() {
            // Add a placeholder class or background
            this.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(132, 204, 22, 0.1))';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            
            // Optional: Log the error for debugging
            console.warn('Image failed to load:', this.src);
        });
    });
});

/* ===================================
   PERFORMANCE OPTIMIZATION
   =================================== */

// Debounce function for scroll events
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

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/* ===================================
   WINDOW RESIZE HANDLER
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const handleResize = throttle(function() {
        // Close mobile menu on resize to desktop
        const navMenu = document.getElementById('nav-menu');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const mobileToggle = document.getElementById('mobile-toggle');
        
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
});

/* ===================================
   CONSOLE INITIALIZATION MESSAGE
   =================================== */

console.log('%c🎨 MJS Subpage Loaded Successfully!', 'color: #10B981; font-size: 16px; font-weight: bold;');
console.log('%c⏰ Countdown: Active', 'color: #84CC16; font-size: 12px;');
console.log('%c✨ Animations: Ready', 'color: #84CC16; font-size: 12px;');
console.log('%c📱 Responsive: Optimized', 'color: #84CC16; font-size: 12px;');
