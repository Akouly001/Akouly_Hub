/**
 * Akouly Ecosystem - Master JS Controller
 * Canvas Cyber-Mesh (Cyber), Canvas Code-Matrix (Apps), Glow Tracking & Theme Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPreloader();
    initCursorGlow();
    initCanvasBackground();
    initAppsCodeBackground();
    initTerminalTyping();
    initScrollReveal();
    renderDomains();
    setupEventListeners();
    initNewFooter();
    initHomeCursor();
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
 * 3. Fond Lignes de Code Défilantes en Fondu pour Apps & Dev
 */
function initAppsCodeBackground() {
    if (document.body.getAttribute('data-page') !== 'apps') return;
    const pre = document.getElementById('codeScroll');
    if (!pre) return;

    const snippets = [
        'const scan = await audit.run(target);',
        'if (vuln.severity === "high") alert(vuln);',
        'export function connect(socket) { ... }',
        '// TODO: refactor auth middleware',
        'suricata -c suricata.yaml -i eth0',
        'class Contrix extends GameEngine {',
        'const socket = io.connect("https://api.akouly.dev");',
        'async function renderScene(renderer, camera) {',
        'ssh user@server -p 2222',
        'await brain.predict(inputTensor);',
        'export const routes = express.Router();',
        'return response.status(200).json({ status: "ok" });'
    ];

    let codeText = '';
    for (let i = 0; i < 30; i++) {
        codeText += snippets[i % snippets.length] + '\n';
    }
    pre.textContent = codeText + codeText;
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
   NOUVELLE ANIMATION : FINE BARRE DE CANVAS CENTRES D'INTÉRÊT (ZOOM 300%)
   Défilement continu infini à 60-120 FPS + Zoom x3 et texte affilié au survol / appui
   ========================================================================== */

const INTERESTS_CONFIG = [
    {
        id: 'gaming',
        title: 'JEUX VIDÉOS',
        desc: 'Minecraft is the best',
        icon: 'fas fa-gamepad',
        accent: '#10b981',
        glow: 'rgba(16, 185, 129, 0.45)'
    },
    {
        id: 'moto',
        title: 'MOTO',
        desc: 'Speed + Music is a forbidden combo',
        icon: 'fas fa-motorcycle',
        accent: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.45)'
    },
    {
        id: 'music',
        title: 'MUSIQUE',
        desc: 'Hayd is my favorite singer',
        icon: 'fas fa-headphones',
        accent: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.45)'
    },
    {
        id: 'reading',
        title: 'LECTURE',
        desc: "Albert Camus - L'étranger",
        icon: 'fas fa-book-open',
        accent: '#06b6d4',
        glow: 'rgba(6, 182, 212, 0.45)'
    },
    {
        id: 'sport',
        title: 'SPORT',
        desc: 'Football, Basket, Boxe ou Footing',
        icon: 'fas fa-dumbbell',
        accent: '#eab308',
        glow: 'rgba(234, 179, 8, 0.45)'
    },
    {
        id: 'travel',
        title: 'VOYAGE',
        desc: "Budget trop serré sinon j'ai les destinations",
        icon: 'fas fa-plane-departure',
        accent: '#14b8a6',
        glow: 'rgba(20, 184, 166, 0.45)'
    },
    {
        id: 'animes',
        title: 'ANIME',
        desc: 'Naruto, je suis fermé au débat',
        icon: 'fas fa-dragon',
        accent: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.45)'
    }
];

class InterestsTickerCanvasEngine {
    constructor() {
        this.wrapper = document.getElementById('interestsTickerWrapper');
        this.canvas = document.getElementById('interests-ticker-canvas');
        if (!this.canvas || !this.wrapper) return;

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.zoomCard = document.getElementById('interestZoomCard');
        this.zoomCardGlow = document.getElementById('zoomCardGlow');
        this.zoomCardIcon = document.getElementById('zoomCardIcon');
        this.zoomCardTitle = document.getElementById('zoomCardTitle');
        this.zoomCardDesc = document.getElementById('zoomCardDesc');
        this.tickerGlow = document.getElementById('tickerAmbientGlow');

        this.scrollOffset = 0;
        this.baseSpeed = 1.15; // vitesse fluide
        this.currentSpeed = 1.15;
        this.hoveredIndex = -1;
        this.touchActive = false;
        this.items = [];
        this.totalPatternWidth = 0;

        this.mouseX = -1000;
        this.mouseY = -1000;

        this.animId = null;
        this.isRunning = false;

        this.init();
        this.bindEvents();
        this.start();
    }

    init() {
        const rect = this.wrapper.getBoundingClientRect();
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = Math.floor(rect.width) || 1000;
        this.height = Math.floor(rect.height) || 78;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);

