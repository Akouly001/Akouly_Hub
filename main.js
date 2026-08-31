/**
 * Akouly Ecosystem - Master JS Controller
 * Canvas Cyber-Mesh (Cyber), Canvas Code-Matrix (Apps), Glow Tracking & Theme Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPreloader();
    initCursorGlow();
    initCanvasBackground();
    initAppsCanvasBackground();
    initTerminalTyping();
    initScrollReveal();
    renderDomains();
    setupEventListeners();
    initNewFooter();
    initBusinessCursor();
    initLabParticles();
    initDiyCursor();
    initCyberCursor();
    initCyberGlitchButtons();
});

/**
 * 0. Préchargeur Circulaire avec Révélation Progressive depuis le Centre
 */
function initPreloader() {
    const preloader = document.getElementById('page-preloader');
    if (!preloader) return;

    const startTime = Date.now();
    const minDisplayTime = 800;
    let isRevealed = false;

    function revealPage() {
        if (isRevealed) return;
        isRevealed = true;

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDisplayTime - elapsed);

        setTimeout(() => {
            document.body.classList.add('page-revealing');
            preloader.classList.add('loaded');

            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('page-revealing');
            }, 1050);
        }, remaining);
    }

    if (document.readyState === 'complete') {
        revealPage();
    } else {
        window.addEventListener('load', revealPage);
        setTimeout(revealPage, 2500);
    }
}

/**
 * 1. Suivi Curseur Lumineux Ultra-Fluide (GPU 60-120 FPS sans Reflow)
 */
function initCursorGlow() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let mouseX = -1000, mouseY = -1000;
    let isTicking = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isTicking) {
            isTicking = true;
            requestAnimationFrame(() => {
                glow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
                isTicking = false;
            });
        }
    }, { passive: true });
}

/**
 * 2. Canvas Animé Cyber-Mesh pour Cybersécurité & Global (Optimisé 60 FPS)
 */
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const particles = [];
    const particleCount = Math.min(45, Math.floor((canvas.width * canvas.height) / 28000));
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 130 };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.6 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible) animate();
    });

    function animate() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const opacity = 1 - (dist / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.18})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 3. Canvas Animé Code-Matrix & Digital Nodes pour Apps & Dev (Optimisé 60 FPS)
 */
function initAppsCanvasBackground() {
    const canvas = document.getElementById('apps-bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const symbols = ['{ }', '</>', 'fn()', 'AI', 'λ', '01', 'git', 'API', 'Dart', 'Py'];
    const nodes = [];
    const nodeCount = Math.min(24, Math.floor((canvas.width * canvas.height) / 45000));
    const connectionDist = 140;
    const mouse = { x: null, y: null, radius: 150 };

    class AppNode {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.size = Math.random() * 5 + 10;
            this.alpha = Math.random() * 0.4 + 0.2;
            this.color = Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -30) this.x = canvas.width + 30;
            if (this.x > canvas.width + 30) this.x = -30;
            if (this.y < -30) this.y = canvas.height + 30;
            if (this.y > canvas.height + 30) this.y = -30;

            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 2;
                    this.y -= (dy / dist) * force * 2;
                }
            }
        }

        draw() {
            ctx.font = `${this.size}px 'Fira Code', monospace`;
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new AppNode());
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible) animate();
    });

    function animate() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();

            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (1 - (dist / connectionDist)) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 4. Terminal Widget Typing Simulation (Cyber)
 */
function initTerminalTyping() {
    const typedElem = document.getElementById('terminal-typed');
    if (!typedElem) return;

    const commands = ['whoami', 'cat certs.txt', 'nmap -sV target', 'suricata -c rules', 'git commit -m "feat"'];
    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentCmd = commands[cmdIndex];

        if (isDeleting) {
            typedElem.textContent = currentCmd.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedElem.textContent = currentCmd.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 90;

        if (!isDeleting && charIndex === currentCmd.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            speed = 600;
        }

        setTimeout(type, speed);
    }

    type();
}

/**
 * 5. Scroll Reveal
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.08 });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 6. Thème Switcher & Logo adaptatif (Dark / Light)
 */
