/**
 * ==============================================================================
 * AKOULY GAMING — GOOGLE APPS SCRIPT (Code.gs)
 * Traitement automatisé des commandes & devis PC sur-mesure
 * ==============================================================================
 * 
 * FONCTIONNALITÉS :
 * 1. Réception des données du formulaire configurateur PC (gaming.html / processus-achat.html)
 * 2. Génération automatique du Devis officiel en PDF (sans répétition de clause)
 * 3. Génération du 2e Document officiel "Règles de Paiement — Akouly Gaming" en PDF
 * 4. Sauvegarde automatique des 2 PDF dans votre dossier Google Drive dédié
 * 5. Notification instantanée par email à AkoulyMarket (akoulymarket@gmail.com)
 * 6. Envoi automatique au CLIENT de son Devis PDF + Document des Règles de Paiement
 */

const DRIVE_FOLDER_ID = "15xH2h7VLTSk3IfTMdEi-j74Acw1XC-cq";
const ADMIN_EMAIL = "akoulymarket@gmail.com";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Aucune donnée reçue" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

    const now = new Date();
    const dateFormatted = Utilities.formatDate(now, "GMT+0", "dd/MM/yyyy 'à' HH:mm");
    const fileDate = Utilities.formatDate(now, "GMT+0", "yyyy-MM-dd_HHmm");
    const safeClientName = (data.name || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");

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
          Akouly Gaming — Abidjan, Côte d'Ivoire — Service Client : akoulymarket@gmail.com — https://akouly.netlify.app/gaming.html
        </div>
      </body>
      </html>
    `;

    // ==========================================================================
    // 2. MODÈLE HTML DES RÈGLES DE PAIEMENT (DOCUMENT 2 - CLIENT UNIQUEMENT)
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
          .callout { background: #fefce8; border: 1px solid #fef08a; border-radius: 4px; padding: 8px 10px; margin: 8px 0; font-size: 10px; color: #713f12; }
          .quote-box { background: #f1f5f9; border-left: 3px solid #64748b; padding: 8px 10px; font-size: 10px; font-style: italic; margin-top: 10px; }
          .footer { margin-top: 15px; text-align: center; font-size: 8.5px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 6px; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td>
              <div class="brand">AKOULY <span>GAMING</span></div>
              <div style="font-size: 9.5px; color: #64748b;">Guide & Modalités Contractuelles de Paiement</div>
            </td>
            <td style="text-align: right; font-size: 9.5px; color: #64748b;">
              Document Officiel Client — Abidjan
            </td>
          </tr>
        </table>

        <div class="doc-title">Règles de Paiement — Akouly Gaming</div>
        <div class="doc-intro">Ce document explique, simplement, comment fonctionne le paiement d'un PC commandé chez Akouly Gaming.</div>

        <h2>1. Le principe : un paiement en 4 fois, sur 3 mois</h2>
        <p style="margin: 2px 0 6px 0;">Vous ne payez pas tout d'un coup. Le paiement est découpé en <strong>4 versements</strong> :</p>
        
        <table class="data-table">
          <tr>
            <th style="width: 28%;">Versement</th>
            <th style="width: 22%;">Quand ?</th>
            <th>Ce qu'il couvre</th>
          </tr>
          <tr>
            <td><strong>1er versement (Jour 0)</strong></td>
            <td>À la commande</td>
            <td>Le pack choisi (boîtier + alimentation + ventilateurs + ventirad) + 30 000 F CFA de fret maritime</td>
          </tr>
          <tr>
            <td><strong>Tranche 1</strong></td>
            <td>Fin du mois 1</td>
            <td>1/3 du reste des pièces (CPU, carte mère, RAM, GPU, SSD) + fret aérien</td>
          </tr>
          <tr>
            <td><strong>Tranche 2</strong></td>
            <td>Fin du mois 2</td>
            <td>1/3 du reste des pièces + fret aérien</td>
          </tr>
          <tr>
            <td><strong>Tranche 3</strong></td>
            <td>Fin du mois 3</td>
            <td>1/3 du reste des pièces + fret aérien</td>
          </tr>
        </table>

        <div class="callout">
          ✨ <strong>Inclus :</strong> Le <strong>montage professionnel</strong> et la <strong>livraison à domicile à Abidjan</strong> sont <strong>gratuits</strong> et déjà inclus dans ces montants.
        </div>

        <h2>2. Les délais</h2>
        <ul>
          <li><strong>Durée totale : 90 jours (3 mois)</strong> à partir du 1er versement.</li>
          <li><strong>+ 1 semaine</strong> après la réception de toutes les pièces, pour le montage final et les tests de charge.</li>
          <li>Si les pièces arrivent plus tôt que prévu, votre PC peut être <strong>prêt plus vite</strong>.</li>
        </ul>

        <h2>3. Que se passe-t-il en cas de retard de paiement ?</h2>
        <ul>
          <li><strong>1.</strong> Vous avez <strong>10 jours de grâce</strong> après la date d'échéance d'une tranche — <em>aucune pénalité</em> pendant ce délai.</li>
          <li><strong>2.</strong> Passé ces 10 jours, une pénalité de <strong>-10 000 F CFA par semaine de retard</strong> est déduite du montant déjà versé.</li>
          <li><strong>3.</strong> Cette pénalité <strong>s'arrête à 0 F CFA</strong> — elle ne peut jamais rendre votre solde négatif.</li>
        </ul>

        <h2>4. Remboursement et rétractation</h2>
        <p style="margin: 2px 0 4px 0;">Si vous souhaitez annuler votre commande <strong>avant réception</strong>, le remboursement dépend du moment où vous annulez :</p>
        
        <table class="data-table">
          <tr>
            <th style="width: 65%;">Moment de l'annulation</th>
            <th>Montant remboursé</th>
          </tr>
          <tr>
            <td>Dans les <strong>48h</strong> suivant la commande</td>
            <td><strong>80%</strong> de la somme versée</td>
          </tr>
          <tr>
            <td>Après le paiement de la <strong>Tranche 1</strong></td>
            <td><strong>50%</strong></td>
          </tr>
          <tr>
            <td>Après le paiement de la <strong>Tranche 2</strong></td>
            <td><strong>20%</strong></td>
          </tr>
          <tr>
            <td>Après le paiement de la <strong>Tranche 3</strong></td>
            <td><strong>Aucun remboursement</strong></td>
          </tr>
        </table>

        <p style="margin: 3px 0;">⏱️ Le remboursement est traité sous <strong>14 jours ouvrés</strong>.</p>
        <p style="margin: 3px 0;">Si le PC est déjà livré mais tombe en panne et <strong>ne peut pas être réparé</strong>, un remboursement reste possible dans un délai maximum de <strong>1 mois</strong> après réception du boîtier en magasin à Abobo N'Dotré.</p>

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
          Akouly Gaming — Abidjan, Côte d'Ivoire — Email : akoulymarket@gmail.com — https://akouly.netlify.app/gaming.html
        </div>
      </body>
      </html>
    `;

    // ==========================================================================
    // 3. CONVERSION EN BLOBS PDF & SAUVEGARDE SUR GOOGLE DRIVE
    // ==========================================================================
    // PDF 1 : Devis
    const pdfDevisBlob = Utilities.newBlob(devisHtml, "text/html", "devis.html").getAs("application/pdf");
    pdfDevisBlob.setName(`Devis_Akouly_Gaming_${safeClientName}_${fileDate}.pdf`);
    const devisFile = folder.createFile(pdfDevisBlob);

    // PDF 2 : Règles de Paiement
    const pdfReglesBlob = Utilities.newBlob(reglesHtml, "text/html", "regles.html").getAs("application/pdf");
    pdfReglesBlob.setName(`Regles_de_Paiement_Akouly_Gaming.pdf`);
    const reglesFile = folder.createFile(pdfReglesBlob);

    // ==========================================================================
    // 4. NOTIFICATION ADMIN (AKOULY MARKET & AKOULY GAMING)
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
    // 5. EMAIL AU CLIENT (DEVIS PDF + RÈGLES DE PAIEMENT PDF)
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
              `Email : akoulymarket@gmail.com\n` +
              `Site : https://akouly.netlify.app/gaming.html`,
        attachments: [devisFile.getBlob(), reglesFile.getBlob()]
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "ok", 
      devisUrl: devisFile.getUrl(),
      reglesUrl: reglesFile.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
