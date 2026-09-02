/**
 * Akouly Ecosystem - Master JS Controller
 * Canvas Cyber-Mesh (Cyber), Canvas Code-Matrix (Apps), Glow Tracking & Theme Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    try { initTheme(); } catch (e) { console.warn('Theme init error:', e); }
    try { initCursorGlow(); } catch (e) {}
    try { initCanvasBackground(); } catch (e) {}
    try { initAppsCodeBackground(); } catch (e) {}
    try { initDiyBackground(); } catch (e) {}
    try { initTerminalTyping(); } catch (e) {}
    try { initScrollReveal(); } catch (e) {}
    try { renderDomains(); } catch (e) {}
    try { setupEventListeners();

    // Protection anti-téléchargement / anti-copie de la photo de profil
    document.querySelectorAll('.profil-avatar-placeholder, .profil-avatar-img, .avatar-shield').forEach(el => {
        el.addEventListener('contextmenu', e => e.preventDefault());
        el.addEventListener('dragstart', e => e.preventDefault());
    }); } catch (e) {}
    try { initNewFooter(); } catch (e) {}
    try { initHomeCursor(); } catch (e) {}
    try { initBusinessCursor(); } catch (e) {}
    try { initUniverseCursors(); } catch (e) {}
    try { initAvatar3DTiltPhysics(); } catch (e) {}
    try { initMagicalUnderlines(); } catch (e) {}
    try { initSlideBumpObserver(); } catch (e) {}
    try { initScrollHintLottie(); } catch (e) {}
});

/**
 * 0. Préchargeur Fluide & Révélation Immédiate dès Chargement Complet (Optimisé 60-120 FPS)
 */
