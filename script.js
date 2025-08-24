document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality immediately (no preloader)
    initializePortfolio();
    initializeTestimonials();
    initializeContactForm();
    initializeAnimations();
});

function initializePortfolio() {
    // Video Lightbox Functionality
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!lightbox || !lightboxVideo || !closeBtn) {
        console.error('Lightbox elements not found');
        return;
    }

    portfolioItems.forEach(item => {
        const videoElement = item.querySelector('video');
        const imgElement = item.querySelector('img');

        // Play video on hover
        item.addEventListener('mouseenter', () => {
            if (videoElement) {
                videoElement.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
                videoElement.style.opacity = 1;
                imgElement.style.opacity = 0;
            }
        });

        // Pause video on mouse leave
        item.addEventListener('mouseleave', () => {
            if (videoElement) {
                videoElement.pause();
                videoElement.currentTime = 0;
                videoElement.style.opacity = 0;
                imgElement.style.opacity = 1;
            }
        });

        // Open lightbox on click
        item.addEventListener('click', () => {
            const videoSrc = videoElement.getAttribute('src');
            if (videoSrc) {
                lightboxVideo.src = videoSrc;
                lightbox.style.display = 'flex';
                videoElement.pause();
            }
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
    });

    // Close lightbox when clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-overlay')) {
            lightbox.style.display = 'none';
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
    });

    // Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItemsAll = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;

            portfolioItemsAll.forEach(item => {
                const itemCategories = item.dataset.category.split(' ');
                
                if (category === 'all' || itemCategories.includes(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Ripple Effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            const existingRipple = button.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            button.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
}

function initializeTestimonials() {
    // Enhanced Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    const navDots = document.querySelectorAll('.nav-dot');
    let scrollInterval;
    let currentIndex = 0;
    
    if (!carousel || navDots.length === 0) {
        console.error('Testimonial carousel elements not found');
        return;
    }
    
    const firstItem = carousel.querySelector('.testimonial-item');
    if (!firstItem) {
        console.error('No testimonial items found');
        return;
    }
    
    const scrollAmount = firstItem.offsetWidth + 48; // Item width + gap

    // Update active dot
    function updateActiveDot(index) {
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index].classList.add('active');
    }

    // Auto-scroll functionality
    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            currentIndex++;
            if (currentIndex >= navDots.length) {
                currentIndex = 0;
                carousel.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
            updateActiveDot(currentIndex);
        }, 5000);
    }

    // Manual navigation
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(scrollInterval);
            currentIndex = index;
            carousel.scrollTo({
                left: scrollAmount * index,
                behavior: 'smooth'
            });
            updateActiveDot(currentIndex);
            startAutoScroll();
        });
    });

    // Pause auto-scroll on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(scrollInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        startAutoScroll();
    });

    startAutoScroll();
}

function initializeContactForm() {
    // Contact Form Modal
    const contactLink = document.querySelector('a[href="#contact-modal"]');
    const contactModal = document.getElementById('contact-modal');
    const modalCloseBtn = contactModal ? contactModal.querySelector('.modal-close') : null;

    if (contactLink && contactModal && modalCloseBtn) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.style.display = 'flex';
        });

        modalCloseBtn.addEventListener('click', () => {
            contactModal.style.display = 'none';
        });

        contactModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                contactModal.style.display = 'none';
            }
        });

        // Handle contact form submission
        const contactForm = contactModal.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data using IDs
                const name = document.getElementById('contact-name').value.trim();
                const email = document.getElementById('contact-email').value.trim();
                const message = document.getElementById('contact-message').value.trim();
                
                // Basic validation
                if (!name || !email || !message) {
                    alert('Please fill in all fields');
                    return;
                }
                
                // Simple email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }
                
                // Show success message (replace with actual form submission logic)
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                contactModal.style.display = 'none';
            });
        }
    }
}

function initializeAnimations() {
    // Animate stats on scroll with Intersection Observer
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const targetNumber = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                    animateNumber(stat, targetNumber, stat.textContent);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    function animateNumber(element, target, originalText) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = originalText;
                clearInterval(timer);
            } else {
                const suffix = originalText.replace(/[0-9]/g, '').replace('+', '');
                element.textContent = Math.floor(current) + suffix + '+';
            }
        }, 30);
    }
}

// Note: Preloader is now handled in the initializePreloader function above
// This is kept as a backup for any edge cases