function initTheme() {
    const savedTheme = localStorage.getItem('AKOULY_THEME') || 'dark';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('AKOULY_THEME', theme);

    const logoSrc = theme === 'dark' ? 'images/logo-dark.png' : 'images/logo-light.png';
    document.querySelectorAll('.logo-img, .hero-logo').forEach(img => {
        img.src = logoSrc;
    });

    const toggleIcon = document.querySelector('#themeToggleBtn i');
    if (toggleIcon) {
        if (theme === 'dark') {
            toggleIcon.className = 'fas fa-sun';
            toggleIcon.style.color = '#f59e0b';
        } else {
            toggleIcon.className = 'fas fa-moon';
            toggleIcon.style.color = '#7c3aed';
        }
    }

    if (window.canvasEngines && window.canvasEngines.length > 0) {
        window.canvasEngines.forEach(engine => engine.updateBaseColor());
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

function renderDomains() {
    const gridContainer = document.getElementById('domainsGrid');
    if (!gridContainer || typeof AKOULY_CONFIG === 'undefined') return;

    let html = '';
    AKOULY_CONFIG.domains.forEach(domain => {
        html += `
            <div class="domain-card" style="--card-color: ${domain.color}">
                <div class="card-top">
                    <div class="card-icon">
                        <i class="${domain.icon}"></i>
                    </div>
                    <span class="card-badge">${domain.badge}</span>
                </div>
                <h3 class="card-title">${domain.title}</h3>
                <p class="card-desc">${domain.description}</p>
                <ul class="card-highlights">
                    ${domain.highlights.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                </ul>
                <div class="card-footer">
                    <span style="font-size: 0.8rem; color: var(--text-dim);"><i class="far fa-folder-open"></i> ${domain.stats}</span>
                    <a href="${domain.link}" class="card-btn">
                        Explorer <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    });
    gridContainer.innerHTML = html;
}

function setupEventListeners() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('.header');

    if (menuToggle && navLinks) {
        function openMobileMenu() {
            if (header) header.classList.add('menu-open');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            if (header) header.classList.remove('menu-open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Fermer le menu mobile au clic sur un lien
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Fermer au clic sur le fond en dehors
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Fermer avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Réinitialiser au redimensionnement vers desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

/* ==========================================================================
   MOTEUR INTERACTIF DU NOUVEAU FOOTER — ALEC TEAR LETTERING CANVAS & LIQUID CTA
   ========================================================================== */

function hexToRgb(hex) {
    hex = (hex || '#06b6d4').replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

window.canvasEngines = [];
let isFooterLoopRunning = false;
let footerAnimationId = null;

function wakeUpFooterLoop() {
    if (!isFooterLoopRunning && !document.hidden) {
        isFooterLoopRunning = true;
        footerAnimationId = requestAnimationFrame(animateFooterLoop);
    }
}

function animateFooterLoop() {
    if (document.hidden) {
        isFooterLoopRunning = false;
        footerAnimationId = null;
        return;
    }

    let hasActiveMotion = false;
    for (let i = 0; i < window.canvasEngines.length; i++) {
        const active = window.canvasEngines[i].render();
        if (active) hasActiveMotion = true;
    }

    if (hasActiveMotion) {
        footerAnimationId = requestAnimationFrame(animateFooterLoop);
    } else {
        isFooterLoopRunning = false;
        footerAnimationId = null;
    }
}

class LetteringCanvas {
    constructor(card) {
        this.card = card;
        this.canvas = card.querySelector('.interest-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.text = card.dataset.text || 'LETTERING';
        this.accentColor = getComputedStyle(card).getPropertyValue('--card-accent').trim() || '#06b6d4';
        this.accentRgb = hexToRgb(this.accentColor);
        this.updateBaseColor();
        
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 95, radiusSq: 9025, isHovering: false };
        this.cardColorRatio = 0;
        this.isSettled = false;
        this.isInitialized = false;

        this.bindEvents();
        // Pré-chargement immédiat
        this.init();
    }

    updateBaseColor() {
        const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        this.baseRgb = isDark ? [255, 255, 255] : [26, 32, 44];
    }

    init() {
        if (!this.canvas || !this.card) return;
        const rect = this.card.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        this.width = Math.floor(rect.width);
        this.height = Math.floor(rect.height);
        if (this.width <= 0 || this.height <= 0) return;

        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        this.createTextParticles();
        this.renderStaticFrame();
        this.isInitialized = true;
    }

    createTextParticles() {
        this.particles = [];
        const w = this.width;
        const h = this.height;
        if (!w || !h) return;
        
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        offCanvas.width = w;
        offCanvas.height = h;

        let fontSize = Math.floor(h * 0.42);
        offCtx.font = `900 ${fontSize}px 'Syne', 'Plus Jakarta Sans', sans-serif`;
        let metrics = offCtx.measureText(this.text);
        const maxAllowedWidth = w * 0.85;

        if (metrics.width > maxAllowedWidth) {
            fontSize = Math.floor(fontSize * (maxAllowedWidth / metrics.width));
            offCtx.font = `900 ${fontSize}px 'Syne', 'Plus Jakarta Sans', sans-serif`;
        }

        offCtx.fillStyle = '#ffffff';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        
        const posX = w * 0.5;
        const posY = h * 0.52;
        offCtx.fillText(this.text, posX, posY);

        const imgData = offCtx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const step = 3.5;

        for (let y = 0; y < h; y += step) {
            const yInt = Math.floor(y);
            const rowOffset = yInt * w;
            for (let x = 0; x < w; x += step) {
                const xInt = Math.floor(x);
                const alpha = data[(rowOffset + xInt) * 4 + 3];
                if (alpha > 120) {
                    this.particles.push({
                        originX: x,
                        originY: y,
                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,
                        size: Math.random() * 0.8 + 1.6,
                        alpha: Math.random() * 0.15 + 0.65,
                        baseAlpha: Math.random() * 0.15 + 0.62,
                        spring: 0.10,
                        friction: 0.82
                    });
                }
            }
        }
        this.isSettled = true;
    }

    renderStaticFrame() {
        if (!this.ctx || this.particles.length === 0) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        const currentColorStr = `rgb(${this.baseRgb[0]}, ${this.baseRgb[1]}, ${this.baseRgb[2]})`;
        this.ctx.fillStyle = currentColorStr;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.globalAlpha = p.baseAlpha;
            this.ctx.beginPath();
            this.ctx.arc(p.originX, p.originY, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    bindEvents() {
        const onEnterOrMove = (clientX, clientY) => {
            const rect = this.card.getBoundingClientRect();
            this.mouse.x = clientX - rect.left;
            this.mouse.y = clientY - rect.top;
            this.mouse.isHovering = true;
            this.isSettled = false;

            this.card.style.setProperty('--mouse-x', `${this.mouse.x}px`);
            this.card.style.setProperty('--mouse-y', `${this.mouse.y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((this.mouse.y - centerY) / centerY) * -7;
            const rotateY = ((this.mouse.x - centerX) / centerX) * 7;
            this.card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            wakeUpFooterLoop();
        };

        this.card.addEventListener('mouseenter', (e) => {
            onEnterOrMove(e.clientX, e.clientY);
        }, { passive: true });

        this.card.addEventListener('mousemove', (e) => {
            onEnterOrMove(e.clientX, e.clientY);
        }, { passive: true });

        this.card.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
            this.mouse.isHovering = false;
            this.card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            wakeUpFooterLoop();
        });

        this.card.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                onEnterOrMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        this.card.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                onEnterOrMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        this.card.addEventListener('touchend', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
            this.mouse.isHovering = false;
            this.card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            wakeUpFooterLoop();
        });
    }

    render() {
        if (this.isSettled && !this.mouse.isHovering) return false;

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.mouse.isHovering) {
            this.cardColorRatio = Math.min(1, this.cardColorRatio + 0.12);
        } else {
            this.cardColorRatio = Math.max(0, this.cardColorRatio - 0.05);
        }

        const r = Math.round(this.baseRgb[0] + (this.accentRgb[0] - this.baseRgb[0]) * this.cardColorRatio);
        const g = Math.round(this.baseRgb[1] + (this.accentRgb[1] - this.baseRgb[1]) * this.cardColorRatio);
        const b = Math.round(this.baseRgb[2] + (this.accentRgb[2] - this.baseRgb[2]) * this.cardColorRatio);
        const currentColorStr = `rgb(${r}, ${g}, ${b})`;

        let totalMotion = 0;
        const rad = this.mouse.radius;
        const radSq = this.mouse.radiusSq;
        const mx = this.mouse.x;
        const my = this.mouse.y;
        const isHov = this.mouse.isHovering;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            const dx = mx - p.x;
            const dy = my - p.y;

            // Filtrage rapide par boîte englobante (optimisation 98% sans Math.sqrt inutile)
            if (isHov && Math.abs(dx) < rad && Math.abs(dy) < rad) {
                const distSq = dx * dx + dy * dy;
                if (distSq < radSq) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / rad) * 15;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force;
                    p.vy -= Math.sin(angle) * force;
                    p.alpha = Math.min(1, p.alpha + 0.35);
                }
            } else {
                p.alpha += (p.baseAlpha - p.alpha) * 0.06;
            }

            const springX = (p.originX - p.x) * p.spring;
            const springY = (p.originY - p.y) * p.spring;

            p.vx += springX;
            p.vy += springY;
            p.vx *= p.friction;
            p.vy *= p.friction;

            p.x += p.vx;
            p.y += p.vy;

            totalMotion += Math.abs(p.vx) + Math.abs(p.vy);

            this.ctx.fillStyle = currentColorStr;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.globalAlpha = 1;

        if (!isHov && this.cardColorRatio <= 0.01 && totalMotion < 0.1) {
            this.isSettled = true;
            return false;
        }

        return true;
    }
}