function initPreloader() {
    const preloader = document.getElementById('page-preloader');
    if (!preloader) return;

    const startTime = Date.now();
    const minDisplayTime = 300; // Affichage ultra-rapide
    let isRevealed = false;
    let isWindowLoaded = (document.readyState === 'complete');

    function dismissPreloader() {
        if (isRevealed) return;
        isRevealed = true;

        preloader.classList.add('loaded');

        // Retrait propre du DOM après la transition CSS fluide
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 400);
    }

    function checkAndDismiss() {
        if (!isWindowLoaded) return;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDisplayTime - elapsed);
        setTimeout(dismissPreloader, remaining);
    }

    // Sécurité maximale ultra-rapide (1.2s) si une ressource externe / CDN tiers tarde
    setTimeout(() => {
        if (!isRevealed) {
            isWindowLoaded = true;
            dismissPreloader();
        }
    }, 1200);

    if (isWindowLoaded) {
        checkAndDismiss();
    } else {
        window.addEventListener('load', () => {
            isWindowLoaded = true;
            checkAndDismiss();
        }, { once: true });
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
 * 3b. Fond Animé Créations & DIY : Objets d'atelier vectoriels en chute fluide (10 outils)
 */
function initDiyBackground() {
    if (document.body.getAttribute('data-page') !== 'lab') return;
    const canvas = document.getElementById('diy-canvas') || document.getElementById('bg-canvas');
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

    const TOOL_TYPES = [
        'stylo',
        'crayon',
        'regle',
        'equerre',
        'compas',
        'ciseaux',
        'colle',
        'papier',
        'pointe',
        'metre'
    ];

    const mouse = { x: null, y: null, radius: 140 };

    class FallingTool {
        constructor(initial = false) {
            this.reset(initial);
        }

        reset(initial = false) {
            const w = canvas.width || window.innerWidth || 1200;
            const h = canvas.height || window.innerHeight || 800;
            this.x = Math.random() * w;
            this.y = initial ? Math.random() * h : -60;
            this.speed = 0.35 + Math.random() * 0.45;
            this.size = 14 + Math.random() * 22;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.012;
            this.type = TOOL_TYPES[Math.floor(Math.random() * TOOL_TYPES.length)];
            this.opacity = 0.22 + Math.random() * 0.38;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = 0.012 + Math.random() * 0.014;
            this.vx = 0;
        }

        update() {
            this.y += this.speed;
            this.rotation += this.rotSpeed;
            this.swayAngle += this.swaySpeed;
            this.x += Math.sin(this.swayAngle) * 0.4 + this.vx;
            this.vx *= 0.94;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.vx += (dx / dist) * force * 0.9;
                    this.rotation += (dx > 0 ? 0.02 : -0.02) * force;
                }
            }

            const h = canvas.height || window.innerHeight || 800;
            if (this.y > h + 60) {
                this.reset(false);
            }
        }

        draw(ctx, isLight) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.size / 20, this.size / 20);

            const strokeColor = isLight
                ? `rgba(180, 83, 9, ${this.opacity * 0.85})`
                : `rgba(224, 163, 57, ${this.opacity})`;
            const fillColor = isLight
                ? `rgba(180, 83, 9, ${this.opacity * 0.12})`
                : `rgba(224, 163, 57, ${this.opacity * 0.15})`;

            ctx.strokeStyle = strokeColor;
            ctx.fillStyle = fillColor;
            ctx.lineWidth = 1.6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            switch(this.type) {
                case 'stylo':
                    ctx.beginPath();
                    ctx.strokeRect(-12, -3, 20, 6);
                    ctx.moveTo(8, -3); ctx.lineTo(15, 0); ctx.lineTo(8, 3);
                    ctx.moveTo(-12, -1.5); ctx.lineTo(-15, -1.5); ctx.lineTo(-15, 1.5); ctx.lineTo(-12, 1.5);
                    ctx.moveTo(-9, -3); ctx.lineTo(-9, -6); ctx.lineTo(-2, -6); ctx.lineTo(-2, -3);
                    ctx.stroke();
                    break;

                case 'crayon':
                    ctx.beginPath();
                    ctx.strokeRect(-14, -3.5, 20, 7);
                    ctx.moveTo(-14, 0); ctx.lineTo(6, 0);
                    ctx.moveTo(6, -3.5); ctx.lineTo(14, 0); ctx.lineTo(6, 3.5);
                    ctx.moveTo(11, -1.3); ctx.lineTo(14, 0); ctx.lineTo(11, 1.3);
                    ctx.stroke();
                    break;

                case 'regle':
                    ctx.strokeRect(-18, -5, 36, 10);
                    for(let i = -14; i <= 14; i += 4) {
                        ctx.beginPath();
                        ctx.moveTo(i, -5);
                        ctx.lineTo(i, (i % 8 === 0) ? 0 : -2);
                        ctx.stroke();
                    }
                    break;

                case 'equerre':
                    ctx.beginPath();
                    ctx.moveTo(-14, -14); ctx.lineTo(-14, 14); ctx.lineTo(14, 14); ctx.closePath();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(-10, -5); ctx.lineTo(-10, 10); ctx.lineTo(5, 10); ctx.closePath();
                    ctx.stroke();
                    break;

                case 'compas':
                    ctx.beginPath();
                    ctx.arc(0, -14, 2.5, 0, Math.PI * 2);
                    ctx.moveTo(0, -11.5); ctx.lineTo(-9, 14);
                    ctx.moveTo(0, -11.5); ctx.lineTo(9, 14);
                    ctx.moveTo(-5, 1); ctx.lineTo(5, 1);
                    ctx.arc(0, 1, 1.5, 0, Math.PI * 2);
                    ctx.stroke();
                    break;

                case 'ciseaux':
                    ctx.beginPath();
                    ctx.moveTo(-14, -8); ctx.lineTo(8, 3);
                    ctx.moveTo(-14, 8); ctx.lineTo(8, -3);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(13, 6, 4.5, 0, Math.PI * 2);
                    ctx.arc(13, -6, 4.5, 0, Math.PI * 2);
                    ctx.stroke();
                    break;

                case 'colle':
                    ctx.beginPath();
                    ctx.strokeRect(-7, -14, 14, 28);
                    ctx.moveTo(-7, -4); ctx.lineTo(7, -4);
                    ctx.moveTo(-7, 9); ctx.lineTo(7, 9);
                    ctx.strokeRect(-5, -17, 10, 3);
                    ctx.stroke();
                    break;

                case 'papier':
                    ctx.beginPath();
                    ctx.moveTo(-12, -12); ctx.lineTo(4, -12); ctx.lineTo(12, -4);
                    ctx.lineTo(12, 12); ctx.lineTo(-12, 12); ctx.closePath();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(4, -12); ctx.lineTo(4, -4); ctx.lineTo(12, -4);
                    ctx.moveTo(-8, 1); ctx.lineTo(6, 1);
                    ctx.moveTo(-8, 6); ctx.lineTo(2, 6);
                    ctx.stroke();
                    break;

                case 'pointe':
                    ctx.beginPath();
                    ctx.strokeRect(-5, -14, 10, 2.5);
                    ctx.moveTo(0, -11.5); ctx.lineTo(0, 10);
                    ctx.lineTo(-1.5, 10); ctx.lineTo(0, 15); ctx.lineTo(1.5, 10); ctx.lineTo(0, 10);
                    ctx.stroke();
                    break;

                case 'metre':
                    ctx.beginPath();
                    ctx.strokeRect(-11, -10, 20, 19);
                    ctx.arc(-1, -0.5, 4.5, 0, Math.PI * 2);
                    ctx.moveTo(9, 6); ctx.lineTo(15, 6); ctx.lineTo(15, 9);
                    ctx.stroke();
                    break;
            }
            ctx.restore();
        }
    }

    const toolCount = window.innerWidth < 768 ? 8 : 16;
    const tools = Array.from({ length: toolCount }, () => new FallingTool(true));

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

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        tools.forEach(tool => {
            tool.update();
            tool.draw(ctx, isLight);
        });

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
 * 6. Thème Switcher & Logo adaptatif (Dark / Light) avec Animation Lottie
 */
