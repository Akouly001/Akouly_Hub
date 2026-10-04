/**
 * ==============================================================================
 * PROJET 1 : AKOULY BOUTIQUE & ESPACE ADMIN (Code.gs)
 * ==============================================================================
 * 
 * Ce script est dédié exclusivement à :
 * 1. La Boutique Akouly (boutique.html) : commandes directes, code promo, catalogue
 * 2. L'Espace Administrateur (admin.html / Forbidden.html) : gestion commandes, articles & promos
 * 3. La Newsletter : enregistrement des abonnés
 * 
 * ID FEUILLE GOOGLE SHEETS : 14p01xmFOzG6qXOjx8g2vZZJshHl22JpTArorHt9m4l4
 * MOT DE PASSE ADMIN       : @karaba
 */

const BOUTIQUE_SHEET_ID = "14p01xmFOzG6qXOjx8g2vZZJshHl22JpTArorHt9m4l4";
const ADMIN_EMAIL = "kouadjoabouajunior@gmail.com";
const ADMIN_SECRET_KEY = "@karaba";

const SHEETS = {
  COMMANDES: "Commandes",
  PRODUITS: "Produits",
  PROMOS: "PromoCodes",
  NEWSLETTER: "Newsletter"
};

/* ==========================================================================
   HELPER : OUVERTURE DU SPREADSHEET
   ========================================================================== */
function getSpreadsheet() {
  const raw = String(BOUTIQUE_SHEET_ID).trim();
  const match = raw.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : raw;
  return SpreadsheetApp.openById(id);
}

/* ==========================================================================
   ROUTEUR GET (LECTURE PUBLIQUE & ADMIN)
   ========================================================================== */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || "getProduits";

    // 1. Catalogue public des produits en stock
    if (action === "getProduits") {
      return reponseJson(getProduitsPublic());
    }

    // 2. Vérification d'un code promo au panier
    if (action === "verifierPromo") {
      const code = (params.code || "").trim().toUpperCase();
      const subtotal = Number(params.subtotal || 0);
      return reponseJson(verifierCodePromo(code, subtotal));
    }

    // 3. Données du Dashboard Admin (protégé par mot de passe)
    if (action === "getAdminData") {
      const key = params.key || "";
      if (key !== ADMIN_SECRET_KEY) {
        return reponseJson({ status: "error", message: "Accès refusé : clé admin invalide" });
      }
      return reponseJson(getAdminDashboardData());
    }

    // 4. Envoi du code OTP Admin par email (2FA)
    if (action === "envoyerOtpAdmin") {
      const key = params.key || params.adminKey || "";
      if (key !== ADMIN_SECRET_KEY) {
        return reponseJson({ status: "error", message: "Accès refusé : clé admin invalide" });
      }
      return envoyerOtpAdmin(params.otp || params.otpCode);
    }

    return reponseJson({ status: "error", message: "Action GET inconnue" });
  } catch (err) {
    return reponseJson({ status: "error", message: err.toString() });
  }
}

/* ==========================================================================
   ROUTEUR POST (COMMANDES, NEWSLETTER & ACTIONS ADMIN)
   ========================================================================== */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reponseJson({ status: "error", message: "Aucune donnée reçue" });
    }

    const data = JSON.parse(e.postData.contents);

    // 1. Commande passée par un client depuis la boutique
    if (data.source === "boutique_order" || data.type === "boutique") {
      return traiterCommandeBoutique(data);
    }

    // 2. Inscription Newsletter
    if (data.source === "newsletter" || data.type === "newsletter" || data.action === "inscrireNewsletter") {
      return traiterInscriptionNewsletter(data);
    }

    // 3. Actions réservées à l'Espace Admin (sécurisées par clé @karaba)
    if (data.adminKey) {
      if (data.adminKey !== ADMIN_SECRET_KEY) {
        return reponseJson({ status: "error", message: "Accès non autorisé : clé admin invalide" });
      }

      switch (data.action) {
        case "ajouterProduit":
          return ajouterProduit(data.produit);
        case "modifierProduit":
          return modifierProduit(data.produit);
        case "supprimerProduit":
          return supprimerProduit(data.id);
        case "toggleDispoProduit":
          return toggleDispoProduit(data.id, data.disponible);
        case "ajouterPromo":
          return ajouterPromo(data.promo);
        case "supprimerPromo":
          return supprimerPromo(data.code);
        case "togglePromo":
          return togglePromo(data.code, data.actif);
        case "modifierStatutCommande":
          return modifierStatutCommande(data.rowIndex, data.statut);
        case "envoyerOtpAdmin":
          return envoyerOtpAdmin(data.otpCode);
        default:
          return reponseJson({ status: "error", message: "Action admin inconnue" });
      }
    }

    return reponseJson({ status: "error", message: "Action ou source non reconnue" });

  } catch (err) {
    return reponseJson({ status: "error", message: err.toString() });
  }
}

