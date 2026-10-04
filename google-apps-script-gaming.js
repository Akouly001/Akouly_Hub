/**
 * ==============================================================================
 * PROJET 2 : AKOULY GAMING — CONFIGURATIONS PC SUR-MESURE (Code.gs)
 * ==============================================================================
 * 
 * Ce script est dédié exclusivement à :
 * 1. La réception des commandes de PC Gamer sur-mesure (gaming.html / processus-achat.html)
 * 2. La génération automatique du Devis officiel en PDF
 * 3. La génération du document officiel « Règles de Paiement — Akouly Gaming » en PDF
 * 4. La sauvegarde automatique des 2 PDF dans votre dossier Google Drive dédié
 * 5. La notification par email à AkoulyMarket (kouadjoabouajunior@gmail.com)
 * 6. L'envoi automatique au CLIENT de son Devis PDF + Document des Règles de Paiement
 * 
 * ID DOSSIER GOOGLE DRIVE : 15xH2h7VLTSk3IfTMdEi-j74Acw1XC-cq
 */

const DRIVE_FOLDER_ID = "15xH2h7VLTSk3IfTMdEi-j74Acw1XC-cq";
const ADMIN_EMAIL = "kouadjoabouajunior@gmail.com";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reponseJson({ status: "error", message: "Aucune donnée reçue" });
    }

    const data = JSON.parse(e.postData.contents);

    // SÉCURITÉ : Vérifie qu'il s'agit bien d'une configuration PC réelle avec un nom et un récapitulatif
    if (!data.orderBody || !data.name || String(data.orderBody).trim().length < 5) {
      return reponseJson({ 
        status: "error", 
        message: "Données de configuration PC incomplètes. Aucun devis généré." 
      });
    }

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const now = new Date();
    const dateFormatted = Utilities.formatDate(now, "GMT+0", "dd/MM/yyyy 'à' HH:mm");
    const fileDate = Utilities.formatDate(now, "GMT+0", "yyyy-MM-dd_HHmm");
    const safeClientName = String(data.name || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");

    // ==========================================================================
    // 1. MODÈLE HTML DU DEVIS OFFICIEL (DOCUMENT 1)
    // ==========================================================================
    const devisHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <style>
          @page { margin: 15mm; size: A4 portrait; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.45; font-size: 11px; margin: 0; padding: 0; }
          .header-table { width: 100%; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 15px; }
          .brand { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px; }
          .brand span { color: #eab308; }
          .subbrand { font-size: 10px; color: #64748b; margin-top: 2px; }
          .badge-devis { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 12px; text-align: right; }
          .section-title { font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin: 14px 0 6px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
          .client-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }
          .client-table td { padding: 6px 10px; font-size: 11px; border-bottom: 1px solid #edf2f7; }
          .client-table td.label { font-weight: 700; color: #475569; width: 30%; }
          .order-pre { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 10px 12px; font-family: 'Courier New', Courier, monospace; font-size: 10px; line-height: 1.4; color: #0f172a; white-space: pre-wrap; margin: 0; }
          .clause-box { margin-top: 14px; background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 4px; padding: 8px 12px; font-size: 9.5px; color: #1e3a8a; line-height: 1.35; }
          .footer { margin-top: 20px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td>
              <div class="brand">AKOULY <span>GAMING</span></div>
              <div class="subbrand">Conception PC Gamer Sur-Mesure & Hardware — Abidjan, Côte d'Ivoire</div>
            </td>
            <td style="text-align: right;">
              <div class="badge-devis">
                <div style="font-size: 12px; font-weight: 800; color: #0f172a;">DEVIS OFFICIEL & COMMANDE</div>
                <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">Émis le : ${dateFormatted}</div>
              </div>
            </td>
          </tr>
        </table>

        <div class="section-title">Informations du Client & Livraison</div>
        <table class="client-table">
          <tr>
            <td class="label">Nom complet du client :</td>
            <td><strong>${data.name || "Client"}</strong></td>
          </tr>
          <tr>
            <td class="label">Numéro WhatsApp / Téléphone :</td>
            <td><strong>${data.phone || "Non renseigné"}</strong></td>
          </tr>
          <tr>
            <td class="label">Adresse Email :</td>
            <td>${data.email || "Non renseigné"}</td>
          </tr>
          <tr>
            <td class="label">Adresse de livraison (Abidjan) :</td>
            <td>${data.address || "Abidjan (Livraison Gratuite)"}</td>
          </tr>
        </table>

        <div class="section-title">Détail Matériel & Échéancier Financier</div>
        <pre class="order-pre">${data.orderBody}</pre>

        <div class="clause-box">
          <strong>Clause contractuelle de conformité matérielle :</strong><br>
          En raison des évolutions du marché (stocks mondiaux, disponibilité des modèles chez nos fournisseurs partenaires), les visuels des produits ne sont pas contractuels. Seules les spécifications techniques exactes (modèle de puce, fréquences, socket, capacités en Go/To, puissances en Watts) sont rigoureusement respectées. En cas d'ajustement nécessaire, vous en serez informé au préalable par écrit.
        </div>

        <div class="footer">
          Akouly Gaming — Abidjan, Côte d'Ivoire — Service Client : kouadjoabouajunior@gmail.com — https://akouly.netlify.app/gaming.html
        </div>
      </body>
      </html>
    `;

    // ==========================================================================
    // 2. MODÈLE HTML DES RÈGLES DE PAIEMENT (DOCUMENT 2)
    // ==========================================================================
    const reglesHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <style>
          @page { margin: 15mm; size: A4 portrait; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.45; font-size: 10.5px; margin: 0; padding: 0; }
          .header-table { width: 100%; border-bottom: 2px solid #eab308; padding-bottom: 10px; margin-bottom: 12px; }
          .brand { font-size: 18px; font-weight: 800; color: #0f172a; }
          .brand span { color: #eab308; }
          .doc-title { font-size: 15px; font-weight: 800; color: #0f172a; margin: 10px 0 4px 0; }
          .doc-intro { font-size: 10.5px; color: #64748b; margin-bottom: 12px; font-style: italic; }
          h2 { font-size: 11.5px; font-weight: 700; color: #0f172a; margin: 12px 0 6px 0; border-left: 3px solid #eab308; padding-left: 6px; }
          table.data-table { width: 100%; border-collapse: collapse; margin: 6px 0 10px 0; }
          table.data-table th { background: #0f172a; color: #ffffff; text-align: left; padding: 6px 8px; font-size: 10px; font-weight: 600; }
          table.data-table td { padding: 6px 8px; font-size: 10px; border-bottom: 1px solid #e2e8f0; }
          table.data-table tr:nth-child(even) { background: #f8fafc; }
          ul { margin: 4px 0 8px 16px; padding: 0; }
          li { margin-bottom: 3px; }
          .quote-box { background: #f8fafc; border-left: 3px solid #0f172a; padding: 8px 12px; font-style: italic; font-weight: 600; color: #334155; margin: 10px 0; }
          .footer { margin-top: 18px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 6px; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td><div class="brand">AKOULY <span>GAMING</span></div></td>
            <td style="text-align: right; font-size: 10px; color: #64748b;">RÈGLEMENT OFFICIEL DES VENTES</td>
          </tr>
        </table>

        <div class="doc-title">Règles de Paiement — Akouly Gaming</div>
        <div class="doc-intro">
          Ce document définit clairement et sans ambiguïté les modalités financières, le calendrier de paiement, les délais de tolérance et les conditions d'annulation pour toute commande sur Akouly Gaming.
        </div>

        <h2>1. Le calendrier de paiement (Échelonnement en 4 fois sur 3 mois)</h2>
        <p>Le paiement s'effectue en <strong>4 versements échelonnés sur 3 mois</strong> :</p>
        <table class="data-table">
          <thead>
            <tr>
              <th>Versement</th>
              <th>Échéance</th>
              <th>Objet du versement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1er versement</strong></td>
              <td>Jour 0 (à la commande)</td>
              <td>Paiement du Pack de base (Boîtier + Alimentation + Carte Mère)</td>
            </tr>
            <tr>
              <td><strong>2e versement</strong></td>
              <td>Mois 1 (J+30)</td>
              <td>1ère mensualité du reste des composants</td>
            </tr>
            <tr>
              <td><strong>3e versement</strong></td>
              <td>Mois 2 (J+60)</td>
              <td>2ème mensualité du reste des composants</td>
            </tr>
            <tr>
              <td><strong>4e versement</strong></td>
              <td>Mois 3 (J+90)</td>
              <td>Dernière mensualité & solde final</td>
            </tr>
          </tbody>
        </table>

        <h2>2. Délais de paiement et retard</h2>
        <ul>
          <li>Chaque mensualité est due à la date anniversaire de la commande (ex : commande le 5 janvier &rarr; mensualités les 5 février, 5 mars, 5 avril).</li>
          <li><strong>Délai de tolérance :</strong> Un retard allant jusqu'à <strong>10 jours</strong> après l'échéance est toléré, à condition que le client prévienne notre équipe par WhatsApp ou email.</li>
          <li><strong>Au-delà de 10 jours de retard sans nouvelle</strong>, la commande est considérée en défaut de paiement et les règles d'annulation de la section 4 s'appliquent.</li>
        </ul>

        <h2>3. Modalités et preuve de versement</h2>
        <ul>
          <li>Les paiements s'effectuent par <strong>Wave, Orange Money, MTN MoMo ou virement bancaire</strong> vers les coordonnées officielles communiquées par Akouly Gaming.</li>
          <li>Une capture d'écran ou référence de transaction doit être envoyée par WhatsApp à notre service client pour validation immédiate.</li>
          <li>Un <strong>reçu officiel de versement</strong> est retourné au client sous 24h ouvrées.</li>
        </ul>

        <h2>4. Annulation et conditions de remboursement</h2>
        <p>Le client peut demander l'annulation de sa commande avant la livraison finale selon les conditions suivantes :</p>
        <ul>
          <li><strong>Le 1er versement (Pack de base) est non remboursable :</strong> ces pièces ont été achetées, réservées et préparées spécialement pour votre configuration.</li>
          <li><strong>Les mensualités suivantes (Mois 1, 2, 3) sont remboursables à 70%</strong> du montant total des mensualités déjà versées. Les 30% restants couvrent les frais de gestion logistique et de restockage fournisseur.</li>
          <li>Le remboursement est effectué sous un délai de <strong>7 jours ouvrés</strong> via le moyen de paiement de votre choix (Wave/Orange/MTN).</li>
        </ul>

        <h2>5. La garantie</h2>
        <ul>
          <li><strong>Garantie de 6 mois</strong> à compter de la date de livraison du boîtier.</li>
          <li>Des <strong>tests et photos</strong> sont réalisés comme preuve de parfait état de fonctionnement avant la remise en main propre.</li>
        </ul>

        <h2>6. Résumé en une phrase</h2>
        <div class="quote-box">
          « Vous payez le pack au départ, puis le reste des pièces en 3 fois sur 3 mois, avec 10 jours de tolérance en cas de retard, et un remboursement partiel possible si vous annulez avant la fin. »
        </div>

        <div class="footer">
          Akouly Gaming — Abidjan, Côte d'Ivoire — Email : kouadjoabouajunior@gmail.com — https://akouly.netlify.app/gaming.html
        </div>
      </body>
      </html>
    `;

    // ==========================================================================
    // 3. CRÉATION DES FICHIERS PDF & DRIVE
    // ==========================================================================
    const pdfDevisBlob = Utilities.newBlob(devisHtml, "text/html", "devis.html").getAs("application/pdf");
    pdfDevisBlob.setName(`Devis_Akouly_Gaming_${safeClientName}_${fileDate}.pdf`);
    const devisFile = folder.createFile(pdfDevisBlob);

    const pdfReglesBlob = Utilities.newBlob(reglesHtml, "text/html", "regles.html").getAs("application/pdf");
    pdfReglesBlob.setName(`Regles_de_Paiement_Akouly_Gaming.pdf`);
    const reglesFile = folder.createFile(pdfReglesBlob);

    // ==========================================================================
    // 4. NOTIFICATION ADMIN (AKOULY GAMING)
    // ==========================================================================
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      replyTo: (data.email && data.email.indexOf("@") !== -1) ? data.email : undefined,
      subject: `🚨 NOUVELLE COMMANDE PC - ${data.name} (${data.phone})`,
      body: `Nouvelle commande enregistrée sur Akouly Gaming !\n\n` +
            `CLIENT :\n` +
            `- Nom : ${data.name}\n` +
            `- Téléphone / WhatsApp : ${data.phone}\n` +
            `- Email : ${data.email}\n` +
            `- Adresse de livraison : ${data.address}\n\n` +
            `MONTANTS :\n` +
            `- 1er Paiement (Jour 0) : ${data.initialPayment} F CFA\n` +
            `- Mensualité (Mois 1, 2, 3) : ${data.monthlyInstallment} F CFA / mois\n` +
            `- Total : ${data.grandTotal} F CFA\n\n` +
            `FICHIERS DRIVE :\n` +
            `- Devis PDF : ${devisFile.getUrl()}\n` +
            `- Règles Paiement PDF : ${reglesFile.getUrl()}\n\n` +
            `DÉTAIL MATÉRIEL :\n${data.orderBody}`,
      attachments: [devisFile.getBlob()]
    });

    // ==========================================================================
    // 5. EMAIL AU CLIENT
    // ==========================================================================
    if (data.email && data.email.indexOf("@") !== -1) {
      MailApp.sendEmail({
        to: data.email,
        replyTo: ADMIN_EMAIL,
        subject: `Confirmation de votre commande PC & Devis officiel — Akouly Gaming`,
        body: `Bonjour ${data.name},\n\n` +
              `Nous avons bien enregistré votre commande pour votre configuration PC sur-mesure chez Akouly Gaming !\n\n` +
              `Vous trouverez en pièces jointes de cet email vos 2 documents officiels :\n` +
              `1. Votre Devis officiel détaillé au format PDF\n` +
              `2. Le document officiel « Règles de Paiement — Akouly Gaming » (échéancier en 4 fois sur 3 mois, délais, garanties et conditions d'annulation).\n\n` +
              `Notre équipe Akouly Gaming prendra contact avec vous très bientôt via WhatsApp ou téléphone au ${data.phone} pour valider votre dossier et finaliser le premier versement (Jour 0).\n\n` +
              `À très bientôt,\n` +
              `L'équipe Akouly Gaming\n` +
              `Abidjan, Côte d'Ivoire\n` +
              `Email : kouadjoabouajunior@gmail.com\n` +
              `Site : https://akouly.netlify.app/gaming.html`,
        attachments: [devisFile.getBlob(), reglesFile.getBlob()]
      });
    }

    return reponseJson({ 
      status: "ok", 
      devisUrl: devisFile.getUrl(),
      reglesUrl: reglesFile.getUrl()
    });

  } catch (error) {
    return reponseJson({ 
      status: "error", 
      message: error.toString() 
    });
  }
}

function reponseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