let lottieThemeAnim = null;

function initTheme() {
    const savedTheme = localStorage.getItem('AKOULY_THEME') || 'dark';
    applyTheme(savedTheme, false);
    initLottieThemeToggle(savedTheme);
}

function initLottieThemeToggle(initialTheme) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    // Supprimer tout contenu résiduel (ancienne icône)
    btn.innerHTML = '';
    
    const lottieBox = document.createElement('div');
    lottieBox.className = 'lottie-toggle-box';
    lottieBox.id = 'lottieThemeBox';
    btn.appendChild(lottieBox);

    function startLottie(animData) {
        if (lottieThemeAnim) lottieThemeAnim.destroy();
        lottieThemeAnim = lottie.loadAnimation({
            container: lottieBox,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: animData
        });

        lottieThemeAnim.addEventListener('DOMLoaded', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || initialTheme;
            if (currentTheme === 'dark') {
                lottieThemeAnim.goToAndStop(81, true); // Repos Nuit / Sombre
            } else {
                lottieThemeAnim.goToAndStop(0, true);  // Repos Jour / Clair
            }
        });
    }

    if (window.AKOULY_LOTTIE_TOGGLE) {
        startLottie(window.AKOULY_LOTTIE_TOGGLE);
    } else if (typeof lottie !== 'undefined') {
        fetch('animations/toggle.json')
            .then(res => res.json())
            .then(data => startLottie(data))
            .catch(err => console.warn('Erreur chargement Lottie:', err));
    }
}

