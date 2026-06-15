/* ==========================================
   CIEL PORTFOLIO - JAVASCRIPT
   Interactivity & Animations
   ========================================== */

// --- Typing Effect ---
class TypeWriter {
    constructor(element, words, waitTime = 2000) {
        this.element = element;
        this.words = words;
        this.waitTime = waitTime;
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.textContent = this.txt;

        let typeSpeed = 80;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.waitTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// --- Navbar Scroll Effect ---
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// --- Counter Animation ---
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// --- Scroll Reveal / Intersection Observer ---
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// --- Counter Trigger on Scroll ---
function initCounterObserver() {
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// --- Smooth Scroll for Anchor Links ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// --- Contact Form Handler ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Try sending via mailto fallback (since Formspree needs setup)
        try {
            const mailtoLink = `mailto:osamabintang8@gmail.com?subject=Portfolio Contact from ${data.name}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)}`;
            window.open(mailtoLink, '_blank');
            
            // Show success
            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00ff88, #00d2ff)';
            
            // Show status message
            showFormStatus('Your email client has been opened. Send the email to complete!', 'success');
            
            form.reset();
        } catch (error) {
            btn.innerHTML = '<span>Error! Try Again</span> <i class="fas fa-exclamation-triangle"></i>';
            btn.style.background = 'linear-gradient(135deg, #ff5f57, #ff3333)';
            showFormStatus('Something went wrong. Please email me directly at osamabintang8@gmail.com', 'error');
        }

        // Reset button after delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    });
}

// --- Show Form Status Message ---
function showFormStatus(message, type) {
    const form = document.getElementById('contactForm');
    
    // Remove existing status
    const existing = form.querySelector('.form-status');
    if (existing) existing.remove();
    
    const status = document.createElement('div');
    status.className = `form-status ${type}`;
    status.textContent = message;
    form.appendChild(status);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        status.remove();
    }, 5000);
}

// --- Parallax Effect for Orbs ---
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// --- Active Nav Link Highlighting ---
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// --- Skill Tag Hover Effect ---
function initSkillHover() {
    const tags = document.querySelectorAll('.skill-tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        tag.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// --- Project Card Tilt Effect ---
function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// --- Dynamic Footer Year ---
function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
    // Typing effect
    const typedElement = document.querySelector('.typed-text');
    if (typedElement) {
        new TypeWriter(typedElement, [
            'AI Enthusiast',
            'Full-Stack Developer',
            'FinTech Builder',
            'Bot Developer',
            'Open Source Contributor',
            'Problem Solver'
        ], 2000);
    }

    // Initialize all modules
    initNavbar();
    initScrollReveal();
    initCounterObserver();
    initSmoothScroll();
    initContactForm();
    initParallax();
    initActiveNav();
    initSkillHover();
    initCardTilt();
    initFooterYear();

    // Remove preload class after page loads
    document.body.classList.add('loaded');
});

// --- Page Load Animation ---
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
