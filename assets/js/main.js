/**
 * YASER DEV - Main JavaScript
 * Handles: Navigation, Smooth Scroll, Intersection Observer,
 *           Project Filtering, Form Validation, Stats Counter,
 *           Back to Top, and more.
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =============================================
    // 1. NAVIGATION
    // =============================================

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            const isOpen = this.classList.toggle('active');
            navLinks.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // =============================================
    // 2. NAVBAR SCROLL EFFECT
    // =============================================

    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // =============================================
    // 3. ACTIVE NAV LINK
    // =============================================

    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // =============================================
    // 4. SMOOTH SCROLL (fallback for anchor links)
    // =============================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 5. INTERSECTION OBSERVER - Reveal on Scroll
    // =============================================

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after reveal for performance
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target all sections and cards
    const animateElements = [
        '.section-header',
        '.hero-content',
        '.about-content',
        '.skills-grid .skill-card',
        '.projects-grid .project-card',
        '.services-grid .service-card',
        '.process-steps .step-item',
        '.contact-content'
    ];

    animateElements.forEach(function(selector) {
        document.querySelectorAll(selector).forEach(function(el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    });

    // =============================================
    // 6. STATS COUNTER (with counting animation)
    // =============================================

    const stats = document.querySelectorAll('.stat-number');

    function animateStats() {
        stats.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-count'), 10);
            const duration = 2000; // ms
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                if (target >= 100) {
                    stat.textContent = current + '+';
                } else {
                    stat.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + (target >= 100 ? '+' : '');
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger stats animation when about section is visible
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.disconnect(); // Run once
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(aboutSection);
    }

    // =============================================
    // 7. PROJECT FILTERING
    // =============================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectCards.forEach(function(card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    // Re-trigger animation
                    card.classList.remove('visible');
                    setTimeout(function() {
                        card.classList.add('visible');
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // =============================================
    // 8. CONTACT FORM
    // =============================================

    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset errors
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(function(group) {
                group.classList.remove('error');
            });

            let isValid = true;

            // Validate name
            const name = document.getElementById('name');
            if (!name.value.trim()) {
                name.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                email.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate message
            const message = document.getElementById('message');
            if (!message.value.trim()) {
                message.closest('.form-group').classList.add('error');
                isValid = false;
            }

            if (isValid) {
                // Show success message
                successMessage.classList.add('show');
                form.querySelector('.btn-submit').disabled = true;
                form.querySelector('.btn-submit').innerHTML =
                    '<i class="bi bi-check-circle"></i> تم الإرسال';

                // Reset form after delay
                setTimeout(function() {
                    form.reset();
                    successMessage.classList.remove('show');
                    form.querySelector('.btn-submit').disabled = false;
                    form.querySelector('.btn-submit').innerHTML =
                        '<i class="bi bi-send"></i> إرسال الرسالة';
                }, 4000);
            } else {
                // Focus first error field
                const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
                if (firstError) {
                    firstError.focus();
                }
            }
        });

        // Remove error on input
        form.querySelectorAll('input, textarea, select').forEach(function(input) {
            input.addEventListener('input', function() {
                const group = this.closest('.form-group');
                if (group) {
                    group.classList.remove('error');
                }
            });
        });
    }

    // =============================================
    // 9. BACK TO TOP BUTTON
    // =============================================

    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // 10. FOOTER - CURRENT YEAR
    // =============================================

    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // =============================================
    // 11. TERMINAL CURSOR ANIMATION (already in CSS)
    //    Additional: keep cursor blinking smoothly
    // =============================================

    // The cursor blink is handled via CSS animation.
    // No additional JS needed.

    // =============================================
    // 12. CONSOLE WELCOME (optional)
    // =============================================

    console.log('%c YASER DEV %c Portfolio ',
        'background:#2563EB;color:#fff;padding:6px 12px;border-radius:4px 0 0 4px;font-weight:bold;',
        'background:#0B1120;color:#F8FAFC;padding:6px 12px;border-radius:0 4px 4px 0;'
    );
    console.log('🚀 Built with HTML, CSS, and JavaScript.');

    console.log('📧 Contact: your-email@example.com');
    console.log('🐙 GitHub: github.com/your-username');

    console.log('%c✨ Thanks for visiting!', 'color:#38BDF8;font-size:14px;');
});