/* ==========================================================================
   1. GESTION DES COMMANDES BOUTIQUE (FEUILLE "Commandes")
   ========================================================================== */
function getCommandesSheet() {
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEETS.COMMANDES);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.COMMANDES);
    const headers = [
      "Date & Heure", "Nom du Client", "Téléphone", "Commune", "Lieu / Repère",
      "Articles Commandés", "Sous-Total (FCFA)", "Frais Livraison (FCFA)",
      "Réduction Promo (FCFA)", "Total Net (FCFA)", "Code Promo", "Délai Estimé", "Statut"
    ];
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#10b981").setFontColor("#ffffff");
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 140);
    sh.setColumnWidth(2, 160);
    sh.setColumnWidth(3, 120);
    sh.setColumnWidth(4, 120);
    sh.setColumnWidth(5, 180);
    sh.setColumnWidth(6, 320);
    sh.setColumnWidth(7, 120);
    sh.setColumnWidth(8, 120);
    sh.setColumnWidth(9, 120);
    sh.setColumnWidth(10, 130);
    sh.setColumnWidth(11, 110);
    sh.setColumnWidth(12, 160);
    sh.setColumnWidth(13, 120);
  }
  return sh;
}

function traiterCommandeBoutique(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (!data.name || !data.phone) {
      return reponseJson({ status: "error", message: "Nom et téléphone obligatoires" });
    }

    const sh = getCommandesSheet();
    const sousTotal = Number(data.subtotal) || 0;
    const livraison = Number(data.deliveryFee) || 0;
    let reduction = Number(data.discount) || 0;
    let codePromo = (data.promoCode || "").trim().toUpperCase();

    // Validation & décompte automatique du code promo si utilisé
    if (codePromo) {
      const verif = verifierCodePromo(codePromo, sousTotal);
      if (verif.valide) {
        reduction = verif.montantReduction;
        incrementerUsagePromo(codePromo);
      } else {
        codePromo = codePromo + " (Invalide)";
        reduction = 0;
      }
    }

    const totalNet = Number(data.grandTotal) || Math.max(0, sousTotal + livraison - reduction);
    const delai = data.deliveryDate || "Livraison le lendemain";
    const dateStr = Utilities.formatDate(new Date(), "GMT+0", "dd/MM/yyyy HH:mm");

    sh.appendRow([
      dateStr,
      nettoyer(data.name),
      nettoyer(data.phone),
      nettoyer(data.commune || "Non précisée"),
      nettoyer(data.address || "Non précisé"),
      nettoyer(data.itemsSummary || "-"),
      sousTotal,
      livraison,
      reduction,
      totalNet,
      nettoyer(codePromo || "Aucun"),
      nettoyer(delai),
      "En attente"
    ]);

    // Notification Email Admin
    try {
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        subject: `🛒 NOUVELLE COMMANDE BOUTIQUE - ${data.name} (${data.commune || "?"} - ${totalNet} FCFA)`,
        body: `Nouvelle commande enregistrée dans la Boutique Akouly !\n\n` +
              `Client : ${data.name}\n` +
              `Téléphone : ${data.phone}\n` +
              `Commune : ${data.commune || "Non précisée"}\n` +
              `Lieu / Repère : ${data.address || "Non précisé"}\n` +
              `Livraison : ${delai}\n\n` +
              `Articles :\n${data.itemsSummary || "-"}\n\n` +
              `Sous-total : ${sousTotal} FCFA\n` +
              `Frais de livraison : ${livraison} FCFA\n` +
              `Réduction Code Promo (${codePromo || "Aucun"}) : -${reduction} FCFA\n` +
              `TOTAL NET : ${totalNet} FCFA\n\n` +
              `Tableau : https://docs.google.com/spreadsheets/d/${BOUTIQUE_SHEET_ID}/edit`
      });
    } catch (mailErr) {
      console.warn("Erreur notification commande boutique:", mailErr);
    }

    return reponseJson({ status: "ok", message: "Commande enregistrée avec succès" });

  } catch (err) {
    return reponseJson({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/* ==========================================================================
   2. GESTION DES INSCRIPTIONS NEWSLETTER (FEUILLE "Newsletter")
   ========================================================================== */
function traiterInscriptionNewsletter(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (!data.email) {
      return reponseJson({ status: "error", message: "Email obligatoire" });
    }
    const ss = getSpreadsheet();
    let sh = ss.getSheetByName(SHEETS.NEWSLETTER);
    if (!sh) {
      sh = ss.insertSheet(SHEETS.NEWSLETTER);
      sh.appendRow(["Date & Heure", "Pseudo", "Email"]);
      sh.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#10b981").setFontColor("#ffffff");
      sh.setFrozenRows(1);
      sh.setColumnWidth(1, 160);
      sh.setColumnWidth(2, 180);
      sh.setColumnWidth(3, 260);
    }

    const dateStr = Utilities.formatDate(new Date(), "GMT+0", "dd/MM/yyyy HH:mm");
    sh.appendRow([
      dateStr,
      nettoyer(data.pseudo || "Anonyme"),
      nettoyer(data.email)
    ]);

    try {
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        subject: `📬 NOUVELLE INSCRIPTION NEWSLETTER - ${data.pseudo || "Visiteur"} (${data.email})`,
        body: `Nouvelle inscription à la Newsletter Akouly Boutique !\n\n` +
              `Pseudo : ${data.pseudo || "Non précisé"}\n` +
              `Email : ${data.email}\n` +
              `Date : ${dateStr}\n\n` +
              `Tableau : https://docs.google.com/spreadsheets/d/${BOUTIQUE_SHEET_ID}/edit`
      });
    } catch (mailErr) {
      console.warn("Notice notification newsletter:", mailErr);
    }

    return reponseJson({ status: "ok", message: "Inscription newsletter enregistrée" });
  } catch (err) {
    return reponseJson({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/* ==========================================================================
   3. GESTION DES CODES PROMO (FEUILLE "PromoCodes")
   ========================================================================== */
function getPromosSheet() {
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEETS.PROMOS);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.PROMOS);
    const headers = [
      "Code", "Réduction (%)", "Catégorie Cible", "Date Début", "Date Fin",
      "Quantité Max", "Quantité Utilisée", "Actif (O/N)", "Créé le"
    ];
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#eab308").setFontColor("#000000");
    sh.setFrozenRows(1);
  }
  return sh;
}

function verifierCodePromo(code, subtotal) {
  if (!code) return { valide: false, message: "Code requis" };
  const sh = getPromosSheet();
  const data = sh.getDataRange().getValues();
  if (data.length <= 1) return { valide: false, message: "Code introuvable" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const cCode = String(row[0] || "").trim().toUpperCase();
    if (cCode === code) {
      const reductionPct = Number(row[1]) || 0;
      const categorie = String(row[2] || "all");
      const dateDebut = row[3] ? new Date(row[3]) : null;
      const dateFin = row[4] ? new Date(row[4]) : null;
      const qteMax = Number(row[5]) || 0;
      const qteUtilisee = Number(row[6]) || 0;
      const actif = String(row[7]).toUpperCase() === "O" || row[7] === true || row[7] === "OUI";

      if (!actif) return { valide: false, message: "Ce code promo est inactif." };
      if (dateDebut && today < dateDebut) return { valide: false, message: "Ce code promo n'est pas encore actif." };
      if (dateFin && today > dateFin) return { valide: false, message: "Ce code promo a expiré." };
      if (qteMax > 0 && qteUtilisee >= qteMax) return { valide: false, message: "Ce code promo a atteint son quota d'utilisations." };

      const montantReduction = Math.round((subtotal * reductionPct) / 100);
      return {
        valide: true,
        valid: true,
        status: "ok",
        code: cCode,
        reductionPourcentage: reductionPct,
        discountPercent: reductionPct,
        reduction: reductionPct,
        categorie: categorie,
        montantReduction: montantReduction,
        discountAmount: montantReduction,
        discount: montantReduction,
        nouveauTotal: Math.max(0, subtotal - montantReduction),
        grandTotal: Math.max(0, subtotal - montantReduction),
        message: `Code appliqué : -${reductionPct}% de réduction !`
      };
    }
  }

  return { valide: false, message: "Code promo inexistant ou erroné." };
}

function incrementerUsagePromo(code) {
  const sh = getPromosSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === code) {
      const current = Number(data[i][6]) || 0;
      sh.getRange(i + 1, 7).setValue(current + 1);
      break;
    }
  }
}

