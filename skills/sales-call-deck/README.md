# sales-call-deck

**English** | [Français](README.fr.md)

Builds the slides you screen-share during a sales or closing call. It takes the transcript of your discovery call and your commercial proposal, and produces a single self-contained HTML file: the slides for the prospect, plus a presenter view on a second screen with notes for each slide, the prospect's own words with timestamps, questions to ask, and an objection cheat sheet that stays visible.

**It never invents a quote and never publishes anything.** Every quote on screen must be found in the transcript; the deck stays a local file because it contains what the client said.

> The skill's instructions and the generated decks are in **French**.

## Why

The proposal PDF is the contract. The call is where the sale happens. Instead of listing features, the deck replays the discovery call with the client's words, shows their vision already working (one slide per step of their customer journey, with their photos and their prices), and reveals the price only at the end, against the break-even they gave you themselves.

## Install

```bash
npx skills add jonathanvouilloz/jonv-skills --skill sales-call-deck
```

Requirements: Python 3 with `Pillow` and `PyMuPDF`, and Google Chrome or Chromium for the screenshots (set `CHROME_PATH` if it is not on your `PATH`).

## How it works

1. Reads the transcript and pulls out, with timestamps: situation, pains, the vision sentence, goals, buying criteria, break-even, decision makers.
2. Writes the plan from the narrative arc in `references/arc.md`.
3. Extracts the client's images from the proposal PDF (`scripts/extract_pdf_images.py`).
4. Writes `slides.js` from the example, then builds one HTML file with every image embedded (`scripts/build.py`, `--logo` for your logo, `--accent` for the client's colour).
5. Screenshots every slide and the presenter view (`scripts/shoot.py`) and reviews them before you get the file.

In the deck: `F` full screen, `P` presenter view. Share only the slides window.

See the fictional example: [examples/exemple-slides.js](examples/exemple-slides.js).
