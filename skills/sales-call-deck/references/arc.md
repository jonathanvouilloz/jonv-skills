# L'arc des slides

Environ 15 à 20 slides pour 15 minutes. Chaque slide = **un titre + une phrase + une preuve visuelle**.
Le titre dit l'idée en entier ; s'il faut lire un paragraphe, la slide est ratée.

## Les slides, dans l'ordre

| # | Slide | Ce qu'elle contient | Visuel |
|---|---|---|---|
| 1 | Couverture | Son nom de projet + la promesse en une ligne (« X, en pilote automatique. ») + « Pour <Prénom Nom>. Ce que j'ai compris de votre projet, et ce que je vous propose. » | Sa meilleure photo, pleine hauteur ; son logo |
| 2 | Ce qu'il a construit | « Le produit est prêt. » + 3 faits vrais | Ses vraies photos (catalogue, site, réseaux) |
| 3 | Aujourd'hui | 3-4 de **ses phrases** sur ses outils/process actuels, chacune sous un mot simple (« Les devis ») + la conséquence quand ça grossit | Aucun : ses mots suffisent |
| 4 | Sa phrase | Sa vision verbatim, seule, grande. **Aucune attribution** sous la citation | Aucun |
| 5 | Où il veut aller | 3 objectifs tirés de l'appel | Aucun ou une photo |
| 6 | Première idée du site | Maquette du site à son image (voir design.md) | Maquette |
| 7… | **Le parcours, une étape par slide** | Voir ci-dessous | Une maquette par étape |
| … | Vue d'ensemble | Le tableau de bord du quotidien (« Et chaque matin, votre planning. ») | Maquette |
| … | Chaque besoin spécifique de l'appel | Une slide par besoin exprimé (ex. codes partenaires), montré en interface | Maquette(s) |
| … | Et demain | Ses ambitions futures, déjà prévues par le système ; ce qui est hors proposition est dit comme tel | 3 petites maquettes |
| n-2 | Récap | Tableau « ses mots → ce qu'on met en place », 5-6 lignes | Aucun |
| n-1 | Investissement | Les options (voir ci-dessous) | Aucun |
| n | Prochaines étapes | 4 étapes datées (« Cette semaine », « Semaine 1 »…) | Une vignette par étape |

## Le parcours (le cœur du deck)

Prendre le flux que le client a décrit (souvent : être trouvé → choisir → devis → paiement → agenda →
sa part) et en faire **une slide par étape**, construite avec le helper `STEP(n, titre, phrase, qui, visuel)` :
- à gauche : la progression (traits), le titre, une phrase, et **qui agit** (« Sans vous » / « Votre part ») ;
- à droite : **ce qu'il verra réellement** à cette étape. Exemples :
  - être trouvé → une conversation ChatGPT ou un résultat Google qui le cite ;
  - choisir → la page de choix avec ses vrais produits/photos ;
  - devis → le document reçu, à son logo ;
  - paiement → l'écran de téléphone avec la notification de paiement ;
  - agenda → la semaine avec le nouvel événement surligné ;
  - sa part → la fiche complète qu'il n'a plus qu'à valider.

Un parcours résumé en une seule slide de texte ne fonctionne pas : il ne se projette pas.

## Adapter l'arc au type d'offre

| Si la proposition… | Alors |
|---|---|
| ne contient pas de site public (outil interne, prototype, app métier) | la slide 6 montre **le premier écran de l'outil**, pas un site |
| s'adresse à une organisation avec des rôles (secrétariat, direction, équipe) | le « qui agit » de `STEP` nomme ces rôles (« Corinne complète », « L'outil s'en charge ») au lieu de « Sans vous / Votre part » |
| est une première étape (audit, prototype) d'un projet plus grand | « Et demain » montre la suite **hors proposition**, dite comme telle, sans prix |
| n'a qu'une option | voir le prix ci-dessous |

La couverture utilise `FOOT_COVER()` (le pied de page reste à gauche de la photo).

## Le prix

- Une carte par option. L'option à pousser est **plus grande et en fond encre** ; l'autre plus petite, en blanc. Pas d'étiquette « recommandée ».
- **Une seule option** : une seule carte encre. À côté, seulement si la proposition le mentionne, la suite (« sur devis », sans montant). La valeur barrée n'apparaît que si la proposition en donne une : on n'en invente jamais.
- Sous chaque prix : la valeur barrée en petit, puis **des bénéfices de transformation** (« Vos clients réservent et paient sans vous appeler », « Vous ouvrez votre planning et vous finalisez », « Tout est prêt pour la suite »). Le détail des fonctionnalités va dans les notes, pour répondre si on le demande.
- Les modalités de paiement en petit, en bas de la carte.
- Le prix doit être cohérent avec la proposition PDF et avec la fourchette annoncée pendant l'appel.
