
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('[data-nav]');
    const navLinks = navMenu ? navMenu.querySelectorAll('a[href^="#"]') : [];
    const progressBar = document.getElementById('progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('main section[id]');
    const floatingItems = document.querySelectorAll('[data-floating]');
    const revealElements = document.querySelectorAll('[data-reveal]');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const yearEl = document.getElementById('year');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const submitBtnInitialMarkup = submitBtn ? submitBtn.innerHTML : '';

    document.querySelectorAll('.form-error').forEach((error) => {
        error.dataset.defaultMessage = error.textContent.trim();
    });

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear().toString();
    }

    // ============ PARTICLE SYSTEM INITIALIZATION ============
    const initParticles = () => {
        if (typeof tsParticles === 'undefined') {
            console.warn('tsParticles not loaded');
            return;
        }

        const particleConfigs = [
            'particles-about-1', 'particles-about-2', 'particles-about-3',
            'particles-skill-1', 'particles-skill-2', 'particles-skill-3'
        ];

        particleConfigs.forEach((id) => {
            const container = document.getElementById(id);
            if (!container) return;

            tsParticles.load(id, {
                particles: {
                    number: {
                        value: 30,
                        density: {
                            enable: true,
                            area: 800
                        }
                    },
                    color: {
                        value: ["#7b5cff", "#2cb9ff", "#ff82d1"]
                    },
                    shape: {
                        type: "circle"
                    },
                    opacity: {
                        value: 0.3,
                        random: true,
                        animation: {
                            enable: true,
                            speed: 0.8,
                            minimumValue: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: {
                            enable: true,
                            minimumValue: 1
                        },
                        animation: {
                            enable: true,
                            speed: 2,
                            minimumValue: 0.5,
                            sync: false
                        }
                    },
                    links: {
                        enable: true,
                        distance: 120,
                        color: "#7b5cff",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: true,
                        straight: false,
                        outModes: {
                            default: "bounce"
                        },
                        attract: {
                            enable: true,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detectsOn: "canvas",
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab",
                            parallax: {
                                enable: true,
                                smooth: 10,
                                force: 60
                            }
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            links: {
                                opacity: 0.5
                            }
                        }
                    }
                },
                detectRetina: true,
                fpsLimit: 60
            });
        });
    };

    // Wait for tsParticles to load, then initialize
    if (typeof tsParticles !== 'undefined') {
        initParticles();
    } else {
        window.addEventListener('load', initParticles);
    }

    // ============ PARALLAX EFFECT ON SCROLL ============
    const parallaxCards = document.querySelectorAll('.about-card, .skill-cluster, .project-card');
    let lastScrollY = window.scrollY;

    const updateParallax = () => {
        const scrollY = window.scrollY;
        const delta = scrollY - lastScrollY;

        parallaxCards.forEach((card) => {
            const particles = card.querySelector('.card-particles');
            if (!particles) return;

            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distance = (cardCenter - viewportCenter) / viewportCenter;

            // Parallax offset based on scroll position
            const parallaxY = distance * 20;
            particles.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
        });

        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', () => {
        if (!prefersReducedMotion.matches) {
            requestAnimationFrame(updateParallax);
        }
    }, { passive: true });

    // ============ NAVIGATION & SCROLL ============

    const closeNav = () => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    };

    const toggleNav = () => {
        if (!navMenu || !navToggle) return;
        const isOpen = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-open', isOpen);
    };

    navToggle?.addEventListener('click', toggleNav);

    document.addEventListener('click', (event) => {
        if (!navMenu || !navToggle) return;
        if (!navMenu.classList.contains('is-open')) return;
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            closeNav();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNav();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 960) {
            closeNav();
        }
    });

    const updateActiveLink = () => {
        if (!sections.length || !navLinks.length) return;
        const offset = (header?.offsetHeight || 0) + 32;
        const fromTop = window.scrollY + offset;
        let activeSectionId = '';

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (fromTop >= top && fromTop < bottom) {
                activeSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const targetSection = href.slice(1);
            const isActive = activeSectionId && targetSection === activeSectionId;
            link.classList.toggle('is-active', Boolean(isActive));

            // Update data-section attribute for icon visibility
            const sectionAttr = link.getAttribute('data-section');
            if (sectionAttr === activeSectionId) {
                link.classList.add('is-active');
            }
        });
    };

    const updateScrollState = () => {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollY = window.scrollY;
        const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

        if (progressBar) {
            progressBar.style.transform = `scaleX(${progress})`;
        }

        if (header) {
            header.classList.toggle('is-stuck', scrollY > 24);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('is-visible', scrollY > 480);
        }

        updateActiveLink();
    };

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            updateScrollState();
            scrollTicking = false;
        });
    }, { passive: true });

    updateScrollState();

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            closeNav();

            const offset = (header?.offsetHeight || 0) + 16;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        });
    });

    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    floatingItems.forEach((item, index) => {
        const delay = (index % 5) * -1.2;
        const duration = 8 + Math.random() * 4;
        item.style.animationDelay = `${delay}s`;
        item.style.animationDuration = `${duration}s`;

        if (prefersReducedMotion.matches) {
            item.style.animation = 'none';
        }
    });

    if (prefersReducedMotion.matches) {
        revealElements.forEach((element) => {
            element.classList.add('is-visible');
        });
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -10%'
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;

    const clearError = (field) => {
        const row = field.closest('.form-row');
        if (!row) return;
        row.classList.remove('invalid');
        const error = row.querySelector('.form-error');
        if (error) {
            error.textContent = error.dataset.defaultMessage || error.textContent;
        }
    };

    const validateField = (field) => {
        const row = field.closest('.form-row');
        if (!row) return true;

        const error = row.querySelector('.form-error');
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = error?.dataset.required || 'This field is required.';
        }

        if (isValid && value) {
            if (field.id === 'email' && !emailPattern.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address.';
            } else if (field.id === 'phone' && value && !phonePattern.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number.';
            }
        }

        row.classList.toggle('invalid', !isValid);
        if (error && message) {
            error.textContent = message;
        }

        return isValid;
    };

    if (contactForm) {
        if (typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: 'kexRGRF7inJ9iWK_Q' });
        }

        const fields = Array.from(contactForm.querySelectorAll('input, textarea'));

        fields.forEach((field) => {
            field.addEventListener('input', () => clearError(field));
            field.addEventListener('blur', () => validateField(field));
        });

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            let isValid = true;
            fields.forEach((field) => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending</span><span class="ri-loader-4-line" aria-hidden="true"></span>';
            }

            if (formStatus) {
                formStatus.textContent = 'Transmitting your message...';
                formStatus.className = 'pending';
            }

            if (typeof emailjs === 'undefined') {
                console.warn('EmailJS is not available.');
                if (formStatus) {
                    formStatus.textContent = 'Email service is temporarily unavailable. Please reach out via LinkedIn.';
                    formStatus.className = 'error';
                }

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtnInitialMarkup;
                }

                return;
            }

            try {
                await emailjs.sendForm('service_dm6e05n', 'template_241umha', contactForm);
                contactForm.reset();
                fields.forEach((field) => clearError(field));

                if (formStatus) {
                    formStatus.textContent = 'Thanks! I will get back to you shortly.';
                    formStatus.className = 'success';
                }
            } catch (error) {
                console.error('Email send failed', error);
                if (formStatus) {
                    formStatus.textContent = 'Unable to send right now. Please try again or reach me via LinkedIn.';
                    formStatus.className = 'error';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtnInitialMarkup;
                }

                if (formStatus) {
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = '';
                    }, 6000);
                }
            }
        });
    }

    const projectDetails = {
        ecommerce: {
            title: 'E-commerce Experience Accelerator',
            summary: 'A conversion-first storefront with orchestrated product cards, real-time cart states, and resilient checkout flows.',
            highlights: ['Adaptive merchandising layouts', 'Micro-animation system for feedback', 'Client-side caching for repeat visits'],
            status: 'Live demo coming soon. Happy to walk through the architecture during a call.'
        },
        weather: {
            title: 'Atmos Weather Console',
            summary: 'Ambient forecasting that morphs UI themes with live OpenWeather data and graceful offline handling.',
            highlights: ['Context-aware theming pipeline', 'API error resiliency with fallbacks', 'Optimised data hydration for mobile'],
            status: 'Currently staging for production. Ask for a guided exploration.'
        },
        quiz: {
            title: 'Pulse Quiz Arena',
            summary: 'Gamified assessments with adaptive difficulty, analytics hooks, and accessible interaction patterns.',
            highlights: ['State machine-driven scoring', 'Live leaderboard mechanics', 'Instrumentation ready for insights'],
            status: 'Feature complete; infra deployment in progress.'
        }
    };

    const projectButtons = document.querySelectorAll('[data-project]');

    const trapFocus = (container) => {
        const focusables = container.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return () => { };
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        const handleKeydown = (event) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        container.addEventListener('keydown', handleKeydown);
        return () => container.removeEventListener('keydown', handleKeydown);
    };

    const openProjectModal = (project) => {
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        const overlay = document.createElement('div');
        overlay.className = 'project-modal-overlay';
        overlay.innerHTML = `
			<div class="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
				<header class="project-modal__header">
					<h3 id="project-modal-title">${project.title}</h3>
					<button type="button" class="project-modal__close" aria-label="Dismiss project details">
						<span class="ri-close-line" aria-hidden="true"></span>
					</button>
				</header>
				<div class="project-modal__body">
					<p>${project.summary}</p>
					<ul class="project-modal__list">
						${project.highlights.map((item) => `<li>${item}</li>`).join('')}
					</ul>
					<p class="project-modal__status">${project.status}</p>
				</div>
				<footer class="project-modal__footer">
					<button type="button" class="btn btn--primary project-modal__action">Let us chat</button>
				</footer>
			</div>
		`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            overlay.classList.add('is-visible');
        });

        const modal = overlay.querySelector('.project-modal');
        const closeBtn = overlay.querySelector('.project-modal__close');
        const ctaBtn = overlay.querySelector('.project-modal__action');
        const releaseFocus = trapFocus(modal);

        const close = () => {
            overlay.classList.remove('is-visible');
            setTimeout(() => {
                releaseFocus();
                overlay.remove();
                document.body.style.overflow = '';
                previouslyFocused?.focus();
            }, 220);
        };

        closeBtn?.addEventListener('click', close);
        ctaBtn?.addEventListener('click', () => {
            close();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offset = (header?.offsetHeight || 0) + 16;
                const top = contactSection.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                close();
            }
        });

        document.addEventListener('keydown', function handleEscape(event) {
            if (event.key === 'Escape') {
                close();
                document.removeEventListener('keydown', handleEscape);
            }
        });

        const firstFocusable = modal?.querySelector('button');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    };

    projectButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-project');
            if (!key || !projectDetails[key]) return;
            openProjectModal(projectDetails[key]);
        });
    });
});