function initNewFooter() {
    // 1. Bouton Liquide Toggle
    const liquidWrapper = document.getElementById('liquidCtaWrapper');
    const btnLiquidMain = document.getElementById('btnLiquidMain');
    const btnRejoin = document.getElementById('btnRejoin');

    if (btnLiquidMain && liquidWrapper) {
        btnLiquidMain.addEventListener('click', (e) => {
            e.stopPropagation();
            liquidWrapper.classList.add('is-split');
        });
    }

    if (btnRejoin && liquidWrapper) {
        btnRejoin.addEventListener('click', (e) => {
            e.stopPropagation();
            liquidWrapper.classList.remove('is-split');
        });
    }

    document.addEventListener('click', (e) => {
        if (liquidWrapper && !liquidWrapper.contains(e.target) && liquidWrapper.classList.contains('is-split')) {
            liquidWrapper.classList.remove('is-split');
        }
    });

    // 2. Moteur de Canvas Lettering — Pré-chargement Prédictif Anticipé
    const cards = document.querySelectorAll('.interest-card');
    if (!cards || cards.length === 0) return;

    window.canvasEngines = [];
    
    // Initialisation immédiate des instances pour créer les particules dès que le navigateur est disponible
    const setupEngines = () => {
        if (window.canvasEngines.length === 0) {
            cards.forEach(card => {
                window.canvasEngines.push(new LetteringCanvas(card));
            });
        }
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(setupEngines, { timeout: 150 });
    } else {
        setTimeout(setupEngines, 40);
    }

    // Réajustement des dimensions au redimensionnement
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            for (let i = 0; i < window.canvasEngines.length; i++) {
                window.canvasEngines[i].init();
            }
            wakeUpFooterLoop();
        }, 120);
    }, { passive: true });

    // 3. Pré-chargement et Réveil Anticipé dès l'Approche des Vagues (1000px avant la vue)
    const footerTarget = document.querySelector('.new-footer') || document.querySelector('.interests-grid') || document.querySelector('.air');
    if (footerTarget && 'IntersectionObserver' in window) {
        const approachObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Pré-chauffer et réveiller les tuiles avant même que l'utilisateur n'arrive dessus
                    setupEngines();
                    window.canvasEngines.forEach(eng => {
                        if (!eng.isInitialized) eng.init();
                        eng.isSettled = false;
                    });
                    wakeUpFooterLoop();
                }
            });
        }, { rootMargin: '1000px 0px 800px 0px', threshold: 0.01 });

        approachObserver.observe(footerTarget);
    } else {
        setupEngines();
        wakeUpFooterLoop();
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            wakeUpFooterLoop();
        }
    });
}

