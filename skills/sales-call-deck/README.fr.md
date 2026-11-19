# sales-call-deck

[English](README.md) | **Français**

Construit les slides que tu partages à l'écran pendant un appel de vente ou de closing. Il part de la transcription de l'appel découverte et de ta proposition commerciale, et produit un seul fichier HTML autonome : les slides pour le prospect, et une vue présentateur sur un deuxième écran avec les notes de chaque slide, les mots du prospect horodatés, les questions à poser et une antisèche d'objections toujours visible.

**Il n'invente jamais une citation et ne publie rien.** Chaque citation affichée doit se retrouver dans la transcription ; le deck reste un fichier local, parce qu'il contient les propos du client.

## Pourquoi

La proposition PDF est le contrat. La vente se fait pendant l'appel. Au lieu d'aligner des fonctionnalités, le deck rejoue l'appel découverte avec les mots du client, lui montre sa vision déjà en marche (une slide par étape du parcours de ses clients, avec ses photos et ses prix), et ne dévoile le prix qu'à la fin, face au seuil de rentabilité qu'il a lui-même donné.

## Installation

```bash
npx skills add jonathanvouilloz/jonv-skills --skill sales-call-deck
```

Prérequis : Python 3 avec `Pillow` et `PyMuPDF`, et Google Chrome ou Chromium pour les captures (`CHROME_PATH` s'il n'est pas dans le `PATH`).

## Fonctionnement

1. Lit la transcription et relève, avec horodatage : situation, douleurs, la phrase de vision, objectifs, critères d'achat, seuil de rentabilité, décideurs.
2. Écrit le plan selon l'arc de `references/arc.md`.
3. Extrait les images du client depuis la proposition PDF (`scripts/extract_pdf_images.py`).
4. Écrit `slides.js` à partir de l'exemple, puis construit un fichier HTML unique, images intégrées (`scripts/build.py`, `--logo` pour ton logo, `--accent` pour la couleur du client).
5. Capture chaque slide et la vue présentateur (`scripts/shoot.py`) et les relit avant de te rendre le fichier.

Dans le deck : `F` plein écran, `P` vue présentateur. Ne partage que la fenêtre des slides.

Exemple fictif : [examples/exemple-slides.js](examples/exemple-slides.js).
