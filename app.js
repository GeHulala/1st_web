/* ========================================
   心流工坊 · 心理工具发布网站
   交互逻辑
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. Navbar Scroll Effect
    // ============================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar background on scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (currentScroll > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink(currentScroll);

        lastScroll = currentScroll;
    });

    // ============================
    // 2. Mobile Nav Toggle
    // ============================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ============================
    // 3. Active Nav Link on Scroll
    // ============================
    function updateActiveNavLink(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================
    // 4. Back to Top
    // ============================
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================
    // 5. Stat Counter Animation
    // ============================
    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(eased * target);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Intersection Observer for stat counters
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'), 10);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        statsObserver.observe(document.querySelector('.hero-stats'));
    }

    // ============================
    // 6. Tool Cards Intersection Animation
    //     (already animated via CSS, but we ensure they show when in view)
    // ============================
    // The cards already have CSS animation-delay, but we can use a fallback
    // This just ensures any cards not in view on load still animate when scrolled to
    const toolCards = document.querySelectorAll('.tool-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    toolCards.forEach(card => {
        // Pause animation initially so observer can start them
        card.style.animationPlayState = 'paused';
        cardObserver.observe(card);
    });

    // ============================
    // 7. Contact Form
    // ============================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        if (!name || !email || !message) {
            showToast('请填写所有字段 ✍️', false);
            return;
        }

        // Simple email validation
        if (!email.includes('@') || !email.includes('.')) {
            showToast('请输入有效的邮箱地址 📧', false);
            return;
        }

        // Simulate sending
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '发送中...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('感谢你的留言！我们会尽快回复 💌', true);
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1200);
    });

    // ============================
    // 8. Toast Notification System
    // ============================
    function showToast(message, isSuccess = false) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        if (isSuccess) {
            toast.classList.add('success');
        }
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }

    // ============================
    // 9. Smooth Scroll for Anchor Links
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // 10. Parallax Effect on Background Circles
    // ============================
    const bgCircles = document.querySelectorAll('.bg-circle');

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        bgCircles.forEach((circle, index) => {
            const speed = 15 + index * 5;
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;
            circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // ============================
    // 11. Blog Card Hover Effect Enhancement
    // ============================
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const emoji = this.querySelector('.blog-emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1.2) rotate(5deg)';
                emoji.style.transition = 'transform 0.4s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const emoji = this.querySelector('.blog-emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // ============================
    // 12. Tool Card Icon Hover
    // ============================
    document.querySelectorAll('.tool-card').forEach(card => {
        const icon = card.querySelector('.card-icon');
        if (!icon) return;

        card.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(-5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    console.log('🌿 心流工坊 · 已就绪');
});