function ajouterPromo(promo) {
  if (!promo || !promo.code) return reponseJson({ status: "error", message: "Code promo obligatoire" });
  const sh = getPromosSheet();
  const code = String(promo.code).trim().toUpperCase();

  // Vérifier doublon
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === code) {
      // Mise à jour
      sh.getRange(i + 1, 2).setValue(Number(promo.reduction) || 10);
      sh.getRange(i + 1, 3).setValue(promo.categorie || "all");
      sh.getRange(i + 1, 4).setValue(promo.dateDebut || "");
      sh.getRange(i + 1, 5).setValue(promo.dateFin || "");
      sh.getRange(i + 1, 6).setValue(Number(promo.qteMax) || 0);
      sh.getRange(i + 1, 8).setValue(promo.actif ? "O" : "N");
      return reponseJson({ status: "ok", message: "Code promo mis à jour" });
    }
  }

  sh.appendRow([
    code,
    Number(promo.reduction) || 10,
    promo.categorie || "all",
    promo.dateDebut || "",
    promo.dateFin || "",
    Number(promo.qteMax) || 0,
    0,
    promo.actif ? "O" : "N",
    new Date()
  ]);

  return reponseJson({ status: "ok", message: "Code promo créé avec succès" });
}

function supprimerPromo(code) {
  const sh = getPromosSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === String(code).trim().toUpperCase()) {
      sh.deleteRow(i + 1);
      return reponseJson({ status: "ok", message: "Code promo supprimé" });
    }
  }
  return reponseJson({ status: "error", message: "Code promo non trouvé" });
}