function applyTheme(theme, animateLottie = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('AKOULY_THEME', theme);

    const logoSrc = theme === 'dark' ? 'images/logo-dark.png' : 'images/logo-light.png';
    document.querySelectorAll('.logo-img, .hero-logo').forEach(img => {
        img.src = logoSrc;
    });

    if (lottieThemeAnim && animateLottie) {
        if (theme === 'dark') {
            lottieThemeAnim.playSegments([20, 80], true); // Jour vers Nuit
        } else {
            lottieThemeAnim.playSegments([120, 200], true); // Nuit vers Jour
        }
    } else if (lottieThemeAnim && !animateLottie) {
        if (theme === 'dark') {
            lottieThemeAnim.goToAndStop(81, true);
        } else {
            lottieThemeAnim.goToAndStop(0, true);
        }
    }

    if (window.canvasEngines && window.canvasEngines.length > 0) {
        window.canvasEngines.forEach(engine => engine.updateBaseColor());
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, true);
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
        const separatorText = '       ';
        const sepMetrics = this.ctx.measureText(separatorText);
        const sepWidth = sepMetrics.width;
        // +1cm d'espacement supplémentaire (~38px supplémentaires)
        const extraSpacing1cm = 38;

        this.items = INTERESTS_CONFIG.map((conf, idx) => {
            const metrics = this.ctx.measureText(conf.title);
            const itemWidth = metrics.width;
            const fullSlotWidth = itemWidth + sepWidth + 48 + extraSpacing1cm;

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

        // 2. Interpolation pure du zoom (300% / x3.0) sans poussée
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
 * CURSEURS MULTI-UNIVERS & EFFETS LIÉS : CYBER, GAMING, APPS & DEV, DIY
 * ==========================================================================
 */
function initUniverseCursors() {
    const page = document.body.getAttribute('data-page');
    const validPages = ['cyber', 'gaming', 'apps', 'lab'];
    if (!validPages.includes(page)) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

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
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        }

        dot.style.left = `${mx}px`;
        dot.style.top = `${my}px`;
    }, { passive: true });

    function renderRing() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
        requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Effet de grossissement sur les cibles interactives
    function attachHoverHandlers() {
        const interactables = document.querySelectorAll(
            'a, button, input, select, textarea, .btn, .nav-link, .menu-toggle, .theme-toggle-btn, .project-card, .service-card, .tool-tag, .cert-filter-btn, .dim-close, .carousel-nav-btn, .carousel-dot, .glitch-target, .target, .cert-item, .contact-card, .spec-item'
        );

        interactables.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('ring-grow');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('ring-grow');
            });
        });
    }
    attachHoverHandlers();

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        isVisible = true;
    });

    // ── 1. EFFET CYBERSÉCURITÉ : Traînée Scan (caractères de terminal) ──
    if (page === 'cyber') {
        const scanChars = '01アカウリ#$%&<>';
        window.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.32) return;
            const el = document.createElement('span');
            el.className = 'scan-char';
            el.textContent = scanChars[Math.floor(Math.random() * scanChars.length)];
            el.style.left = `${e.clientX + (Math.random() * 16 - 8)}px`;
            el.style.top = `${e.clientY + (Math.random() * 16 - 8)}px`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 700);
        }, { passive: true });
    }

    // ── 2. EFFET GAMING : Étincelles au Clic ──
    if (page === 'gaming') {
        window.addEventListener('click', (e) => {
            for (let i = 0; i < 10; i++) {
                const s = document.createElement('div');
                s.className = 'spark';
                const angle = Math.random() * Math.PI * 2;
                const dist = 20 + Math.random() * 32;
                s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
                s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
                s.style.left = `${e.clientX}px`;
                s.style.top = `${e.clientY}px`;
                document.body.appendChild(s);
                setTimeout(() => s.remove(), 500);
            }
        });
    }

    // ── 3. EFFET DIY : Trait Crayon Multicolore ──
    if (page === 'lab') {
        const diyPalette = ['#22d3ee', '#10b981', '#8b5cf6', '#f97316', '#f43f5e', '#eab308'];
        let diyColorIndex = 0;
        window.addEventListener('mousemove', (e) => {
            const p = document.createElement('div');
            p.className = 'pencil-trail';
            p.style.background = diyPalette[diyColorIndex % diyPalette.length];
            diyColorIndex++;
            p.style.left = `${e.clientX}px`;
            p.style.top = `${e.clientY}px`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 600);
        }, { passive: true });
    }
}

/**
 * Déroulement / Rétractation fluide de la biographie détaillée (Section Qui Suis-je)
 * avec animation Lottie Pop-up (Man Working on Laptop)
 */
let lottieManWorkingAnim = null;

function initManWorkingLottie() {
    const container = document.getElementById('lottieManWorking');
    if (!container || typeof lottie === 'undefined') return;

    function startMan(data) {
        if (lottieManWorkingAnim) lottieManWorkingAnim.destroy();
        lottieManWorkingAnim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: data
        });
    }

    if (window.AKOULY_MAN_WORKING_LOTTIE) {
        startMan(window.AKOULY_MAN_WORKING_LOTTIE);
    } else if (typeof lottie !== 'undefined') {
        fetch('animations/man-working.json')
            .then(res => res.json())
            .then(data => startMan(data))
            .catch(err => console.warn('Erreur Lottie Man Working:', err));
    }
}

