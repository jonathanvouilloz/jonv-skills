# Le contrat de design

Le template (`assets/template.html`) applique déjà ce contrat. Les slides du projet doivent le respecter
avec les classes existantes, sans ajouter de style décoratif.

## Ce que le deck EST

- **Une seule famille : Inter Tight.** Titres en 600, interlettrage légèrement négatif ; texte courant
  17-22 px. La lisibilité en partage d'écran passe avant l'identité du client.
- **Casse normale partout.** Les étiquettes sont de petits mots en minuscule grise (`small`), jamais
  en capitales espacées.
- **Blanc, encre, filets fins.** Fond `#FFF`, texte `#141414`, séparateurs `1px #E7E7E7`.
- **Un seul accent**, pris dans la marque du client (sa couleur ou son produit phare), dans `--accent`.
  Pour mettre en avant : la teinte de l'accent à 20 % (`--tint`) en fond. Rien d'autre n'est coloré.
- **La structure par filets, pas par cartes** : `rule` (filet au-dessus), tableaux à filets, grilles.
- **Son identité vient de ses images** : ses photos, son logo, ses produits. Le logo du vendeur en pied de page (clé `jl`, option `--logo`).
- **Les maquettes ressemblent à de vrais écrans minimalistes** : cadre de navigateur fin (`URL(...)`),
  navigation légère, une photo arrondie avec voile sombre et titre centré pour le site, listes à filets
  pour les documents, tableau de bord blanc avec barre latérale à filet.

## La relecture anti-slop (avant de livrer)

Lancer `kill-ai-slop` sur le fichier `slides.js` + le template, puis vérifier à l'œil sur les planches :

- [ ] aucun surtitre au-dessus des titres, aucun numéro de section décoratif ;
- [ ] aucun texte en capitales espacées ;
- [ ] aucune bordure colorée à gauche, aucune pastille de statut colorée, aucune ombre portée large ;
- [ ] pas de cartes dans des cartes ; pas de grille de cartes arrondies générique ;
- [ ] pas d'attribution sous une citation (« Vous, le 30 octobre ») ;
- [ ] chaque slide de solution a un visuel qui montre le résultat, pas seulement du texte ;
- [ ] les données inventées des maquettes (noms de clients, montants) sont plausibles et signalées comme exemples dans les notes.

Les pilules sont réservées aux **boutons** des maquettes (c'est le langage des sites qu'on imite).