function togglePromo(code, actif) {
  const sh = getPromosSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === String(code).trim().toUpperCase()) {
      sh.getRange(i + 1, 8).setValue(actif ? "O" : "N");
      return reponseJson({ status: "ok", message: "Statut code promo modifié" });
    }
  }
  return reponseJson({ status: "error", message: "Code promo non trouvé" });
}

/* ==========================================================================
   4. GESTION DES PRODUITS (FEUILLE "Produits")
   ========================================================================== */
function getProduitsSheet() {
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEETS.PRODUITS);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.PRODUITS);
    const headers = [
      "ID", "Nom", "Catégorie", "Prix Base (FCFA)", "Description / Specs",
      "Image URL", "Variantes (JSON)", "Icône", "Couleur Accent", "Disponible (O/N)"
    ];
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#06b6d4").setFontColor("#ffffff");
    sh.setFrozenRows(1);
  }
  return sh;
}

function getProduitsPublic() {
  const sh = getProduitsSheet();
  const data = sh.getDataRange().getValues();
  if (data.length <= 1) return { status: "ok", count: 0, produits: [] };

  const list = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dispo = String(row[9]).toUpperCase() === "O" || row[9] === true || row[9] === "OUI";
    if (dispo) {
      let variants = [];
      try {
        variants = row[6] ? JSON.parse(row[6]) : [];
      } catch (e) {
        variants = [];
      }

      list.push({
        id: String(row[0]),
        name: String(row[1]),
        category: String(row[2]),
        price: Number(row[3]) || 0,
        specs: String(row[4] || "").split("\n").filter(Boolean),
        image: String(row[5] || ""),
        variants: variants,
        icon: String(row[7] || "fa-box"),
        accentColor: String(row[8] || "var(--bq-primary)")
      });
    }
  }
  return { status: "ok", count: list.length, produits: list };
}

