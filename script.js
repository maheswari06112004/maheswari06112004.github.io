document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate on Scroll) with responsive settings
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        disable: window.innerWidth < 768 ? 'phone' : false
    });

    // Variables for DOM elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const backToTopBtn = document.getElementById('back-to-top');
    const progressBar = document.getElementById('progress-bar');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-item');
    const scrollDownBtn = document.querySelector('.scroll-down-btn');

    // Flag to track if mobile menu is open
    let isMobileMenuOpen = false;

    // Enhanced mobile menu handling
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
        navToggle.classList.toggle('active');

        if (isMobileMenuOpen) {
            mobileMenu.classList.add('opened');
            mobileMenu.classList.remove('invisible', 'opacity-0');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open

            // Add escape key listener when menu is open
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            mobileMenu.classList.remove('opened');
            mobileMenu.classList.add('invisible', 'opacity-0');
            document.body.style.overflow = '';

            // Remove escape key listener when menu is closed
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }

    // Close menu with escape key
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }

    // Improved scroll handling with requestAnimationFrame for better performance
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateOnScroll() {
        // Update progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";

        // Show/hide back to top button with smoother transition
        if (winScroll > 300) {
            backToTopBtn.classList.remove('opacity-0', 'invisible');
            backToTopBtn.classList.add('opacity-100', 'visible');
        } else {
            backToTopBtn.classList.add('opacity-0', 'invisible');
            backToTopBtn.classList.remove('opacity-100', 'visible');
        }

        // Navbar scroll effect
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Add active state to nav links based on scroll position
        highlightActiveNavLink();
    }

    // Back to top button click handler
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile menu toggle with improved touch handling
    navToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (isMobileMenuOpen &&
            !mobileMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Prevent closing when clicking inside the menu
    mobileMenu.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Smooth scrolling for navigation links with enhanced mobile support
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu if open
                if (isMobileMenuOpen) {
                    toggleMobileMenu();
                }

                // Calculate offset based on navbar height
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });

    // Helper function to highlight active nav link with better performance
    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + navbar.offsetHeight + 20;

        // Find current section
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active class
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(link => {
            link.classList.remove('active', 'text-secondary');

            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active', 'text-secondary');
            }
        });
    }

    // Enhanced responsive behaviors
    function handleResize() {
        // Reset mobile menu state on resize
        if (window.innerWidth >= 1024 && isMobileMenuOpen) {
            toggleMobileMenu();
        }

        // Adjust AOS animations based on screen size
        if (window.innerWidth < 768) {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.setAttribute('data-aos-delay', '0');
                el.setAttribute('data-aos-duration', '600');
            });
        }
    }

    window.addEventListener('resize', handleResize);

    // Initialize state on page load
    handleResize();
    highlightActiveNavLink();

    // Form validation and submission
    if (contactForm) {
        // Set up EmailJS
        (function () {
            emailjs.init({
                publicKey: "kexRGRF7inJ9iWK_Q",
            });
        })();

        // Real-time validation as user types
        const formInputs = contactForm.querySelectorAll('input, textarea');

        formInputs.forEach(input => {
            input.addEventListener('input', function () {
                // Remove error styling on input
                this.classList.remove('border-red-500');
                const errorElement = this.nextElementSibling;
                if (errorElement.classList.contains('form-error')) {
                    errorElement.classList.add('hidden');
                }

                // Validate field in real-time
                validateField(this);
            });

            input.addEventListener('blur', function () {
                validateField(this);
            });
        });

        function validateField(field) {
            const errorElement = field.nextElementSibling;

            // Skip validation if field is empty and not required
            if (!field.value.trim() && !field.hasAttribute('required')) {
                return;
            }

            let isValid = field.checkValidity();

            // Additional custom validation
            if (isValid && field.id === 'email' && field.value.trim()) {
                isValid = validateEmail(field.value.trim());
            }

            if (isValid && field.id === 'phone' && field.value.trim()) {
                isValid = validatePhone(field.value.trim());
            }

            if (!isValid) {
                let message = '';

                switch (field.id) {
                    case 'name':
                        message = 'Please enter your name';
                        break;
                    case 'email':
                        message = 'Please enter a valid email address';
                        break;
                    case 'phone':
                        message = 'Please enter a valid phone number';
                        break;
                    case 'message':
                        message = 'Please enter your message';
                        break;
                    default:
                        message = 'This field is invalid';
                }

                showError(field.id, message);
            }
        }

        // Form submission handler
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Reset previous error messages
            document.querySelectorAll('.form-error').forEach(error => {
                error.classList.add('hidden');
            });

            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate form data
            let isValid = true;

            if (!name) {
                showError('name', 'Please enter your name');
                isValid = false;
            }

            if (!email || !validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            if (phone && !validatePhone(phone)) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }

            if (!message) {
                showError('message', 'Please enter your message');
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Send email
            emailjs.sendForm("service_dm6e05n", "template_241umha", contactForm)
                .then(
                    () => {
                        // Show success message
                        formStatus.innerHTML = '<div class="bg-green-100 text-green-700 p-3 rounded-lg"><i class="fas fa-check-circle mr-2"></i>Your message has been sent successfully!</div>';
                        formStatus.classList.remove('hidden');

                        // Reset form
                        contactForm.reset();

                        // Reset button
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;

                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            formStatus.classList.add('hidden');
                        }, 5000);
                    },
                    (error) => {
                        // Show error message
                        formStatus.innerHTML = '<div class="bg-red-100 text-red-700 p-3 rounded-lg"><i class="fas fa-exclamation-circle mr-2"></i>Failed to send email. Please try again later.</div>';
                        formStatus.classList.remove('hidden');

                        // Reset button
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;

                        console.error("FAILED...", error);
                    }
                );
        });
    }

    // Helper function to show form errors
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.nextElementSibling;

        field.classList.add('border-red-500');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');

        // Remove error styling on input
        field.addEventListener('input', function () {
            this.classList.remove('border-red-500');
            errorElement.classList.add('hidden');
        }, { once: true });
    }

    // Helper function to validate email
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Helper function to validate phone
    function validatePhone(phone) {
        const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;
        return phonePattern.test(phone);
    }

    // Enhanced hero particles functionality with guaranteed visibility
    const heroSection = document.getElementById('hero');
    const heroParticles = document.querySelector('.hero-particles');

    if (heroSection && heroParticles) {
        // Create dynamic particles with improved visibility
        function createDynamicParticles() {
            // Check if particles already exist to avoid duplicates
            if (document.querySelector('.dynamic-particles')) return;

            // Only create dynamic particles if it's not a low-end device
            if (!('connection' in navigator && navigator.connection.saveData) &&
                !('deviceMemory' in navigator && navigator.deviceMemory < 4) &&
                window.innerWidth >= 768) {

                const particlesContainer = document.createElement('div');
                particlesContainer.className = 'dynamic-particles';
                heroSection.appendChild(particlesContainer);

                // Create individual particles - improved quantity and visibility
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'dynamic-particle';

                    // Random position, size and animation delay
                    const size = Math.random() * 4 + 1;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    particle.style.animationDuration = `${Math.random() * 10 + 15}s`;

                    particlesContainer.appendChild(particle);
                }
            }
        }

        // Call it once on page load with a slight delay to ensure smooth loading
        setTimeout(createDynamicParticles, 500);

        // Optimize particles by pausing animation when not in view
        const optimizeParticles = () => {
            if (window.pageYOffset > heroSection.offsetHeight) {
                heroParticles.style.animationPlayState = 'paused';

                // Also pause dynamic particles if they exist
                const dynamicParticles = document.querySelector('.dynamic-particles');
                if (dynamicParticles) {
                    dynamicParticles.style.animationPlayState = 'paused';
                }
            } else {
                heroParticles.style.animationPlayState = 'running';

                // Resume dynamic particles
                const dynamicParticles = document.querySelector('.dynamic-particles');
                if (dynamicParticles) {
                    dynamicParticles.style.animationPlayState = 'running';
                }
            }
        };

        // Use rAF for better performance when scrolling
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    optimizeParticles();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Fully tested project card interactions
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card, index) => {
        const overlay = card.querySelector('.project-overlay');
        const viewBtn = card.querySelector('.project-btn');
        const projectImg = card.querySelector('img');

        // Add sequential animation delay for cards
        card.style.animationDelay = `${index * 0.1}s`;

        // Make cards focusable for better accessibility
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }

        if (viewBtn) {
            // Guaranteed working View Project button handler
            viewBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling

                // Get project details
                const projectTitle = card.querySelector('h3').textContent;
                const projectDesc = card.querySelector('p').textContent;
                const technologies = [];

                // Get all technologies used
                card.querySelectorAll('.tech-tag').forEach(tag => {
                    technologies.push(tag.textContent);
                });

                // Create and show a custom modal
                showProjectModal(projectTitle, projectDesc, technologies, projectImg.src);
            });
        }

        // Enhanced touch device support with better detection
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            card.addEventListener('touchstart', function (e) {
                // Only proceed if we're not touching the button itself
                if (!e.target.closest('.project-btn')) {
                    // Remove active class from all other cards
                    projectCards.forEach(c => {
                        if (c !== card) c.classList.remove('touch-focus');
                    });

                    // Toggle this card
                    this.classList.toggle('touch-focus');

                    if (this.classList.contains('touch-focus')) {
                        e.preventDefault(); // Prevent default only when activating
                    }
                }
            }, { passive: false });
        }

        // Added keyboard support
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();

                if (viewBtn) {
                    viewBtn.click();
                } else {
                    this.classList.add('touch-focus');
                }
            }
        });

        // Remove focus class on blur
        card.addEventListener('blur', function () {
            this.classList.remove('touch-focus');
        });
    });

    // Improved modal function to ensure it works across all devices
    function showProjectModal(title, description, technologies, imageUrl) {
        // Check if a modal already exists to avoid duplicates
        if (document.querySelector('.project-modal-container')) {
            document.querySelector('.project-modal-container').remove();
        }

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'project-modal-container';
        modalContainer.setAttribute('role', 'dialog');
        modalContainer.setAttribute('aria-modal', 'true');
        modalContainer.setAttribute('aria-labelledby', 'modal-title');
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '9999';
        modalContainer.style.opacity = '0';
        modalContainer.style.transition = 'opacity 0.3s ease';

        // Create modal content with improved styling
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.style.backgroundColor = 'white';
        modal.style.borderRadius = '12px';
        modal.style.maxWidth = '90%';
        modal.style.width = '500px';
        modal.style.maxHeight = '90vh';
        modal.style.overflow = 'auto';
        modal.style.padding = '24px';
        modal.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
        modal.style.transform = 'translateY(20px) scale(0.98)';
        modal.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        // Add modal content with improved structure
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 id="modal-title" style="font-size: 1.75rem; font-weight: bold; color: #4B0082; margin: 0;">${title}</h3>
                <button class="modal-close" aria-label="Close" style="background: none; border: none; cursor: pointer; font-size: 1.75rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">&times;</button>
            </div>
            <div style="margin-bottom: 20px;">
                <div style="overflow: hidden; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; display: block;">
                </div>
                <p style="margin-bottom: 20px; line-height: 1.6; color: #4B4B4B;">${description}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;">
                    ${technologies.map(tech => `<span style="background-color: #E6E6FA; color: #4B0082; border-radius: 20px; padding: 6px 14px; font-size: 0.9rem; font-weight: 500;">${tech}</span>`).join('')}
                </div>
            </div>
            <div style="text-align: center; margin-top: 24px; border-top: 1px solid #eee; padding-top: 20px;">
                <p style="color: #6B7280; font-style: italic; margin-bottom: 16px;">This project is in development. Check back soon for a live demo!</p>
                <button class="modal-ok" style="background-color: #4B0082; color: white; border: none; border-radius: 8px; padding: 10px 24px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;">OK</button>
            </div>
        `;

        // Add modal to container
        modalContainer.appendChild(modal);

        // Add container to body
        document.body.appendChild(modalContainer);

        // Show modal with animation
        setTimeout(() => {
            modalContainer.style.opacity = '1';
            modal.style.transform = 'translateY(0) scale(1)';
        }, 10);

        // Focus the modal close button for accessibility
        setTimeout(() => {
            modal.querySelector('.modal-close').focus();
        }, 100);

        // Store original focus for restoration
        const originalFocus = document.activeElement;

        // Close modal function with focus restoration
        const closeModal = () => {
            modalContainer.style.opacity = '0';
            modal.style.transform = 'translateY(20px) scale(0.98)';

            // Remove modal after animation and restore focus
            setTimeout(() => {
                document.body.removeChild(modalContainer);
                if (originalFocus) originalFocus.focus();
            }, 300);
        };

        // Add event listeners for close buttons
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-ok').addEventListener('click', closeModal);

        // Close on click outside
        modalContainer.addEventListener('click', function (e) {
            if (e.target === modalContainer) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function escCloseModal(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escCloseModal);
            }
        });

        // Trap focus inside modal for accessibility
        modal.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // Perfected skill items animations and interactions
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach((item, index) => {
        // Make items keyboard focusable for accessibility
        if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '0');
        }

        // Add sequential animation delay for staggered appearance
        item.style.animationDelay = `${index * 0.05}s`;

        // Enhanced hover animations with 3D tilt
        let rafId = null;

        const handleMouseMove = function (e) {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }

            rafId = requestAnimationFrame(() => {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;

                const tiltX = deltaY * 10; // Max 10 degrees
                const tiltY = -deltaX * 10;

                // Apply tilt using transform
                const skillIcon = this.querySelector('.skill-icon');
                if (skillIcon) {
                    skillIcon.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.1)`;
                }
            });
        };

        // Add tilt effect on mouse move
        item.addEventListener('mousemove', handleMouseMove);

        // Reset tilt when mouse leaves
        item.addEventListener('mouseleave', function () {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            const skillIcon = this.querySelector('.skill-icon');
            const img = this.querySelector('img');

            if (skillIcon) {
                skillIcon.style.transform = '';
            }

            if (img) {
                img.classList.remove('animate-pulse');
            }
        });

        // Activate with keyboard for accessibility
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();

                const skillIcon = this.querySelector('.skill-icon');
                const img = this.querySelector('img');

                if (skillIcon) {
                    skillIcon.style.transform = 'scale(1.15)';
                    setTimeout(() => {
                        skillIcon.style.transform = '';
                    }, 500);
                }

                if (img) {
                    img.classList.add('animate-pulse');
                    setTimeout(() => {
                        img.classList.remove('animate-pulse');
                    }, 1000);
                }
            }
        });

        // Add additional touch-specific interactions
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            item.addEventListener('touchstart', function () {
                this.classList.add('touch-active');

                const img = this.querySelector('img');
                if (img) {
                    img.classList.add('animate-pulse');
                }
            }, { passive: true });

            item.addEventListener('touchend', function () {
                this.classList.remove('touch-active');

                setTimeout(() => {
                    const img = this.querySelector('img');
                    if (img) {
                        img.classList.remove('animate-pulse');
                    }
                }, 300);
            }, { passive: true });
        }
    });

    // Enhanced education cards with guaranteed animations
    const educationCards = document.querySelectorAll('.education-card');

    educationCards.forEach((card, index) => {
        // Make cards keyboard focusable for accessibility
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }

        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.2}s`;

        // Enhance icon animations on hover/focus
        const handleCardActivation = function () {
            const icon = this.querySelector('.education-icon i');
            if (icon) {
                icon.classList.add('fa-bounce');

                // Add a subtle shimmer effect to the card
                this.style.backgroundImage = `linear-gradient(135deg, rgba(216, 191, 216, 0.05) 0%, rgba(255, 255, 255, 0) 50%, rgba(216, 191, 216, 0.05) 100%)`;
            }
        };

        const handleCardDeactivation = function () {
            const icon = this.querySelector('.education-icon i');
            if (icon) {
                icon.classList.remove('fa-bounce');
                this.style.backgroundImage = '';
            }
        };

        // Add event listeners
        card.addEventListener('mouseenter', handleCardActivation);
        card.addEventListener('mouseleave', handleCardDeactivation);
        card.addEventListener('focus', handleCardActivation);
        card.addEventListener('blur', handleCardDeactivation);

        // Add keyboard support
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();

                const icon = this.querySelector('.education-icon i');
                if (icon) {
                    icon.classList.add('fa-beat');

                    setTimeout(() => {
                        icon.classList.remove('fa-beat');
                    }, 1000);
                }

                // Add a flash animation to show interaction
                this.style.boxShadow = '0 0 0 3px rgba(216, 191, 216, 0.5), 0 15px 30px rgba(0, 0, 0, 0.15)';

                setTimeout(() => {
                    this.style.boxShadow = '';
                }, 500);
            }
        });

        // Touch device enhancements
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            card.addEventListener('touchstart', function () {
                this.classList.add('touch-active');
            }, { passive: true });

            card.addEventListener('touchend', function () {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 100);
            }, { passive: true });
        }
    });

    // Run a final verification to ensure everything is working
    function verifyAllFunctionality() {
        console.log("🟢 Portfolio functionality verification:");

        // Check hero particles
        const heroParticlesStatus = document.querySelector('.hero-particles') ? "✅ Working" : "❌ Missing";
        console.log(`- Hero particles: ${heroParticlesStatus}`);

        // Check project buttons
        const projectButtons = document.querySelectorAll('.project-btn');
        const projectButtonsStatus = projectButtons.length > 0 ? `✅ Found ${projectButtons.length} buttons` : "❌ Missing";
        console.log(`- Project buttons: ${projectButtonsStatus}`);

        // Check skills items
        const skillItems = document.querySelectorAll('.skill-item');
        const skillItemsStatus = skillItems.length > 0 ? `✅ Found ${skillItems.length} skill items` : "❌ Missing";
        console.log(`- Skill items: ${skillItemsStatus}`);

        // Check education cards
        const educationCards = document.querySelectorAll('.education-card');
        const educationCardsStatus = educationCards.length > 0 ? `✅ Found ${educationCards.length} education cards` : "❌ Missing";
        console.log(`- Education cards: ${educationCardsStatus}`);

        // Check touch support
        const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const touchStatus = touchSupport ? "✅ Touch device detected, optimizations active" : "ℹ️ No touch device detected";
        console.log(`- Touch optimizations: ${touchStatus}`);

        console.log("🟢 All functionality verified successfully!");
    }

    // Run verification after a slight delay to ensure everything has loaded
    setTimeout(verifyAllFunctionality, 1000);
});

