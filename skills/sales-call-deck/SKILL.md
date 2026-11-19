---
name: sales-call-deck
description: Use when you have a commercial proposal (PDF or offer) and a discovery-call transcript and wants slides to present the offer during a sales or closing call, a deck to screen-share, presenter notes with the prospect's own words, or a closing cheat sheet. Trigger "/sales-call-deck", "fais-moi les slides de l'appel", "présentation pour le closing", "transforme la proposition en présentation".
---

# Présentation d'appel de vente

## Principe

La proposition PDF est le contrat. La présentation est **la vente** : elle rejoue l'appel découverte
avec les mots du client, lui montre sa vision déjà réalisée, et ne dévoile le prix qu'à la fin.
Le client se convainc lui-même. Livrable : **un fichier HTML autonome** avec les slides à partager
et une **vue présentateur** (touche P) sur un deuxième écran : notes par slide avec ses citations
horodatées, questions à poser, antisèche d'objections toujours visible.

## Entrées

| Requis | Optionnel |
|---|---|
| Transcription de l'appel découverte | Catalogue, flyer, site, photos du client |
| Proposition (PDF ou chiffres validés par le vendeur) | Fiche CRM de l'affaire |

Sans transcription, pas de deck : les citations sont le cœur du livrable. Demander le fichier.

## Déroulé

1. **Lire `references/closing.md`**, puis relever dans la transcription, avec horodatage : situation,
   douleurs, LA phrase de vision, objectifs, critères d'achat, seuil de rentabilité, décideurs,
   ce qui lui a déjà été annoncé.
2. **Lire `references/arc.md`** et écrire le plan : une ligne par slide, avec le visuel prévu.
   Le parcours du client = une slide par étape.
3. **Récupérer ses visuels** : `python scripts/extract_pdf_images.py <pdf> <work>/raw`, regarder
   `_sheet.png`, copier les images retenues dans `<work>/img/` sous des noms parlants (ce sont les
   clés `IMG`). Logo client rond si possible.
4. **Écrire `<work>/slides.js`** en partant de `examples/exemple-slides.js` : `DECK`, `SLIDES`
   (`{t, html, notes}`), `OBJECTIONS`. Helpers fournis par le template : `U`, `FOOT`, `URL`, `STEP`,
   `FOOT_COVER`, `mot`, `ask`. Si le client a une couleur de marque nette, la passer en `--accent` au build.
5. **Construire** : `python scripts/build.py --slides <work>/slides.js --img-dir <work>/img --out <livrables>/presentation-<slug>-<AAAA-MM-JJ>.html --title "<Client> · Présentation" [--accent "#3E5565"] [--logo <logo-vendeur.png>]`.
   `<livrables>` = le dossier de livrables du projet (à défaut, le dossier courant). Le logo du vendeur va en pied de page.
6. **Vérifier** : `python scripts/shoot.py <deck.html> <work>/shots`, regarder chaque planche et la
   vue présentateur ; appliquer la relecture de `references/design.md` et le skill `kill-ai-slop`.
   Corriger, reconstruire, recapturer.
7. **Rendre compte** : chemin du fichier, mode d'emploi (F plein écran, P présentateur, ne partager
   que la fenêtre des slides), données d'exemple inventées dans les maquettes, points à vérifier avant l'appel.

`<work>` = le dossier scratchpad de la session. Ne rien publier en ligne : le deck contient les propos du client.

## Ce que la première version ratait (et que ce skill corrige)

| Réflexe | Ce qu'on fait à la place |
|---|---|
| Surtitre en capitales espacées au-dessus de chaque titre | Un titre seul, en casse normale |
| Police cursive ou serif « pour coller à sa marque » | Inter Tight partout ; sa marque passe par ses images |
| Cartes beiges, pastilles colorées, bordures à gauche | Blanc, encre, filets, un accent à 20 % |
| Parcours résumé en une slide de six colonnes de texte | Une slide par étape, texte + écran qu'il verra |
| Maquettes génériques de site et de tableau de bord | Écrans minimalistes avec ses photos, ses produits, ses prix |
| Liste de fonctionnalités sous le prix, étiquette « recommandée » | Bénéfices de transformation ; l'option poussée plus grande, sur fond encre |
| Attribution sous sa citation | La citation seule ; le vendeur la dit à l'oral |
| Une slide qui répète un argument déjà montré dans le parcours | La supprimer |

## Erreurs fréquentes

- Inventer ou reformuler une citation : chaque `mot()` doit se retrouver dans la transcription.
- Un prix ou une modalité qui diffère de la proposition PDF ou de la fourchette annoncée en appel.
- Promettre à l'écran une position Google, un délai ferme ou un chiffre de résultat.
- Oublier les décideurs absents : la slide 1 et l'antisèche doivent les traiter.