function ajouterProduit(p) {
  if (!p || !p.id || !p.name) return reponseJson({ status: "error", message: "ID et Nom du produit obligatoires" });
  const sh = getProduitsSheet();
  const data = sh.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(p.id).trim()) {
      return modifierProduit(p);
    }
  }

  sh.appendRow([
    p.id,
    p.name,
    p.category || "peripheriques",
    Number(p.price) || 0,
    Array.isArray(p.specs) ? p.specs.join("\n") : (p.specs || ""),
    p.image || "",
    typeof p.variants === "string" ? p.variants : JSON.stringify(p.variants || []),
    p.icon || "fa-box",
    p.accentColor || "var(--bq-primary)",
    "O"
  ]);

  return reponseJson({ status: "ok", message: "Produit ajouté" });
}

function modifierProduit(p) {
  const sh = getProduitsSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(p.id).trim()) {
      sh.getRange(i + 1, 2).setValue(p.name);
      sh.getRange(i + 1, 3).setValue(p.category);
      sh.getRange(i + 1, 4).setValue(Number(p.price) || 0);
      sh.getRange(i + 1, 5).setValue(Array.isArray(p.specs) ? p.specs.join("\n") : (p.specs || ""));
      sh.getRange(i + 1, 6).setValue(p.image || "");
      sh.getRange(i + 1, 7).setValue(typeof p.variants === "string" ? p.variants : JSON.stringify(p.variants || []));
      sh.getRange(i + 1, 8).setValue(p.icon || "fa-box");
      sh.getRange(i + 1, 9).setValue(p.accentColor || "var(--bq-primary)");
      return reponseJson({ status: "ok", message: "Produit mis à jour" });
    }
  }
  return reponseJson({ status: "error", message: "Produit non trouvé" });
}

function supprimerProduit(id) {
  const sh = getProduitsSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(id).trim()) {
      sh.deleteRow(i + 1);
      return reponseJson({ status: "ok", message: "Produit supprimé" });
    }
  }
  return reponseJson({ status: "error", message: "Produit non trouvé" });
}

function toggleDispoProduit(id, dispo) {
  const sh = getProduitsSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(id).trim()) {
      sh.getRange(i + 1, 10).setValue(dispo ? "O" : "N");
      return reponseJson({ status: "ok", message: "Disponibilité mise à jour" });
    }
  }
  return reponseJson({ status: "error", message: "Produit non trouvé" });
}

function modifierStatutCommande(rowIndex, statut) {
  const sh = getCommandesSheet();
  sh.getRange(rowIndex, 13).setValue(statut);
  return reponseJson({ status: "ok", message: "Statut de commande modifié" });
}

/* ==========================================================================
   5. DASHBOARD ADMIN GLOBAL (KPIs, COMMANDES, PRODUITS, PROMOS)
   ========================================================================== */