function toggleBioExpand() {
    const card = document.getElementById('profilCard') || document.querySelector('.profil-card');
    const content = document.getElementById('bioExpandedContent');
    const btnText = document.getElementById('btnToggleBioText');
    const btnIcon = document.getElementById('btnToggleBioIcon');
    const btn = document.getElementById('btnToggleBio');
    if (!content) return;

    const isExpanded = btn && btn.getAttribute('aria-expanded') === 'true';

    if (!isExpanded) {
        // Déroulement
        if (card) card.classList.add('is-expanded');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        if (btnText) btnText.textContent = 'Réduire';
        if (btnIcon) btnIcon.style.transform = 'rotate(180deg)';
        if (btn) btn.setAttribute('aria-expanded', 'true');

        // Lancer l'animation Pop-up Lottie sous le cercle
        if (!lottieManWorkingAnim) {
            initManWorkingLottie();
        } else {
            lottieManWorkingAnim.play();
        }
    } else {
        // Rétractation
        if (card) card.classList.remove('is-expanded');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        if (btnText) btnText.textContent = 'En savoir plus';
        if (btnIcon) btnIcon.style.transform = 'rotate(0deg)';
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
}






/**
 * 9. Animation d'Entrée des Cartes (slideBump depuis la gauche avec bousculade)
 */
function initSlideBumpObserver() {
    const universCards = document.querySelectorAll('.univers-card');
    const profilCard = document.getElementById('profilCard') || document.querySelector('.profil-card');
    const universSection = document.getElementById('univers');
    const profilSection = document.getElementById('profil');

    if (!universCards.length && !profilCard) return;

    // Préparer les cartes à l'animation
    universCards.forEach(c => c.classList.add('slide-bump-init'));
    if (profilCard) profilCard.classList.add('slide-bump-init');

    function playCards() {
        universCards.forEach(c => {
            c.classList.remove('slide-bump-init');
            c.classList.add('slide-bump-play');
            c.addEventListener('animationend', () => {
                c.classList.remove('slide-bump-play');
                c.style.opacity = '1';
                c.style.transform = '';
            }, { once: true });
        });
    }

    function playProfil() {
        if (profilCard) {
            profilCard.classList.remove('slide-bump-init');
            profilCard.classList.add('slide-bump-play');
            profilCard.addEventListener('animationend', () => {
                profilCard.classList.remove('slide-bump-play');
                profilCard.style.opacity = '1';
                profilCard.style.transform = '';
            }, { once: true });
        }
    }

    if (universSection) {
        const universObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playCards();
                    universObserver.unobserve(universSection);
                }
            });
        }, { threshold: 0.1 });
        universObserver.observe(universSection);

        // Déclenchement immédiat si déjà visible
        const rect = universSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            playCards();
        }
    } else {
        playCards();
    }

    if (profilSection && profilCard) {
        const profilObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playProfil();
                    profilObserver.unobserve(profilSection);
                }
            });
        }, { threshold: 0.1 });
        profilObserver.observe(profilSection);

        const rectP = profilSection.getBoundingClientRect();
        if (rectP.top < window.innerHeight && rectP.bottom > 0) {
            playProfil();
        }
    } else if (profilCard) {
        playProfil();
    }
}

/**
 * 10. Animation Lottie Défiler vers le bas (BoFd17MsdT.lottie)
 */
let lottieScrollAnim = null;

function initScrollHintLottie() {
    const container = document.getElementById('lottieScrollHint');
    if (!container || typeof lottie === 'undefined') return;

    function startScroll(data) {
        if (lottieScrollAnim) lottieScrollAnim.destroy();
        lottieScrollAnim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: data
        });
    }

    if (window.AKOULY_SCROLL_LOTTIE) {
        startScroll(window.AKOULY_SCROLL_LOTTIE);
    } else if (typeof lottie !== 'undefined') {
        fetch('animations/scroll-hint.json')
            .then(res => res.json())
            .then(data => startScroll(data))
            .catch(err => console.warn('Erreur Lottie Scroll Hint:', err));
    }
}