/**
 * ==========================================================================
 * CURSEUR INTERACTIF HAUTE PRÉCISION & INERTIE (mix-blend-mode: difference)
 * Spécifique à la page Business
 * ==========================================================================
 */
function initBusinessCursor() {
    if (document.body.getAttribute('data-page') !== 'business') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.getElementById('cursorDot');
    const follower = document.getElementById('cursorFollower');
    if (!dot || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let isVisible = false;

    // Facteur d'interpolation (Lerp) pour l'inertie fluide
    const lerpSpeed = 0.12;

    // Capture instantanée de la position de la souris
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            dot.style.opacity = '1';
            follower.style.opacity = '1';
        }

        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    // Boucle d'animation à 60/120 FPS pour le cercle suiveur
    function renderCursor() {
        followerX += (mouseX - followerX) * lerpSpeed;
        followerY += (mouseY - followerY) * lerpSpeed;

        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Détection des zones interactives pour expansion & inversion
    function attachInteractableHover() {
        const interactables = document.querySelectorAll(
            'a, button, input, select, textarea, .project-card, .menu-toggle, .theme-toggle-btn, .btn-submit, label, .nav-link'
        );

        interactables.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('is-hovered');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('is-hovered');
            });
        });
    }

    attachInteractableHover();

    // Masquer le curseur lorsque la souris sort de la fenêtre
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        follower.style.opacity = '0';
        isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        follower.style.opacity = '1';
        isVisible = true;
    });
}

