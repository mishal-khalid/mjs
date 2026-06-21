/* ===================================
   MAIN.JS - Global JavaScript
   Includes: Navbar behavior, Mobile menu, Current year, Smooth scroll
   =================================== */

// ========== WAIT FOR DOM TO LOAD ==========
document.addEventListener('DOMContentLoaded', function() {

    
    
    // ========== NAVBAR SCROLL BEHAVIOR ==========
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        const scrollPosition = window.scrollY;
        
        // Add 'scrolled' class after scrolling 100px
        if (scrollPosition > 100) {
            header.classList.add('scrolled');
            navbar.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            navbar.classList.remove('scrolled');
        }
    }
    
    // Listen to scroll events
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Initial check on page load
    handleNavbarScroll();
    
    
    // ========== MOBILE MENU TOGGLE ==========
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and times (X)
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                body.style.overflow = ''; // Re-enable scrolling
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                const isClickInsideMenu = navLinks.contains(event.target);
                const isClickOnToggle = mobileToggle.contains(event.target);
                
                if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    body.style.overflow = '';
                }
            }
        });
    }
    
    
    // ========== DROPDOWN MENU BEHAVIOR (MOBILE) ==========
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(function(dropdown) {
        const dropdownLink = dropdown.querySelector('.nav-link');
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                // Only prevent default and toggle on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    
    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#' or empty
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Calculate offset (header + navbar height)
                const headerHeight = header ? header.offsetHeight : 0;
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const offset = headerHeight + navbarHeight + 20; // Extra 20px padding
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ========== CURRENT YEAR IN FOOTER ==========
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
    
    
    // ========== HANDLE WINDOW RESIZE ==========
    let resizeTimer;
    window.addEventListener('resize', function() {
        // Clear existing timer
        clearTimeout(resizeTimer);
        
        // Set new timer to run after resize is complete
        resizeTimer = setTimeout(function() {
            // Close mobile menu if window is resized to desktop
            if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                body.style.overflow = '';
            }
            
            // Close all mobile dropdowns on resize to desktop
            if (window.innerWidth > 768) {
                dropdowns.forEach(function(dropdown) {
                    dropdown.classList.remove('active');
                });
            }
        }, 250);
    });
    
    
    // ========== PREVENT TRANSITIONS ON PAGE LOAD ==========
    // This prevents animations from running on initial page load
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    
    // ========== ACCESSIBILITY: ESC KEY TO CLOSE MOBILE MENU ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            body.style.overflow = '';
        }
    });
    
    
    // ========== NAVBAR DROPDOWN HOVER EFFECTS (DESKTOP ONLY) ==========
    if (window.innerWidth > 768) {
        dropdowns.forEach(function(dropdown) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            
            if (dropdownMenu) {
                dropdown.addEventListener('mouseenter', function() {
                    dropdownMenu.style.display = 'block';
                    setTimeout(function() {
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.visibility = 'visible';
                        dropdownMenu.style.transform = 'translateY(0)';
                    }, 10);
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                    setTimeout(function() {
                        dropdownMenu.style.display = 'none';
                    }, 300);
                });
            }
        });
    }
    
    
    // ========== PERFORMANCE: THROTTLE SCROLL EVENT ==========
    let isScrolling = false;
    
    function throttleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                handleNavbarScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    // Replace the earlier scroll listener with throttled version
    window.removeEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', throttleScroll, { passive: true });
    
    
    // ========== CONSOLE LOG: CONFIRMATION ==========
    console.log('✅ MJS Global JavaScript Loaded Successfully');
    console.log('📱 Navbar: Ready');
    console.log('🔧 Mobile Menu: Ready');
    console.log('⚡ Smooth Scroll: Ready');
    
});


/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Format number with leading zero (e.g., 5 -> 05)
function formatTimeUnit(value) {
    return value < 10 ? '0' + value : value;
}

// Format large numbers (e.g., 1000 -> 1,000)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

// Animate elements on scroll (for future use)
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    
    elements.forEach(function(element) {
        if (isInViewport(element)) {
            element.classList.add('animated');
        }
    });
}

// Add scroll animation listener if needed
if (document.querySelectorAll('[data-animate]').length > 0) {
    window.addEventListener('scroll', debounce(animateOnScroll, 100));
    animateOnScroll(); // Initial check
}