/**
 * 11. Moteur Physique 3D Tilt & Réfraction Lumineuse de la Photo de Profil
 * Perspective 3D, Inertie/Amortissement élastique (Spring Damping / Lerp) & Shader de reflet
 */
function initAvatar3DTiltPhysics() {
    const avatar = document.getElementById('profilAvatar3D');
    const glare = document.getElementById('avatarGlareShader');
    const card = document.getElementById('profilCard') || document.querySelector('.profil-card');
    if (!avatar) return;

    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let glareX = 35, glareY = 35;
    let targetGlareX = 35, targetGlareY = 35;
    let isHovering = false;
    let animFrameId = null;

    const maxAngle = 24; // Inclinaison maximale en degrés (±24°)
    const lerpSpeed = 0.085; // Facteur d'inertie et de fluidité élastique

    function updatePhysics() {
        // Interpolation linéaire (Spring Lerp)
        currentRotX += (targetRotX - currentRotX) * lerpSpeed;
        currentRotY += (targetRotY - currentRotY) * lerpSpeed;
        glareX += (targetGlareX - glareX) * lerpSpeed;
        glareY += (targetGlareY - glareY) * lerpSpeed;

        // Application de la transformation 3D
        avatar.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale(${isHovering ? 1.08 : 1})`;

        // Décalage dynamique de l'ombre portée pour simuler la profondeur
        const shadowX = (-currentRotY * 1.2).toFixed(1);
        const shadowY = (currentRotX * 1.2 + 8).toFixed(1);
        avatar.style.boxShadow = `${shadowX}px ${shadowY}px 28px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.35)`;

        // Mise à jour du shader de reflet spéculaire
        if (glare) {
            glare.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.55) 0%, rgba(6, 182, 212, 0.22) 35%, transparent 75%)`;
            glare.style.opacity = isHovering ? '1' : '0.75';
        }

        // Continuer l'animation si en mouvement ou en transition
        if (isHovering || Math.abs(targetRotX - currentRotX) > 0.05 || Math.abs(targetRotY - currentRotY) > 0.05) {
            animFrameId = requestAnimationFrame(updatePhysics);
        } else {
            animFrameId = null;
        }
    }

    function onPointerMove(e) {
        const rect = avatar.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Coordonnées normalisées (-1 à 1)
        const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 1.5)));
        const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 1.5)));

        targetRotY = normX * maxAngle;
        targetRotX = -normY * maxAngle;

        // Reflet opposé à l'angle pour simuler la lumière
        targetGlareX = 50 - normX * 40;
        targetGlareY = 50 - normY * 40;

        if (!animFrameId) {
            animFrameId = requestAnimationFrame(updatePhysics);
        }
    }

    // Zone d'interaction étendue sur la carte de profil
    const triggerZone = card || avatar;

    triggerZone.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!animFrameId) animFrameId = requestAnimationFrame(updatePhysics);
    });

    triggerZone.addEventListener('mousemove', (e) => {
        isHovering = true;
        onPointerMove(e);
    });

    triggerZone.addEventListener('mouseleave', () => {
        isHovering = false;
        targetRotX = 0;
        targetRotY = 0;
        targetGlareX = 35;
        targetGlareY = 35;
        if (!animFrameId) animFrameId = requestAnimationFrame(updatePhysics);
    });

    // Support tactile (Touch)
    avatar.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            isHovering = true;
            onPointerMove(e.touches[0]);
        }
    }, { passive: true });

    avatar.addEventListener('touchend', () => {
        isHovering = false;
        targetRotX = 0;
        targetRotY = 0;
        targetGlareX = 35;
        targetGlareY = 35;
        if (!animFrameId) animFrameId = requestAnimationFrame(updatePhysics);
    });
}

/**
 * 12. Surlignage Magique Animé (.underline--magical)
 * Dégradé rouge éclatant avec transition fluide au survol
 */
function initMagicalUnderlines() {
    const magicalUnderlines = Array.from(document.querySelectorAll('.underline--magical'));
    if (!magicalUnderlines.length) return;

    magicalUnderlines.forEach(el => {
        el.style.backgroundImage = 'linear-gradient(120deg, #ff416c 0%, #ff4b2b 100%)';
    });
}