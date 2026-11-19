/* Exemple fictif (structure tirée d'un vrai deck) : Lumen, photobooth. Noms, citations et chiffres inventés. */
const DECK = { footer: "Lumen · proposition du 15 mars 2027", steps: 6, stepOffset: 6 };
const DEC = [['terracotta','Terracotta'],['marbre','Marbre'],['champagne','Champagne'],['olive','Olive'],['noirpaillete','Noir pailleté'],['vieuxrose','Vieux rose'],['ivoire','Ivoire'],['roses','Mur de roses']];
const SLIDES = [
{t:"Couverture", html:`
  <div class="ph" style="position:absolute;right:0;top:0;bottom:0;width:500px;border-radius:0;background-image:${U('p_desert')}"></div>
  <div class="pad" style="right:500px;display:flex;flex-direction:column;justify-content:center">
    <img src="${IMG.logo_sq}" style="width:84px;height:84px;border-radius:50%;margin-bottom:40px">
    <h1>Lumen,<br>en pilote automatique.</h1>
    <p class="lead" style="margin-top:28px;max-width:520px">Pour Marc Dupraz. Ce que j'ai compris de votre projet, et ce que je vous propose.</p>
  </div>${FOOT_COVER()}`,
 notes:`<h5>Ouvrir : poser le cadre</h5>
  <div class="do">« Merci d'avoir pris le temps. On a 15 minutes. Je vous montre d'abord <b>ce que j'ai compris</b> de votre projet, corrigez-moi si je me trompe. Ensuite ce que je propose, et <b>à la fin le prix</b>. À la fin, vous me dites honnêtement : oui, non, ou ce qui manque. Ça vous va ? »</div>
  ${ask("Votre associée est avec nous ? Sinon : « Est-ce qu'il y a quelqu'un d'autre qui doit être dans la décision ? »")}
  <h5>Posture</h5><div class="do">Tu présentes <b>son</b> projet, pas tes services. Il parle au moins la moitié du temps : chaque fois qu'il réagit, tais-toi et laisse-le finir.</div>`},

{t:"Ce que vous avez construit", html:`
  <div class="pad">
    <h2>Le produit est prêt.</h2>
    <div class="cols" style="grid-template-columns:1.05fr 1fr;gap:56px">
      <div class="cols" style="grid-template-columns:1fr 1fr;gap:12px;height:440px">
        <div class="ph" style="background-image:${U('drape')}"></div>
        <div class="cols" style="grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,1fr);gap:8px">
          ${DEC.map(([k])=>`<div class="ph" style="border-radius:4px;background-image:${U('dec_'+k)}"></div>`).join('')}
        </div>
      </div>
      <div class="cols" style="gap:26px;align-content:start;padding-top:6px">
        <div class="item rule"><h3>Du matériel professionnel</h3><p>Appareil Canon, imprimante DNP, tirages illimités.</p></div>
        <div class="item rule"><h3>Trois formules, huit décors</h3><p>Essentiel, Signature, Prestige.</p></div>
        <div class="item rule"><h3>Un partenaire qui vous fait confiance</h3><p>Le traiteur vous confie déjà ses événements.</p></div>
      </div>
    </div>
  </div>${FOOT('2')}`,
 notes:`<h5>Ce qu'il faut faire passer</h5><div class="do">Un compliment <b>vrai et précis</b> : il a passé du temps sur son catalogue, il est perfectionniste. Reconnais-le avant de parler de ce qui manque.</div>
  <h5>Ses mots</h5>${mot("J'aime quand c'est fait proprement","22:10")}${mot("Pas juste les fêtes entre amis.","27:45")}${mot("Je veux être plutôt du côté haut de gamme","03:15")}
  <div class="do">« Honnêtement, votre catalogue est meilleur que beaucoup de ce que je vois. Le produit est prêt. Ce qui manque, c'est la vitrine et le moteur. »</div>`},

{t:"Aujourd'hui", html:`
  <div class="pad">
    <h2>Aujourd'hui, tout repose sur vous.</h2>
    <div class="cols" style="grid-template-columns:repeat(4,1fr);gap:32px">
      <div class="said rule"><small>Les devis</small>« Les devis, je les fais à la main. »</div>
      <div class="said rule"><small>Le suivi</small>« Le suivi, c'est un fichier Excel. »</div>
      <div class="said rule"><small>Les clients</small>« C'est le traiteur qui m'envoie les clients. »</div>
      <div class="said rule"><small>Internet</small>« Sur Internet, je n'ai presque rien. »</div>
    </div>
    <p style="margin-top:90px;font-size:30px;font-weight:500;letter-spacing:-.02em;line-height:1.3;max-width:960px">Avec trois ou quatre réservations, ça tient.<br><span style="color:var(--muted)">À trois événements par semaine, à côté du traiteur, ça ne tiendra plus.</span></p>
  </div>${FOOT('3')}`,
 notes:`<h5>Ses mots (reprends-les tels quels)</h5>${mot("Les devis, je les fais à la main","06:50")}${mot("Le suivi, c'est un fichier Excel","06:35")}${mot("C'est le traiteur qui m'envoie les clients, je ne cherche pas","05:02")}${mot("Sur Internet, je n'ai presque rien, disons rien du tout","05:30")}${mot("Le traiteur nous prend déjà beaucoup de temps","29:40")}
  <h5>Question d'implication, puis silence</h5>${ask("« Imaginez un samedi de juin avec trois demandes en même temps, pendant que vous êtes au traiteur. Ça se passe comment, concrètement ? »")}
  <div class="do">Laisse-le décrire. Relance : « Et la demande à laquelle vous répondez le lendemain, elle devient quoi ? »</div>`},

{t:"Sa phrase", html:`
  <div class="pad" style="display:flex;flex-direction:column;justify-content:center">
    <p class="quote">« J'ouvre mon planning, je vois que la cliente a choisi sa formule, envoyé ses documents, et il me reste juste à finaliser. »</p>
  </div>${FOOT('4')}`,
 notes:`<h5>Le pivot de la présentation</h5><div class="do">C'est <b>sa</b> vision, mot pour mot (07:20). Lis-la lentement, puis : « C'est vous qui me l'avez dit. »</div>
  ${ask("« C'est toujours ça, l'objectif ? » Attends son oui.")}
  <div class="do">« Je vais vous montrer exactement à quoi ça ressemblera, étape par étape. »</div>
  <h5>Si besoin, ses autres mots</h5>${mot("Que le site tourne tout seul, en gros","04:05")}${mot("Je veux le mettre en place pour ne plus y penser","38:10")}`},

{t:"Où vous voulez aller", html:`
  <div class="pad">
    <h2>Faire grandir Lumen,<br>sans y passer vos soirées.</h2>
    <div class="cols" style="grid-template-columns:repeat(3,1fr);gap:40px;margin-top:20px">
      <div class="item rule"><h3>Trois événements par semaine</h3><p>Le cap pour en vivre et quitter votre poste.</p></div>
      <div class="item rule"><h3>Une deuxième, puis une troisième borne</h3><p>Dès que la demande le justifie.</p></div>
      <div class="item rule"><h3>Une marque qui se décline</h3><p>Lumen Bar, Lumen Expérience : d'autres concepts sous le même nom.</p></div>
    </div>
  </div>${FOOT('5')}`,
 notes:`<h5>Ses mots</h5>${mot("Avec trois événements par semaine, je peux arrêter mon autre travail","10:50")}${mot("Prendre une deuxième borne, puis une troisième, et faire autre chose à côté","09:55")}${mot("Un Lumen Bar, un Lumen Expérience","24:30")}${mot("Si je le fais, je le fais bien","31:00")}
  <h5>Le coût de ne rien faire</h5>${ask("« Ce jour-là, avec trois événements par semaine, qui fait les devis, les relances, le planning ? »")}
  <div class="do">S'il dit « moi » ou « je ne sais pas » : « C'est exactement ce que je vais vous montrer. »</div>`},

{t:"Le site", html:`
  <div class="pad" style="padding-top:56px">
    <h2 style="font-size:40px;margin-bottom:20px">Votre site, première idée.</h2>
    ${URL('lumen-events.ch',520,`
      <div class="snav"><img src="${IMG.logo_sq}"><div class="links"><span>Formules</span><span>Décors</span><span>Galerie</span><span>Partenaires</span><span class="btn o" style="padding:7px 14px;font-size:12px">Réserver</span></div></div>
      <div class="hero" style="background-image:${U('drape')}">
        <div class="h">Capturez le moment.</div>
        <p>Photobooth pour mariages et événements, en Suisse romande.</p>
        <span class="btn w">Voir les disponibilités</span>
      </div>
      <div class="srow">
        <div><b>Essentiel · 590 CHF</b><small>Simple et complet</small></div>
        <div><b>Signature · 790 CHF</b><small>À l'image de votre événement</small></div>
        <div><b>Prestige · sur devis</b><small>Une expérience accompagnée</small></div>
      </div>`)}
  </div>${FOOT('6')}`,
 notes:`<h5>Précise : c'est un aperçu</h5><div class="do">« C'est une première idée, avec vos photos et vos formules. Le vrai design, on le fait ensemble. »</div>
  <h5>Ses mots</h5>${mot("Quelque chose de beau, de sobre","03:30")}${mot("Une page vitrine, je pourrais la faire moi-même… mais toute la partie logiciel, je n'y connais rien","04:20")}
  ${ask("« Qu'est-ce que vous en pensez ? Qu'est-ce que vous changeriez ? »")}<div class="do">Note ce qu'il dit : ce sont ses critères d'achat. Puis : « Maintenant, je vous montre ce qui se passe derrière, quand un client réserve. »</div>`},

{t:"Étape 1 · on vous trouve", html: STEP(1,"Le client vous trouve.","Il demande à ChatGPT ou à Google. Lumen ressort, avec votre site.","Sans vous",
  URL('chatgpt.com',470,`<div class="chat">
    <div class="me">On se marie en juin à Lausanne. Quel photobooth premium tu nous conseilles ?</div>
    <div>Pour un mariage à Lausanne, <b>Lumen</b> est une bonne option : appareil Canon, impression professionnelle, tirages illimités et huit décors au choix. Les formules vont de 590 à 790 CHF, avec une formule Prestige accompagnée pour les événements d'entreprise. Vous pouvez vérifier les disponibilités et réserver en ligne.</div>
    <div class="card"><div class="ph" style="background-image:${U('drape')}"></div><div><div style="font-weight:600">Lumen · Photobooth en Suisse romande</div><div class="small">lumen-events.ch</div></div></div>
  </div>`)),
 notes:`<h5>Ce que tu dis</h5><div class="do">« Vous, vous m'avez trouvé comme ça. Vos clients vous trouveront pareil : sur Google et dans ChatGPT. C'est le travail du suivi, et je vous montre chaque mois ce qui a bougé. »</div>
  ${mot("Je vous ai trouvé en demandant à ChatGPT","35:50")}
  <div class="do">C'est une illustration, pas une promesse de position. Si il demande « combien de temps ? » : « Ça se construit, on mesure chaque mois. »</div>`},

{t:"Étape 2 · il choisit", html: STEP(2,"Il choisit sa formule et son décor.","Il voit vos vrais décors, vos prix, et vérifie que sa date est libre.","Sans vous",
  URL('lumen-events.ch/reserver',470,`<div style="padding:22px 26px">
    <div class="small">Mariage · samedi 13 juin 2027 · <span style="color:var(--ink)">date disponible</span></div>
    <div style="font-size:24px;font-weight:600;letter-spacing:-.02em;margin:6px 0 16px">Choisissez votre décor</div>
    <div class="decors">${DEC.map(([k,n],i)=>`<div class="dec ${i==0?'sel':''}"><div class="sw" style="background-image:${U('dec_'+k)}"></div><span>${n}</span></div>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:22px;border-top:1px solid var(--line);padding-top:16px"><span>Formule Signature · Terracotta · <b>790 CHF</b></span><span class="btn">Recevoir mon devis</span></div>
  </div>`)),
 notes:`<h5>Ses mots</h5>${mot("Que le client puisse réserver sur le site et recevoir son devis directement","04:00")}${mot("Un calendrier, le paiement en ligne, quelque chose de complet","03:20")}
  <div class="do">« Ce sont vos huit décors, vos photos. Le client choisit tout seul, à 23 h un dimanche s'il veut. »</div>`},

{t:"Étape 3 · le devis", html: STEP(3,"Il reçoit son devis, tout de suite.","Un devis propre, à votre nom, envoyé par e-mail dès sa demande.","Sans vous",
  `<div class="paper" style="height:470px">
    <div style="display:flex;justify-content:space-between;align-items:start"><img src="${IMG.logo_sq}"><div style="text-align:right;font-size:13px;color:var(--muted)">Devis n° 2027-014<br>15 mars 2027</div></div>
    <div style="font-size:24px;font-weight:600;letter-spacing:-.02em;margin:22px 0 4px">Devis · Mariage du 13 juin 2027</div>
    <div class="small" style="margin-bottom:16px">Pour Claire et Thomas Dubois · Lausanne</div>
    <div class="row"><span>Formule Signature, utilisation toute la soirée</span><span>790 CHF</span></div>
    <div class="row"><span>Décor Terracotta, 2,40 × 2,40 m</span><span>inclus</span></div>
    <div class="row"><span>Template photo personnalisé, écran d'accueil</span><span>inclus</span></div>
    <div class="row"><span>Livraison, installation, démontage</span><span>inclus</span></div>
    <div class="row t"><span>Total</span><span>790 CHF</span></div>
    <div class="row m"><span>Acompte de 30 % pour bloquer la date</span><span>237 CHF</span></div>
    <div style="margin-top:14px"><span class="btn">Accepter et payer l'acompte</span></div>
  </div>`),
 notes:`<h5>Ses mots</h5>${mot("J'ai vu que les devis peuvent être automatiques : on choisit, et le devis part tout de suite par mail","08:05")}${mot("Aujourd'hui, les clients veulent une réponse immédiate","34:30")}
  <div class="do">« Fini le devis à la main. Votre client le reçoit en quelques secondes, avec votre logo. »</div>`},

{t:"Étape 4 · l'acompte", html: STEP(4,"Il accepte et paie l'acompte.","Il accepte vos conditions générales, paie par TWINT ou par carte. Vous êtes prévenu.","Sans vous",
  `<div class="phone" style="background-image:${U('p_desert')}">
    <div class="time">21:47</div><div class="date">samedi 8 novembre</div>
    <div class="notif" style="top:250px"><b>Stripe · maintenant</b>Paiement reçu : 237,00 CHF<br>Acompte · Mariage Dubois · 13 juin 2027</div>
    <div class="notif" style="top:338px"><b>Lumen · maintenant</b>Devis 2027-014 accepté. Conditions générales signées.</div>
  </div>`),
 notes:`<h5>Ses mots</h5>${mot("Ils signent en ligne, acceptent les conditions, paient, et ensuite tout se fait seul","08:30")}
  <div class="do">« Un samedi soir, vous êtes au traiteur. Votre téléphone vibre : l'acompte est payé, la date est à vous. »</div>
  <div class="do">Conseil : seul l'acompte passe en ligne, le solde par virement, pour limiter les frais Stripe.</div>`},

{t:"Étape 5 · l'agenda", html: STEP(5,"La date se bloque dans votre agenda.","L'événement s'ajoute tout seul. La date n'est plus proposée aux autres clients.","Sans vous",
  `<div class="frame" style="height:470px;padding:14px 16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-size:18px;font-weight:600">Juin 2027</span><span class="small" style="background:var(--tint);color:var(--ink);padding:5px 10px;border-radius:4px">Nouvel événement ajouté</span></div>
    <div class="cal">
      <div class="h"></div>${['Lu 8','Ma 9','Me 10','Je 11','Ve 12','Sa 13','Di 14'].map(d=>`<div class="h">${d.split(' ')[0]}<b>${d.split(' ')[1]}</b></div>`).join('')}
      <div class="hr">10h<br><br><br><br><br>14h<br><br><br><br><br>18h<br><br><br><br><br>22h</div>
      <div class="c"></div><div class="c"></div><div class="c"></div>
      <div class="c"><div class="ev" style="top:40px;height:46px">Traiteur · service</div></div>
      <div class="c"><div class="ev" style="top:190px;height:70px">Anniversaire Rossi · Essentiel</div></div>
      <div class="c"><div class="ev new" style="top:150px;height:140px"><b>Mariage Dubois</b><br>17h–01h<br>Signature · Terracotta<br>Acompte payé</div></div>
      <div class="c"></div>
    </div>
  </div>`),
 notes:`<h5>Ses mots</h5>${mot("Une fois payé, ça s'inscrit tout seul dans l'agenda","08:40")}
  <div class="do">« Vous n'avez rien recopié. La date est bloquée, personne d'autre ne peut la réserver. »</div>`},

{t:"Étape 6 · vous finalisez", html: STEP(6,"Vous finalisez.","Tout est dans la fiche : lieu, horaires, contact sur place, décor. Il ne reste que votre part.","Votre part",
  URL('lumen-events.ch/admin',470,`<div style="padding:20px 26px">
    <div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:24px;font-weight:600;letter-spacing:-.02em">Mariage Dubois</div><div class="small">Samedi 13 juin 2027 · Signature · Terracotta</div></div><span class="btn">Marquer comme prêt</span></div>
    <div class="cols" style="grid-template-columns:1fr 1fr;gap:30px;margin-top:18px">
      <div>
        <div class="row"><span class="small">Lieu</span><span>Salle communale, Pully</span></div>
        <div class="row"><span class="small">Installation</span><span>dès 15h</span></div>
        <div class="row"><span class="small">Prestation</span><span>17h – 01h</span></div>
        <div class="row"><span class="small">Contact sur place</span><span>Julie, témoin · 079 …</span></div>
        <div class="row"><span class="small">Venu par</span><span>Traiteur, code partenaire</span></div>
      </div>
      <div>
        <div class="row"><span class="small">Acompte</span><span>237 CHF · payé</span></div>
        <div class="row"><span class="small">Solde</span><span>553 CHF · à régler</span></div>
        <div class="row"><span class="small">Titre du template</span><span>Claire &amp; Thomas · 13.06.27</span></div>
        <div style="margin-top:14px;font-size:14px;line-height:1.9">☑ Conditions générales signées<br>☑ Informations du lieu reçues<br>☐ Template à valider avec les mariés</div>
      </div>
    </div>
  </div>`)),
 notes:`<h5>Sa phrase, réalisée</h5>${mot("J'ouvre mon planning, je vois que la cliente a choisi sa formule… et il me reste juste à finaliser","07:20")}
  <div class="do">« Voilà. C'est exactement votre phrase. Les cinq premières étapes se font sans vous. Celle-ci, c'est la vôtre. »</div>
  ${ask("« Est-ce que c'est comme ça que vous l'imaginiez ? »")}`},

{t:"Votre planning", html:`
  <div class="pad" style="padding-top:56px">
    <h2 style="font-size:40px;margin-bottom:20px">Et chaque matin, votre planning.</h2>
    ${URL('lumen-events.ch/admin',520,`<div class="dash" style="height:489px">
        <div class="side"><img src="${IMG.logo_sq}"><div class="on">Planning</div><div>Demandes</div><div>Devis</div><div>Partenaires</div><div>Réglages</div></div>
        <div class="main">
          <div class="kp"><div><small>Événements en juin</small><b>9</b></div><div><small>Nouvelles demandes</small><b>4</b></div><div><small>Acomptes reçus</small><b>2'133 CHF</b></div><div><small>Via partenaires</small><b>5</b></div></div>
          <div class="warn">Deux demandes le samedi 13 juin pour une seule borne.</div>
          <table class="t">
            <tr><th>Date</th><th>Client</th><th>Formule</th><th>Venu par</th><th>Statut</th></tr>
            <tr><td>Sa 13.06</td><td>Mariage Dubois</td><td>Signature · Terracotta</td><td>Traiteur</td><td>Acompte payé</td></tr>
            <tr class="c"><td>Sa 13.06</td><td>Anniversaire Rossi</td><td>Essentiel</td><td>Google</td><td class="a">Même date</td></tr>
            <tr><td>Ve 19.06</td><td>Soirée d'entreprise</td><td>Prestige · 5 h d'hôtesse</td><td>ChatGPT</td><td>Devis envoyé</td></tr>
            <tr><td>Sa 27.06</td><td>Mariage Keller</td><td>Signature · Champagne</td><td>Domaine partenaire</td><td class="a">À finaliser</td></tr>
          </table>
        </div></div>`)}
  </div>${FOOT('13')}`,
 notes:`<h5>Ses mots</h5>${mot("Si deux demandes tombent le même jour, qu'on me prévienne… ça me dira quand acheter une autre borne","30:15")}
  <div class="do">« Qui a payé, d'où vient chaque client, et l'alerte quand deux demandes tombent le même jour. Le jour où elle revient souvent, vous savez qu'il est temps d'acheter la deuxième borne. »</div>
  ${ask("« Votre associée, elle utiliserait quoi là-dedans ? »")}`},

{t:"Partenaires", html:`
  <div class="pad" style="padding-top:56px">
    <h2 style="font-size:40px;margin-bottom:24px">Chaque partenaire a son code.</h2>
    <div class="cols" style="grid-template-columns:1fr 1.15fr;gap:36px">
      <div>
        <p class="body" style="margin-bottom:14px">Le commercial du traiteur réserve lui-même, avec son code. Vos tarifs partenaires s'appliquent tout seuls.</p>
        ${URL('lumen-events.ch/reserver',330,`<div style="padding:18px 22px">
          <div class="small">Code partenaire</div>
          <div style="display:flex;gap:8px;margin:6px 0 14px"><div style="flex:1;border:1px solid var(--ink);border-radius:6px;padding:9px 12px;font-weight:600">TRAITEUR-GE</div><span class="btn" style="padding:9px 16px">Appliquer</span></div>
          <div style="background:var(--tint);padding:8px 12px;border-radius:4px;font-size:13.5px;margin-bottom:10px">Tarif partenaire appliqué</div>
          <div class="row"><span>Formule Signature</span><span><s style="color:var(--muted)">790</s>&nbsp; tarif partenaire</span></div>
          <div class="row"><span>Réservé par</span><span>Traiteur · commercial</span></div>
          <div class="row t"><span>Pour le client</span><span>Mariage Keller</span></div>
        </div>`)}
      </div>
      <div>
        <p class="body" style="margin-bottom:14px">Et vous voyez, chaque mois, qui vous envoie quoi.</p>
        ${URL('lumen-events.ch/admin/partenaires',330,`<div style="padding:18px 22px">
          <div style="font-weight:600;margin-bottom:12px">Partenaires · juin 2027</div>
          <table class="t">
            <tr><th>Partenaire</th><th>Code</th><th style="width:40%">Événements</th><th></th></tr>
            <tr><td>Traiteur</td><td>TRAITEUR-GE</td><td><div class="bar" style="width:100%"></div></td><td>5</td></tr>
            <tr><td>Domaine viticole</td><td>DOMAINE-01</td><td><div class="bar" style="width:40%"></div></td><td>2</td></tr>
            <tr><td>Wedding planner</td><td>WP-LEMAN</td><td><div class="bar" style="width:20%"></div></td><td>1</td></tr>
          </table>
        </div>`)}
      </div>
    </div>
  </div>${FOOT('14')}`,
 notes:`<h5>Ses mots</h5>${mot("Que chaque partenaire ait son code, et qu'en le tapant, les bons prix s'affichent","14:40")}${mot("J'ai pas mal de contacts dans les domaines viticoles","12:30")}
  ${ask("« Combien de partenaires vous voyez arriver dans les six prochains mois ? »")}<div class="do">Plus il en cite, plus la valeur monte. Les montants partenaires ne sont pas affichés : ce sont les siens, on les règle ensemble.</div>`},

{t:"Et demain", html:`
  <div class="pad" style="padding-top:56px">
    <h2 style="font-size:40px;margin-bottom:24px">Prêt pour la suite.</h2>
    <div class="cols" style="grid-template-columns:repeat(3,1fr);gap:26px">
      <div>
        ${URL('admin · planning',300,`<div style="padding:14px 16px;font-size:12.5px">
          <div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:6px;color:var(--muted);margin-bottom:8px"><span></span><span>Borne 1</span><span>Borne 2</span></div>
          ${[['Sa 13.06','Mariage Dubois','Anniversaire Rossi'],['Ve 19.06','Soirée d\'entreprise',''],['Sa 20.06','Mariage Rey','Mariage Favre']].map(r=>`<div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:6px;margin-bottom:6px"><span class="small">${r[0]}</span><span style="background:var(--fill);padding:8px;border-radius:4px">${r[1]}</span><span style="background:${r[2]?'var(--tint)':'transparent'};padding:8px;border-radius:4px">${r[2]}</span></div>`).join('')}
        </div>`)}
        <div class="item" style="margin-top:18px"><h3>Une deuxième borne</h3><p>Le planning gère déjà plusieurs bornes. Il suffit de l'activer.</p></div>
      </div>
      <div>
        ${URL('lumen-events.ch/bar',300,`<div class="snav" style="padding:10px 14px"><img src="${IMG.logo_sq}" style="width:26px;height:26px"><div class="links" style="gap:12px;font-size:11.5px"><span>Photobooth</span><span style="font-weight:600">Bar</span><span>Expériences</span></div></div>
          <div class="hero" style="margin:0 14px;height:220px;background-image:${U('dec_champagne')}"><div class="h" style="font-size:30px">Lumen Bar.</div><p style="font-size:12px;margin:8px 0 0">Le bar de Lumen · bientôt</p></div>`)}
        <div class="item" style="margin-top:18px"><h3>Vos prochains concepts</h3><p>Sous le même nom, dans le même site, sans tout refaire.</p></div>
      </div>
      <div>
        <div class="frame" style="height:300px;background-size:cover;background-position:center;background-image:${U('drape')};position:relative">
          <div class="notif" style="top:24px"><b>Assistant Lumen · maintenant</b>Nouvelle demande pour le 13 juin : Signature, Terracotta. La borne 1 est déjà prise, la borne 2 est libre.</div>
        </div>
        <div class="item" style="margin-top:18px"><h3>Plus tard, un assistant</h3><p>Prévenu sur votre téléphone. Une étape suivante, hors de cette proposition.</p></div>
      </div>
    </div>
  </div>${FOOT('15')}`,
 notes:`<h5>Ses mots</h5>${mot("Si ça marche et qu'on veut ajouter autre chose, il faudra changer le site… et ça, je ne sais pas faire","33:40")}${mot("Je cherche quelqu'un sur qui compter dans la durée","33:55")}
  <div class="do">L'assistant est <b>hors proposition</b> : tu le montres comme une suite possible, sans prix.</div>`},

{t:"Récapitulatif", html:`
  <div class="pad" style="padding-top:60px">
    <h2 style="margin-bottom:18px">Vous m'avez dit. On met en place.</h2>
    <table class="recap">
      <tr><td>« Quelque chose de beau, de sobre »</td><td>Votre marque et votre site, en français et en anglais</td></tr>
      <tr><td>« Que le client puisse réserver et recevoir son devis »</td><td>Réservation, devis, conditions et acompte en ligne</td></tr>
      <tr><td>« J'ouvre mon planning… il me reste juste à finaliser »</td><td>Votre planning, vos fiches et les alertes</td></tr>
      <tr><td>« Que chaque partenaire ait son code »</td><td>Codes et tarifs partenaires, suivi par partenaire</td></tr>
      <tr><td>« Être trouvé sur Google… avec un suivi »</td><td>Google, ChatGPT, rapport mensuel</td></tr>
      <tr><td>« Quelqu'un sur qui compter dans la durée »</td><td>Corrections offertes pendant tout le suivi</td></tr>
    </table>
  </div>${FOOT('16')}`,
 notes:`<h5>Le moment clé avant le prix</h5><div class="do">Lis la colonne de gauche : ce sont ses mots. Puis :</div>
  ${ask("« Est-ce que j'ai oublié quelque chose ? »")}${ask("« Sur 10, à quel point ça correspond à ce que vous aviez en tête ? »")}
  <div class="do">Si moins de 8 : « Qu'est-ce qui manque pour arriver à 10 ? » Règle ça <b>avant</b> de montrer le prix.</div>`},

{t:"Investissement", html:`
  <div class="pad" style="padding-top:60px">
    <h2 style="margin-bottom:26px">Deux façons d'avancer.</h2>
    <div class="opts">
      <div class="opt">
        <div class="name">Six mois</div>
        <div class="price">3'900 CHF</div>
        <div class="val">Valeur 5'000 CHF</div>
        <ul>
          <li>Vos clients réservent et paient sans vous appeler</li>
          <li>Vous ouvrez votre planning et vous finalisez</li>
          <li>On vous trouve sur Google et dans ChatGPT, suivi six mois</li>
        </ul>
        <div class="pay">900 CHF au départ, puis 6 × 500 CHF<br>ou 6 × 650 CHF</div>
      </div>
      <div class="opt big">
        <div class="name">Un an</div>
        <div class="price">4'500 CHF</div>
        <div class="val">Valeur 6'500 CHF</div>
        <ul>
          <li>Vos clients réservent et paient sans vous appeler</li>
          <li>Vous ouvrez votre planning et vous finalisez</li>
          <li>Vos partenaires réservent eux-mêmes, avec leur code</li>
          <li>On vous trouve sur Google et dans ChatGPT, suivi pendant un an</li>
          <li>Tout est prêt pour la deuxième borne et vos prochains concepts</li>
        </ul>
        <div class="pay">1'200 CHF au départ, puis 12 × 275 CHF · ou 12 × 375 CHF</div>
      </div>
    </div>
  </div>${FOOT('17')}`,
 notes:`<h5>Annonce le prix une fois, calmement. Puis silence.</h5><div class="do">« Vous m'avez dit que quatre ou cinq locations rentabilisaient le système. L'option un an, c'est un peu plus de cinq Signature, étalé sur un an : une réservation tous les deux à trois mois. »</div>
  ${mot("Si ça me ramène quatre ou cinq locations, c'est remboursé","29:50")}${mot("Le système, je le veux, c'est certain","29:30")}
  <h5>Question de choix, pas oui ou non</h5>${ask("« Laquelle des deux vous parle le plus ? »")}
  <div class="do">Puis tais-toi, même si le silence dure.</div>
  <h5>Si on te demande le détail</h5><div class="do">Six mois : marque et site, réservation complète, suivi six mois, corrections six mois. Un an : pareil sur douze mois, plus les carrousels Instagram et la prise en main avec son associée.</div>
  <h5>Pas de baisse sans contrepartie</h5><div class="do">S'il négocie : retire quelque chose (six mois) ou demande une contrepartie (départ plus élevé). Le tarif partenaire est déjà le geste.</div>`},

{t:"Prochaines étapes", html:`
  <div class="pad" style="padding-top:60px">
    <h2 style="margin-bottom:28px">En ligne avant la saison des mariages.</h2>
    <div class="cols" style="grid-template-columns:repeat(4,1fr);gap:22px">
      <div><div class="paper" style="height:190px;padding:18px"><div class="small">Proposition JL-LUMEN-2027-01</div><div style="margin:14px 0 6px;font-weight:600">Bon pour accord</div><div style="border-bottom:1px solid var(--ink);height:44px;margin-top:20px"></div><div class="small" style="margin-top:6px">Marc Dupraz</div></div>
        <div class="item" style="margin-top:16px"><h3>Cette semaine</h3><p>Vous choisissez l'option et signez.</p></div></div>
      <div><div class="cols" style="grid-template-columns:1fr 1fr;gap:6px;height:190px">${['drape','p_desert','dec_terracotta','dec_roses'].map(k=>`<div class="ph" style="background-image:${U(k)}"></div>`).join('')}</div>
        <div class="item" style="margin-top:16px"><h3>Semaine 1</h3><p>Vous m'envoyez photos, textes, conditions générales.</p></div></div>
      <div><div class="frame" style="height:190px"><div class="hero" style="margin:12px;height:164px;background-image:${U('drape')}"><div class="h" style="font-size:22px">Capturez le moment.</div></div></div>
        <div class="item" style="margin-top:16px"><h3>Semaine 2</h3><p>On valide le design ensemble.</p></div></div>
      <div><div class="frame" style="height:190px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><img src="${IMG.logo_sq}" style="width:60px;height:60px;border-radius:50%"><div style="font-weight:600">lumen-events.ch</div><div style="background:var(--tint);padding:4px 10px;border-radius:4px;font-size:13px">En ligne</div></div>
        <div class="item" style="margin-top:16px"><h3>Environ semaine 3</h3><p>Mise en ligne, vos premières réservations.</p></div></div>
    </div>
  </div>${FOOT('18')}`,
 notes:`<h5>Fermer sur une étape datée</h5>${ask("« On part sur quelle option ? Je vous envoie la proposition à signer aujourd'hui, et vous me transmettez vos photos cette semaine ? »")}
  <div class="do">Le délai dépend de la réception de ses contenus : dis-le. S'il doit en parler à son associée : fixe <b>tout de suite</b> un appel à trois, avec date et heure.</div>
  ${mot("Je veux le mettre en place pour ne plus y penser. Quand c'est prêt, c'est prêt","38:10")}
  <div class="do">Les mariés réservent leurs prestataires des mois à l'avance : être en ligne cet hiver, c'est être prêt quand ils cherchent.</div>`}
];

const OBJECTIONS = `<h6>Antisèche, toujours visible</h6>
<div class="rules">Reprends ses mots, pas les tiens. Une question à la fois, puis silence. Il parle au moins la moitié du temps.</div>
<details open><summary>« C'est cher »</summary><p>« Par rapport à quoi ? » Puis silence. Ensuite : « Vous m'avez dit que 4-5 locations le remboursaient (29:50). C'est un peu plus de cinq Signature, sur un an. »</p></details>
<details><summary>« Je dois en parler à mon associée »</summary><p>« Bien sûr. Qu'est-ce qu'elle va vous demander, à votre avis ? Qu'est-ce qui la ferait dire oui ? » Puis : « On se fait 15 minutes à trois cette semaine ? Quel jour vous arrange ? » Date fixée avant de raccrocher.</p></details>
<details><summary>« Je vais réfléchir »</summary><p>« Bien sûr. Pour que je comprenne : c'est le prix, le contenu ou le moment qui vous fait hésiter ? » Traite la vraie raison.</p></details>
<details><summary>« On n'est pas pressés »</summary><p>« Vous me l'avez dit : vous voulez que ce soit en place pour ne plus y penser (38:10). Les mariés réservent des mois à l'avance : être en ligne cet hiver, c'est capter la saison. »</p></details>
<details><summary>« Je pourrais faire le site moi-même »</summary><p>Ses mots : « une page vitrine, je pourrais la faire moi-même, mais la partie logiciel, je n'y connais rien » (04:20). « Le site seul, oui. Le système derrière, c'est ce qui vous libère du temps. »</p></details>
<details><summary>« On commence par le site seul ? »</summary><p>« C'est possible. Mais vous m'avez dit : "le système, je le veux, c'est certain" (29:30). Le refaire après coûte plus cher que le faire maintenant. » Sinon : option six mois.</p></details>
<details><summary>« Et si ça ne marche pas ? »</summary><p>« Les corrections sont incluses pendant tout le suivi. Et tout reste à votre nom : site, domaine, comptes. »</p></details>
<details><summary>« Payer en plusieurs fois ? »</summary><p>Déjà prévu : départ et mensualités, ou mensualités fixes. Engagement ferme sur la durée choisie.</p></details>
<details><summary>Il demande une remise</summary><p>« Le tarif partenaire est déjà le geste. Si on doit baisser, on retire quelque chose : par exemple l'option six mois. »</p></details>`;