/**
 * ==========================================================================
 * PARTICULES DIY INTERACTIVES AU SUIVI DE SOURIS (+100% DE PARTICULES)
 * Spécifique à l'onglet DIY & Créations (data-page="lab")
 * ==========================================================================
 */
function initLabParticles() {
    if (document.body.getAttribute('data-page') !== 'lab') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const canvas = document.getElementById('particles-canvas') || document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configuration augmentée : +100% en quantité et +100% en taille des particules
    const CONFIG = {
        colors: ['#d1893f', '#3fa7b3', '#c45a78', '#ece6d8', '#f43f5e', '#fbbf24'],
        spawnPerMove: 6,       // Particules générées par mouvement
        minSize: 3.2,          // +100% taille doublée (était 1.6)
        maxSize: 10.0,         // +100% taille doublée (était 5.0)
        minLife: 45,           // durée de vie
        maxLife: 105,
        gravity: 0.018,        // légère gravité
        drag: 0.968,           // frottement
        speedFromMouse: 0.38,  // inertie
        maxParticles: 800      // limite maximale
    };

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });

    let particles = [];
    let mouse = { x: width / 2, y: height / 2, px: width / 2, py: height / 2, vx: 0, vy: 0 };
    let lastMoveTime = performance.now();

    function rand(min, max) { return min + Math.random() * (max - min); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function spawnParticle(x, y, vx, vy) {
        particles.push({
            x, y,
            vx: vx + rand(-1.4, 1.4),
            vy: vy + rand(-1.4, 1.4),
            size: rand(CONFIG.minSize, CONFIG.maxSize),
            life: 0,
            maxLife: rand(CONFIG.minLife, CONFIG.maxLife),
            color: pick(CONFIG.colors)
        });
        if (particles.length > CONFIG.maxParticles) {
            particles.splice(0, particles.length - CONFIG.maxParticles);
        }
    }

    function updateMouse(x, y) {
        lastMoveTime = performance.now();
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.x = x;
        mouse.y = y;
        mouse.vx = mouse.x - mouse.px;
        mouse.vy = mouse.y - mouse.py;

        if (reduceMotion) return;

        for (let i = 0; i < CONFIG.spawnPerMove; i++) {
            spawnParticle(
                mouse.x + rand(-8, 8),
                mouse.y + rand(-8, 8),
                mouse.vx * CONFIG.speedFromMouse,
                mouse.vy * CONFIG.speedFromMouse
            );
        }
    }

    window.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY), { passive: true });

    function step() {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life++;
            if (p.life >= p.maxLife) {
                particles.splice(i, 1);
                continue;
            }

            p.vy += CONFIG.gravity;
            p.vx *= CONFIG.drag;
            p.vy *= CONFIG.drag;
            p.x += p.vx;
            p.y += p.vy;

            const t = p.life / p.maxLife;
            const alpha = 1 - t;
            const size = p.size * (1 - t * 0.55);

            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(size, 0.1), 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        requestAnimationFrame(step);
    }
    step();
}

