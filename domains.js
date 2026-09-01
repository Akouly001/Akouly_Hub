/**
 * Akouly Ecosystem — Configuration & Data Store
 * Structure officielle à 7 pôles thématiques
 */

const DEFAULT_AKOULY_CONFIG = {
    profile: {
        name: "Aboua Junior KOUADJO",
        brand: "AKOULY",
        title: "Analyste Cybersécurité (WeCode 2026) · Master 1 Droit Privé · Créateur IA",
        location: "Abidjan, Côte d'Ivoire",
        email: "kouadjoabouajunior@gmail.com",
        github: "https://github.com/akouly001"
    },
    domains: [
        {
            id: "cyber",
            title: "Cybersécurité & Audit",
            icon: "fas fa-shield-halved",
            badge: "WECODE 2026",
            color: "var(--accent-cyber)",
            link: "cyber.html",
            description: "Analyste Cybersécurité avec double compétence en Droit Privé. Pentest PTES, Suricata IDS/IPS, NIST CSF 2.0 et EBIOS RM.",
            highlights: ["Google Cybersecurity Professional", "XSec Certificat de participation", "Detection Suricata & Pentest PTES"],
            stats: "6+ Labs & Rapports"
        },
        {
            id: "gaming",
            title: "Akouly Gaming",
            icon: "fas fa-gamepad",
            badge: "HARDWARE & PC",
            color: "var(--accent-gaming)",
            link: "gaming.html",
            description: "PC Gaming sur-mesure, configurateur PC, choix de composants, montage & upgrade et reviews hardware.",
            highlights: ["Montage PC Sur-Mesure", "Configurateur & Optimisation", "Reviews Motospeed & Casque G19BT"],
            stats: "Hardware & Setup"
        },
        {
            id: "apps",
            title: "Apps & Dev",
            icon: "fas fa-code",
            badge: "MOBILE, JEUX & IA",
            color: "var(--accent-dev)",
            link: "apps.html",
            description: "Conception d'applications mobiles, jeux et solutions logicielles : App Too, Jeu multijoueur Contrix et création assistée par l'IA.",
            highlights: ["Jeu Multijoueur Contrix", "App Too (APK disponible)", "Vivi IA (En cours)"],
            stats: "Apps, Jeux & IA"
        },
        {
            id: "business",
            title: "Akouly Business",
            icon: "fas fa-briefcase",
            badge: "SERVICES & IT",
            color: "var(--accent-biz)",
            link: "business.html",
            description: "Prestations IT à Abidjan : Maintenance informatique (Akouly Market), sourcing de composants, création graphique et demande de devis.",
            highlights: ["Maintenance & Dépannage PC", "Sourcing de Composants", "Demande de devis en ligne sous 24h"],
            stats: "Offres & Services"
        },
        {
            id: "lab",
            title: "Akouly Créations",
            icon: "fas fa-scissors",
            badge: "ATELIER & CRÉATION",
            color: "var(--accent-lab)",
            link: "creations.html",
            description: "Atelier de création manuelle : Art de l'origami, modélisation 3D pour ferronnier, photographie mobile et aménagement workspace.",
            highlights: ["Art de l'Origami modulaire", "Modélisation 3D Support Casque", "Photographie Mobile"],
            stats: "6 Catégories DIY"
        }
    ],
    projects: []
};

// Initialisation du stockage local localStorage
let AKOULY_CONFIG = JSON.parse(localStorage.getItem('AKOULY_CONFIG_STORAGE')) || DEFAULT_AKOULY_CONFIG;

function saveAkoulyConfig(config) {
    AKOULY_CONFIG = config;
    localStorage.setItem('AKOULY_CONFIG_STORAGE', JSON.stringify(config));
}