        this.computeItemDimensions();
    }

    computeItemDimensions() {
        const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        this.baseTextColor = isDark ? 'rgba(255, 255, 255, 0.88)' : 'rgba(17, 24, 39, 0.88)';
        this.separatorColor = isDark ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.35)';

        const baseFontSize = Math.floor(this.height * 0.30);
        this.baseFontSize = Math.max(15, Math.min(22, baseFontSize));
        this.ctx.font = `800 ${this.baseFontSize}px 'Plus Jakarta Sans', 'Syne', sans-serif`;

        let currentX = 0;
        const separatorText = '  ✦  ';
        const sepMetrics = this.ctx.measureText(separatorText);
        const sepWidth = sepMetrics.width;

        this.items = INTERESTS_CONFIG.map((conf, idx) => {
            const metrics = this.ctx.measureText(conf.title);
            const itemWidth = metrics.width;
            const fullSlotWidth = itemWidth + sepWidth + 48; // espacement net

            const itemData = {
                ...conf,
                index: idx,
                localX: currentX,
                textWidth: itemWidth,
                slotWidth: fullSlotWidth,
                sepWidth: sepWidth,
                scale: 1.0,
                targetScale: 1.0
            };
            currentX += fullSlotWidth;
            return itemData;
        });

        this.totalPatternWidth = currentX;
    }

    bindEvents() {
        const handleMove = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = clientX - rect.left;
            this.mouseY = clientY - rect.top;
        };

        this.canvas.addEventListener('mousemove', (e) => {
            handleMove(e.clientX, e.clientY);
        }, { passive: true });

        this.canvas.addEventListener('mouseenter', (e) => {
            this.wrapper.classList.add('has-hover');
            handleMove(e.clientX, e.clientY);
        }, { passive: true });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
            this.hoveredIndex = -1;
            this.wrapper.classList.remove('has-hover');
            this.hideZoomCard();
        });

        // Interactions tactiles mobiles
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.touchActive = true;
                this.wrapper.classList.add('has-hover');
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            this.touchActive = false;
            setTimeout(() => {
                if (!this.touchActive) {
                    this.mouseX = -1000;
                    this.mouseY = -1000;
                    this.hoveredIndex = -1;
                    this.wrapper.classList.remove('has-hover');
                    this.hideZoomCard();
                }
            }, 1800);
        });

        window.addEventListener('resize', () => {
            this.init();
        }, { passive: true });
    }

    showZoomCard(item, screenCenterX) {
        if (!this.zoomCard) return;

        this.zoomCard.style.setProperty('--card-accent', item.accent);
        this.zoomCard.style.setProperty('--card-glow', item.glow);

        if (this.tickerGlow) {
            this.tickerGlow.style.setProperty('--active-border', item.accent);
            this.tickerGlow.style.setProperty('--active-glow', item.glow);
        }

        if (this.zoomCardIcon) this.zoomCardIcon.className = item.icon;
        if (this.zoomCardTitle) {
            this.zoomCardTitle.textContent = item.title;
            this.zoomCardTitle.style.color = item.accent;
        }
        if (this.zoomCardDesc) this.zoomCardDesc.textContent = item.desc;

        // Positionnement horizontal dynamique ancré
        const wrapperRect = this.wrapper.getBoundingClientRect();
        const clampedLeft = Math.max(130, Math.min(wrapperRect.width - 130, screenCenterX));
        this.zoomCard.style.left = `${clampedLeft}px`;
        this.zoomCard.classList.add('is-visible');
    }

    hideZoomCard() {
        if (this.zoomCard) {
            this.zoomCard.classList.remove('is-visible');
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const loop = () => {
            if (!this.isRunning) return;
            if (!document.hidden) {
                this.render();
            }
            this.animId = requestAnimationFrame(loop);
        };
        this.animId = requestAnimationFrame(loop);
    }

    render() {
        if (!this.ctx || this.totalPatternWidth <= 0) return;

        // Ralentissement fluide au survol pour confort de lecture
        const targetSpeed = (this.hoveredIndex !== -1) ? 0.22 : this.baseSpeed;
        this.currentSpeed += (targetSpeed - this.currentSpeed) * 0.08;
        this.scrollOffset += this.currentSpeed;
        if (this.scrollOffset >= this.totalPatternWidth) {
            this.scrollOffset -= this.totalPatternWidth;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        const centerY = this.height / 2;
        const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        this.baseTextColor = isDark ? 'rgba(255, 255, 255, 0.88)' : 'rgba(17, 24, 39, 0.88)';
        this.separatorColor = isDark ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.35)';

        const copiesNeeded = Math.ceil(this.width / this.totalPatternWidth) + 2;

        let currentlyDetectedHover = -1;
        let detectedItem = null;
        let detectedScreenX = this.width / 2;

        // 1. Détection des collisions & mot survolé
        for (let copy = 0; copy < copiesNeeded; copy++) {
            const copyBaseX = copy * this.totalPatternWidth - this.scrollOffset;

            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                const itemCenterX = copyBaseX + item.localX + item.textWidth / 2 + 24;

                if (this.mouseX >= 0 && this.mouseY >= 0 && this.mouseY <= this.height) {
                    const hitLeft = itemCenterX - item.textWidth * 0.65 - 16;
                    const hitRight = itemCenterX + item.textWidth * 0.65 + 16;
                    if (this.mouseX >= hitLeft && this.mouseX <= hitRight) {
                        currentlyDetectedHover = i;
                        detectedItem = item;
                        detectedScreenX = itemCenterX;
                    }
                }
            }
        }

        this.hoveredIndex = currentlyDetectedHover;

        if (detectedItem) {
            this.showZoomCard(detectedItem, detectedScreenX);
        } else if (this.hoveredIndex === -1 && !this.touchActive) {
            this.hideZoomCard();
        }

        // 2. Interpolation de l'effet de zoom (x3.0 = 300%)
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const isHovered = (this.hoveredIndex === i);
            item.targetScale = isHovered ? 3.0 : 1.0;
            item.scale += (item.targetScale - item.scale) * 0.22;
        }

        // 3. Rendu Canvas haute définition
        for (let copy = 0; copy < copiesNeeded; copy++) {
            const copyBaseX = copy * this.totalPatternWidth - this.scrollOffset;

            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                const itemCenterX = copyBaseX + item.localX + item.textWidth / 2 + 24;

                if (itemCenterX < -200 || itemCenterX > this.width + 200) continue;

                const isZoomed = item.scale > 1.08;

                this.ctx.save();
                this.ctx.translate(itemCenterX, centerY);
                this.ctx.scale(item.scale, item.scale);

                // Lueur et couleur d'accent néon sur l'élément avec zoom 300%
                if (isZoomed) {
                    this.ctx.shadowColor = item.accent;
                    this.ctx.shadowBlur = 18 * (item.scale - 1.0);
                    this.ctx.fillStyle = item.accent;
                } else {
                    this.ctx.shadowBlur = 0;
                    this.ctx.fillStyle = this.baseTextColor;
                }

                this.ctx.font = `800 ${this.baseFontSize}px 'Plus Jakarta Sans', 'Syne', sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(item.title, 0, 0);

                this.ctx.restore();

                // Séparateur losange / étoile
                const sepX = copyBaseX + item.localX + item.textWidth + 24 + item.sepWidth / 2;
                if (sepX > -50 && sepX < this.width + 50) {
                    this.ctx.save();
                    this.ctx.font = `700 ${this.baseFontSize * 0.75}px 'Plus Jakarta Sans', sans-serif`;
                    this.ctx.fillStyle = this.separatorColor;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('✦', sepX, centerY);
                    this.ctx.restore();
                }
            }
        }
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

    // 2. Moteur de Canvas Ticker pour les Centres d'Intérêt (Zoom 300%)
    const tickerContainer = document.getElementById('interestsTickerWrapper');
    if (tickerContainer) {
        window.interestsTickerEngine = new InterestsTickerCanvasEngine();
    }
}

/**
 * ==========================================================================
 * CURSEUR SOBRE ACCUEIL — VARIANTE 1 (POINT + ANNEAU RESPIRANT À INERTIE)
 * Spécifique à la page Accueil (data-page="home")
 * ==========================================================================
 */
function initHomeCursor() {
    if (document.body.getAttribute('data-page') !== 'home') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot1 = document.getElementById('dot1');
    const ring1 = document.getElementById('ring1');
    if (!dot1 || !ring1) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;

        if (!isVisible) {
            isVisible = true;
            dot1.style.opacity = '1';
            ring1.style.opacity = '1';
        }

        dot1.style.left = `${mx}px`;
        dot1.style.top = `${my}px`;
    }, { passive: true });

    function renderRing() {
        rx += (mx - rx) * 0.22;
        ry += (my - ry) * 0.22;
        ring1.style.left = `${rx}px`;
        ring1.style.top = `${ry}px`;
        requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    function attachHoverHandlers() {
        const interactables = document.querySelectorAll(
            'a, button, input, select, textarea, .action-card, .univers-card, .menu-toggle, .theme-toggle-btn, .btn, .nav-link, .interests-ticker-wrapper, .profil-card, .hero-cta-row a, .contrix-banner a'
        );

        interactables.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('grow1');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('grow1');
            });
        });
    }

    attachHoverHandlers();

    document.addEventListener('mouseleave', () => {
        dot1.style.opacity = '0';
        ring1.style.opacity = '0';
        isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        dot1.style.opacity = '1';
        ring1.style.opacity = '1';
        isVisible = true;
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





