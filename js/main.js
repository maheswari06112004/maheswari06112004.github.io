/* ============================================================
   MAHESWARI A - PORTFOLIO JAVASCRIPT
   Instant Cursor, Grid Glow, Navigation, Scroll Reveal
   ============================================================ */

(function () {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        cursor: {
            enabled: window.innerWidth > 768
        },
        scroll: {
            navOffset: 100,
            revealThreshold: 0.15
        }
    };

    // ==================== NEON BACKGROUND GRID ====================
    // Perfectly aligned grid cells with neon glow effect

    class NeonGrid {
        constructor() {
            if (window.innerWidth <= 768) return;

            this.cellSize = 80;
            this.cols = Math.floor(window.innerWidth / this.cellSize);
            this.rows = Math.floor(window.innerHeight / this.cellSize);

            this.overlay = document.createElement('div');
            this.overlay.className = 'grid-overlay';
            document.body.appendChild(this.overlay);

            this.cells = [];
            this.currentCell = null;
            this.fadeTimeout = null;

            this.init();
        }

        init() {
            this.createGrid();
            this.bindEvents();
        }

        createGrid() {
            this.overlay.innerHTML = '';
            this.cells = [];

            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.style.left = `${col * this.cellSize}px`;
                    cell.style.top = `${row * this.cellSize}px`;
                    cell.dataset.row = row;
                    cell.dataset.col = col;

                    this.overlay.appendChild(cell);
                    this.cells.push(cell);
                }
            }
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            document.addEventListener('mouseleave', () => this.clearGlow());
            window.addEventListener('resize', () => this.handleResize());
        }

        handleMouseMove(e) {
            const col = Math.floor(e.clientX / this.cellSize);
            const row = Math.floor(e.clientY / this.cellSize);

            if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
                return;
            }

            const index = row * this.cols + col;
            const cell = this.cells[index];

            if (cell && cell !== this.currentCell) {
                this.clearGlow();
                cell.classList.add('glow');
                this.currentCell = cell;

                if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
                this.fadeTimeout = setTimeout(() => {
                    if (this.currentCell) {
                        this.currentCell.classList.remove('glow');
                        this.currentCell = null;
                    }
                }, 150);
            }
        }

        clearGlow() {
            if (this.currentCell) {
                this.currentCell.classList.remove('glow');
                this.currentCell = null;
            }
            if (this.fadeTimeout) {
                clearTimeout(this.fadeTimeout);
                this.fadeTimeout = null;
            }
        }

        handleResize() {
            if (window.innerWidth <= 768) {
                this.destroy();
                return;
            }

            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.cols = Math.floor(window.innerWidth / this.cellSize);
                this.rows = Math.floor(window.innerHeight / this.cellSize);
                this.createGrid();
            }, 250);
        }

        destroy() {
            this.clearGlow();
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            this.cells = [];
        }
    }

    // ==================== CUSTOM CURSOR (THREE RINGS) ====================
    // Cursor dot with three delayed rings following

    class CustomCursor {
        constructor() {
            if (!CONFIG.cursor.enabled) return;

            // Create cursor elements
            this.cursor = document.createElement('div');
            this.cursor.className = 'cursor';

            this.ring1 = document.createElement('div');
            this.ring1.className = 'cursor-ring-1';

            this.ring2 = document.createElement('div');
            this.ring2.className = 'cursor-ring-2';

            this.ring3 = document.createElement('div');
            this.ring3.className = 'cursor-ring-3';

            document.body.appendChild(this.cursor);
            document.body.appendChild(this.ring1);
            document.body.appendChild(this.ring2);
            document.body.appendChild(this.ring3);

            // Position tracking
            this.mouseX = 0;
            this.mouseY = 0;

            // Dot follows instantly
            this.cursorX = 0;
            this.cursorY = 0;

            // Rings follow with delay
            this.ring1X = 0;
            this.ring1Y = 0;
            this.ring2X = 0;
            this.ring2Y = 0;
            this.ring3X = 0;
            this.ring3Y = 0;

            this.isVisible = false;
            this.isHovering = false;

            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                // Update dot instantly
                this.cursorX = this.mouseX;
                this.cursorY = this.mouseY;

                if (!this.isVisible) this.show();
            });

            document.addEventListener('mouseleave', () => this.hide());
            document.addEventListener('mouseenter', () => this.show());

            // Hover effects
            const interactiveElements = document.querySelectorAll(
                'a, button, .card, .project-card, .skill-item, .social-link, input, textarea'
            );

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => this.setHover(true));
                el.addEventListener('mouseleave', () => this.setHover(false));
            });

            // Hide on form inputs
            const formInputs = document.querySelectorAll('input, textarea, select');
            formInputs.forEach(el => {
                el.addEventListener('focus', () => this.hide());
                el.addEventListener('blur', () => this.show());
            });

            // Click effect
            document.addEventListener('mousedown', () => this.cursor.classList.add('click'));
            document.addEventListener('mouseup', () => this.cursor.classList.remove('click'));
        }

        animate() {
            // Ring 1 follows with slight delay (lerp factor 0.15)
            this.ring1X += (this.mouseX - this.ring1X) * 0.15;
            this.ring1Y += (this.mouseY - this.ring1Y) * 0.15;

            // Ring 2 follows with more delay (lerp factor 0.1)
            this.ring2X += (this.mouseX - this.ring2X) * 0.1;
            this.ring2Y += (this.mouseY - this.ring2Y) * 0.1;

            // Ring 3 follows with most delay (lerp factor 0.06)
            this.ring3X += (this.mouseX - this.ring3X) * 0.06;
            this.ring3Y += (this.mouseY - this.ring3Y) * 0.06;

            // Apply positions
            this.cursor.style.left = (this.cursorX - 4) + 'px';
            this.cursor.style.top = (this.cursorY - 4) + 'px';

            this.ring1.style.left = (this.ring1X - 12) + 'px';
            this.ring1.style.top = (this.ring1Y - 12) + 'px';

            this.ring2.style.left = (this.ring2X - 20) + 'px';
            this.ring2.style.top = (this.ring2Y - 20) + 'px';

            this.ring3.style.left = (this.ring3X - 28) + 'px';
            this.ring3.style.top = (this.ring3Y - 28) + 'px';

            requestAnimationFrame(() => this.animate());
        }

        show() {
            this.isVisible = true;
            this.cursor.classList.add('visible');
            this.ring1.classList.add('visible');
            this.ring2.classList.add('visible');
            this.ring3.classList.add('visible');
        }

        hide() {
            this.isVisible = false;
            this.cursor.classList.remove('visible');
            this.ring1.classList.remove('visible');
            this.ring2.classList.remove('visible');
            this.ring3.classList.remove('visible');
        }

        setHover(state) {
            this.isHovering = state;
            this.cursor.classList.toggle('hover', state);
            this.ring1.classList.toggle('hover', state);
            this.ring2.classList.toggle('hover', state);
            this.ring3.classList.toggle('hover', state);
        }
    }

    // ==================== NAVIGATION ====================

    class Navigation {
        constructor() {
            this.nav = document.querySelector('.nav');
            this.toggle = document.querySelector('.nav-toggle');
            this.menu = document.querySelector('.nav-menu');
            this.links = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('.section');

            this.init();
        }

        init() {
            if (this.toggle) {
                this.toggle.addEventListener('click', () => this.toggleMenu());
            }

            this.links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
            this.updateActiveLink();

            // Smooth scroll
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        const offset = 80;
                        const targetPosition = target.offsetTop - offset;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                });
            });
        }

        toggleMenu() {
            const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
            this.toggle.setAttribute('aria-expanded', !isExpanded);
            this.menu.classList.toggle('active');
        }

        closeMenu() {
            this.toggle.setAttribute('aria-expanded', 'false');
            this.menu.classList.remove('active');
        }

        updateActiveLink() {
            const scrollY = window.pageYOffset;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - CONFIG.scroll.navOffset;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    this.links.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    }

    // ==================== SCROLL REVEAL ====================

    class ScrollReveal {
        constructor() {
            this.elements = document.querySelectorAll(
                '.card, .project-card, .skill-item, .timeline-item'
            );

            this.init();
        }

        init() {
            this.elements.forEach((el) => {
                el.classList.add('reveal');
            });

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                },
                {
                    threshold: CONFIG.scroll.revealThreshold,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ==================== SCROLL COLOR TRANSITION ====================
    class ScrollColorTransition {
        constructor() {
            // Three-stage color transition: Cyan -> Blue -> Purple
            this.colors = [
                { r: 34, g: 211, b: 238 },   // Bright Cyan #22d3ee
                { r: 99, g: 102, b: 241 },   // Blue #6366f1
                { r: 192, g: 132, b: 252 }   // Bright Purple #c084fc
            ];
            this.maxScroll = 4000; // Total scroll distance for complete transition
            this.init();
        }

        init() {
            this.updateColors();
            window.addEventListener('scroll', () => this.updateColors(), { passive: true });
        }

        lerp(start, end, progress) {
            return Math.round(start + (end - start) * progress);
        }

        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }

        getColorAtProgress(progress) {
            // Determine which two colors to interpolate between
            const segments = this.colors.length - 1;
            const scaledProgress = progress * segments;
            const currentSegment = Math.floor(scaledProgress);
            const segmentProgress = scaledProgress - currentSegment;

            // Ensure we don't exceed array bounds
            const startColorIndex = Math.min(currentSegment, segments - 1);
            const endColorIndex = Math.min(currentSegment + 1, segments);

            const startColor = this.colors[startColorIndex];
            const endColor = this.colors[endColorIndex];

            return {
                r: this.lerp(startColor.r, endColor.r, segmentProgress),
                g: this.lerp(startColor.g, endColor.g, segmentProgress),
                b: this.lerp(startColor.b, endColor.b, segmentProgress)
            };
        }

        updateColors() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const progress = Math.min(scrollY / this.maxScroll, 1);

            // Get interpolated color
            const color = this.getColorAtProgress(progress);

            // Calculate hover color (brighter)
            const hoverR = Math.min(color.r + 40, 255);
            const hoverG = Math.min(color.g + 40, 255);
            const hoverB = Math.min(color.b + 40, 255);

            // Update CSS variables
            const root = document.documentElement;
            root.style.setProperty('--accent', this.rgbToHex(color.r, color.g, color.b));
            root.style.setProperty('--accent-hover', this.rgbToHex(hoverR, hoverG, hoverB));
            root.style.setProperty('--accent-rgb', `${color.r}, ${color.g}, ${color.b}`);
        }
    }

    // ==================== INITIALIZATION ====================
    document.addEventListener('DOMContentLoaded', () => {
        new NeonGrid();
        new CustomCursor();
        new Navigation();
        new ScrollReveal();
        new ScrollColorTransition();

        console.log('🚀 Portfolio initialized with dynamic color transitions');
    });

    // ==================== RESIZE HANDLER ====================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            CONFIG.cursor.enabled = window.innerWidth > 768;
        }, 250);
    });

})();
