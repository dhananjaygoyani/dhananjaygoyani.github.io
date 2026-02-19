/* =============================================
   PORTFOLIO — MAIN SCRIPT
   ============================================= */

(function () {
    'use strict';

    /* -------------------------------------------
       1. PARTICLE BACKGROUND
       ------------------------------------------- */
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 120;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        // connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / CONNECTION_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* -------------------------------------------
       2. TYPING ANIMATION
       ------------------------------------------- */
    const titles = [
        'AI & ML Engineer',
        'Data Analyst',
        'Python Developer',
        'Robotics Enthusiast',
        'Deep Learning Practitioner'
    ];
    const typingEl = document.getElementById('typingText');
    let titleIdx = 0, charIdx = 0, deleting = false;

    function typeStep() {
        const current = titles[titleIdx];
        if (!deleting) {
            typingEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(typeStep, 2000);
                return;
            }
            setTimeout(typeStep, 80);
        } else {
            typingEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                setTimeout(typeStep, 400);
                return;
            }
            setTimeout(typeStep, 40);
        }
    }
    typeStep();

    /* -------------------------------------------
       3. SCROLL REVEAL (IntersectionObserver)
       ------------------------------------------- */
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => revealObserver.observe(el));

    /* -------------------------------------------
       4. NAVBAR — scrolled class + active link
       ------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    function updateNav() {
        const scrollY = window.scrollY;
        // background
        navbar.classList.toggle('scrolled', scrollY > 50);
        // active link
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            const bottom = top + sec.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                const id = sec.getAttribute('id');
                navLinksAll.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
            }
        });
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    /* -------------------------------------------
       5. MOBILE MENU TOGGLE
       ------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    /* -------------------------------------------
       6. SMOOTH SCROLL for CTA buttons
       ------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