function getAdminDashboardData() {
  const ss = getSpreadsheet();
  const shCmd = getCommandesSheet();
  const shProd = getProduitsSheet();
  const shProm = getPromosSheet();

  const dataCmd = shCmd.getDataRange().getValues();
  const dataProd = shProd.getDataRange().getValues();
  const dataProm = shProm.getDataRange().getValues();

  const produits = [];
  for (let i = 1; i < dataProd.length; i++) {
    const r = dataProd[i];
    let vars = [];
    try { vars = r[6] ? JSON.parse(r[6]) : []; } catch(e){}
    produits.push({
      id: String(r[0]),
      name: String(r[1]),
      category: String(r[2]),
      price: Number(r[3]) || 0,
      specs: String(r[4] || ""),
      image: String(r[5] || ""),
      variants: vars,
      icon: String(r[7] || "fa-box"),
      accentColor: String(r[8] || "var(--bq-primary)"),
      disponible: String(r[9]).toUpperCase() === "O" || r[9] === true || r[9] === "OUI"
    });
  }

  const promos = [];
  for (let i = 1; i < dataProm.length; i++) {
    const r = dataProm[i];
    promos.push({
      code: String(r[0]),
      reduction: Number(r[1]) || 0,
      categorie: String(r[2] || "all"),
      dateDebut: r[3] ? Utilities.formatDate(new Date(r[3]), "GMT+0", "yyyy-MM-dd") : "",
      dateFin: r[4] ? Utilities.formatDate(new Date(r[4]), "GMT+0", "yyyy-MM-dd") : "",
      qteMax: Number(r[5]) || 0,
      qteUtilisee: Number(r[6]) || 0,
      actif: String(r[7]).toUpperCase() === "O" || r[7] === true || r[7] === "OUI"
    });
  }

  const commandes = [];
  let totalRevenu = 0;
  for (let i = 1; i < dataCmd.length; i++) {
    const r = dataCmd[i];
    const net = Number(r[9]) || 0;
    const statut = String(r[12] || "En attente");
    if (statut !== "Annulée") totalRevenu += net;

    commandes.push({
      rowIndex: i + 1,
      date: r[0] ? (r[0] instanceof Date ? Utilities.formatDate(r[0], "GMT+0", "dd/MM/yyyy HH:mm") : String(r[0])) : "-",
      name: String(r[1] || ""),
      phone: String(r[2] || ""),
      commune: String(r[3] || ""),
      address: String(r[4] || ""),
      items: String(r[5] || ""),
      subtotal: Number(r[6]) || 0,
      deliveryFee: Number(r[7]) || 0,
      discount: Number(r[8]) || 0,
      grandTotal: net,
      promoCode: String(r[10] || "Aucun"),
      delai: String(r[11] || ""),
      statut: statut
    });
  }

  return {
    status: "ok",
    stats: {
      totalCommandes: commandes.length,
      totalRevenu: totalRevenu,
      totalProduits: produits.length,
      produitsEnLigne: produits.filter(p => p.disponible).length,
      totalPromos: promos.length
    },
    produits: produits,
    promos: promos,
    commandes: commandes
  };
}

/* ==========================================================================
   UTILITAIRES
   ========================================================================== */
function reponseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function nettoyer(v) {
  const s = String(v == null ? "" : v).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/* ==========================================================================
   4. ENVOI DU CODE OTP DE SÉCURITÉ ADMINISTRATEUR (2FA)
   ========================================================================== */
function envoyerOtpAdmin(otpCode) {
  try {
    if (!otpCode) {
      return reponseJson({ status: "error", message: "Code OTP manquant" });
    }
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: `🔑 Code OTP : ${otpCode} — Espace Admin Akouly`,
      body: `Bonjour Administrateur,\n\n` +
            `Voici votre code d'accès temporaire de sécurité (2FA) pour déverrouiller le portail d'administration Akouly :\n\n` +
            `👉 CODE OTP : ${otpCode}\n\n` +
            `Ce code est valable pendant 10 minutes.\n` +
            `Si vous n'êtes pas à l'origine de cette tentative de connexion, ignorez cet e-mail.\n\n` +
            `Sécurité & Administration Akouly\n` +
            `Abidjan, Côte d'Ivoire`
    });
    return reponseJson({ status: "ok", message: "OTP envoyé par email à " + ADMIN_EMAIL });
  } catch (err) {
    return reponseJson({ status: "error", message: "Erreur envoi OTP: " + err.toString() });
  }
}

/* ==========================================================================
   INITIALISATION MANUELLE (À exécuter une fois dans l'éditeur Google Apps Script)
   ========================================================================== */
function initialiserToutesLesFeuilles() {
  getCommandesSheet();
  getProduitsSheet();
  getPromosSheet();
  const ss = getSpreadsheet();
  if (!ss.getSheetByName(SHEETS.NEWSLETTER)) {
    const sh = ss.insertSheet(SHEETS.NEWSLETTER);
    sh.appendRow(["Date & Heure", "Pseudo", "Email"]);
    sh.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#10b981").setFontColor("#ffffff");
    sh.setFrozenRows(1);
  }
  Logger.log("✅ Feuilles Boutique initialisées avec succès !");
}
