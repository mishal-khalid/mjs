/* ===================================
   INDEX.JS - Modern & Bug-Free
   Completely Remade JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========== COUNTDOWN TIMERS ==========
    const igcseDate = new Date('2026-01-29T00:00:00').getTime();
    const mockDate = new Date('2025-12-07T00:00:00').getTime();

    function formatTime(value) {
        return value < 10 ? '0' + value : value.toString();
    }

    function formatDays(value) {
        if (value < 10) return '00' + value;
        if (value < 100) return '0' + value;
        return value.toString();
    }

    function updateCountdown(targetDate, daysEl, hoursEl, minutesEl) {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if (daysEl) daysEl.textContent = '000';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (daysEl) daysEl.textContent = formatDays(days);
        if (hoursEl) hoursEl.textContent = formatTime(hours);
        if (minutesEl) minutesEl.textContent = formatTime(minutes);
    }

    function updateAllCountdowns() {
        updateCountdown(
            igcseDate,
            document.getElementById('igcse-days'),
            document.getElementById('igcse-hours'),
            document.getElementById('igcse-minutes')
        );

        updateCountdown(
            mockDate,
            document.getElementById('mock-days'),
            document.getElementById('mock-hours'),
            document.getElementById('mock-minutes')
        );
    }

    // Initial update and set interval
    updateAllCountdowns();
    setInterval(updateAllCountdowns, 1000);

    // ========== ANIMATED STATS COUNTER ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(function() {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    function checkStatsInView() {
        if (hasAnimated) return;

        statNumbers.forEach(function(stat) {
            const rect = stat.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 200;

            if (isInViewport) {
                hasAnimated = true;
                const targetValue = parseInt(stat.getAttribute('data-target'));
                animateValue(stat, 0, targetValue, 2000);
            }
        });
    }

    // Check on scroll and on load
    window.addEventListener('scroll', checkStatsInView);
    checkStatsInView();

    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // ========== MOBILE MENU TOGGLE ==========
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const body = document.body;

    if (mobileToggle && navMenu && mobileOverlay) {
        // Toggle menu
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when overlay clicked
        mobileOverlay.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileToggle.classList.remove('active');
            body.style.overflow = '';
        });

        // Handle dropdown clicks on mobile
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(function(dropdown) {
            const link = dropdown.querySelector('a');
            if (link) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });

        // Close menu when dropdown link clicked
        const dropdownLinks = document.querySelectorAll('.dropdown-content a');
        dropdownLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    mobileOverlay.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });
    }

    // ========== SMOOTH SCROLL ==========
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
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

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileOverlay.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            }
        });
    });

    // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
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

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease ' + (index * 0.1) + 's';
        fadeInObserver.observe(card);
    });

    // Observe stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease ' + (index * 0.1) + 's';
        fadeInObserver.observe(card);
    });

    // Observe countdown cards
    const countdownCards = document.querySelectorAll('.countdown-card');
    countdownCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateX(50px)';
        card.style.transition = 'all 0.6s ease ' + (index * 0.2) + 's';
        fadeInObserver.observe(card);
    });

    // ========== DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
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
            setTimeout(function() {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }

    // ========== CONSOLE MESSAGES ==========
    console.log('%c🎨 MJS Website Loaded Successfully!', 'color: #10B981; font-size: 16px; font-weight: bold;');
    console.log('%c✅ All Features Active', 'color: #84CC16; font-size: 14px;');
    console.log('%c⏰ Countdowns: Running', 'color: #10B981; font-size: 12px;');
    console.log('%c📊 Stats Animation: Ready', 'color: #10B981; font-size: 12px;');
    console.log('%c🌓 Dark Mode: Available', 'color: #10B981; font-size: 12px;');
    console.log('%c📱 Mobile Menu: Functional', 'color: #10B981; font-size: 12px;');

    // ========== WINDOW RESIZE HANDLER ==========
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.style.overflow = '';
            }
        }, 250);
    });

    // ========== PREVENT FOUC (Flash of Unstyled Content) ==========
    document.body.style.opacity = '1';

});