/**
 * ==========================================================================
 * CURSEUR 3D ROTATIF SUR 3 AXES (DIY)
 * Spécifique à l'onglet DIY & Créations (data-page="lab")
 * ==========================================================================
 */
function initDiyCursor() {
    if (document.body.getAttribute('data-page') !== 'lab') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursor = document.getElementById('diyCursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            cursor.style.opacity = '1';
        }

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    function attachInteractableHover() {
        const interactables = document.querySelectorAll(
            'a, button, input, select, textarea, .project-card, .menu-toggle, .theme-toggle-btn, .btn-submit, label, .nav-link'
        );

        interactables.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('is-hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-hovered');
            });
        });
    }

    attachInteractableHover();

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        isVisible = true;
    });
}

/**
 * ==========================================================================
 * CURSEUR CYBER PERSONNALISÉ (Cyber mouse.png)
 * Spécifique à l'onglet Cybersécurité (data-page="cyber")
 * ==========================================================================
 */
function initCyberCursor() {
    if (document.body.getAttribute('data-page') !== 'cyber') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursor = document.getElementById('cyberCursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            cursor.style.opacity = '1';
        }

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    function attachInteractableHover() {
        const interactables = document.querySelectorAll(
            'a, button, input, select, textarea, .project-card, .menu-toggle, .theme-toggle-btn, .btn-submit, label, .nav-link, .cert-filter-btn'
        );

        interactables.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('is-hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-hovered');
            });
        });
    }

    attachInteractableHover();

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        isVisible = true;
    });
}

/**
 * ==========================================================================
 * EFFET CYBER PHOTON GLITCH & EXTENDED ALTERATION POUR LES BOUTONS CYBER
 * Zéro duplication de texte — Gestion ciblée et sécurisée du nœud de texte
 * ==========================================================================
 */
function initCyberGlitchButtons() {
    if (document.body.getAttribute('data-page') !== 'cyber') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const CHARS = '!/<>_~*#01';
    const glitchElements = document.querySelectorAll(
        'body[data-page="cyber"] .btn, body[data-page="cyber"] .cert-filter-btn, body[data-page="cyber"] .glitch-target'
    );

    glitchElements.forEach((btn) => {
        // Trouver le nœud de texte significatif à l'intérieur du bouton
        let targetTextNode = null;
        for (let i = 0; i < btn.childNodes.length; i++) {
            const node = btn.childNodes[i];
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
                targetTextNode = node;
                break;
            }
        }

        const originalText = targetTextNode ? targetTextNode.nodeValue.trim() : btn.innerText.trim();
        if (!originalText) return;

        btn.setAttribute('data-original', originalText);

        function restore() {
            if (btn.flickerTimer) {
                clearInterval(btn.flickerTimer);
                btn.flickerTimer = null;
            }
            if (targetTextNode) {
                targetTextNode.nodeValue = ' ' + originalText;
            } else {
                btn.innerText = originalText;
            }
        }

        function trigger() {
            let frame = 0;
            const totalFrames = 7;

            if (btn.flickerTimer) clearInterval(btn.flickerTimer);

            btn.flickerTimer = setInterval(() => {
                frame++;

                if (frame <= totalFrames) {
                    const altered = originalText
                        .split('')
                        .map((char) => {
                            if (char === ' ') return ' ';
                            return Math.random() < 0.35
                                ? CHARS[Math.floor(Math.random() * CHARS.length)]
                                : char;
                        })
                        .join('');

                    if (targetTextNode) {
                        targetTextNode.nodeValue = ' ' + altered;
                    } else {
                        btn.innerText = altered;
                    }
                } else {
                    restore();
                }
            }, 35);
        }

        btn.addEventListener('mouseenter', trigger);
        btn.addEventListener('mouseleave', restore);
    });
}





