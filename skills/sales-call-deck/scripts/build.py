"""Assemble une présentation d'appel de vente en un seul fichier HTML autonome.

Usage :
  python build.py --slides slides.js --img-dir img/ --out livrables/presentation-<slug>-<date>.html --title "Client · Présentation"

- slides.js définit DECK, SLIDES et OBJECTIONS (voir examples/exemple-slides.js).
- Chaque image de --img-dir (jpg, jpeg, png, webp) est intégrée en base64 sous la clé = nom du fichier sans extension.
- Le logo du vendeur (--logo) est injecté sous la clé `jl` ; sans logo, le pied de page n'en affiche pas.
"""
import argparse, base64, json, mimetypes, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
TEMPLATE = HERE.parent / "assets" / "template.html"
# Logo par défaut quand le skill vit dans agent-ops/skills/ ; ailleurs, passer --logo.
DEFAULT_LOGO = HERE.parents[2] / "assets" / "jonlabs-invoice-logo.png"


def data_uri(p: pathlib.Path) -> str:
    mime = mimetypes.guess_type(p.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slides", required=True)
    ap.add_argument("--img-dir", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--title", default="Présentation")
    ap.add_argument("--logo", help="logo du vendeur, en pied de page")
    ap.add_argument("--accent", help="couleur d'accent du client, ex. #3E5565 (défaut : terracotta du template)")
    a = ap.parse_args()

    imgs = {p.stem: data_uri(p) for p in sorted(pathlib.Path(a.img_dir).iterdir())
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}}
    logo = pathlib.Path(a.logo) if a.logo else DEFAULT_LOGO
    if logo.exists():
        imgs["jl"] = data_uri(logo)
    elif a.logo:
        sys.exit(f"logo introuvable : {logo}")

    html = (TEMPLATE.read_text(encoding="utf-8")
            .replace("{{TITLE}}", a.title)
            .replace("{{IMAGES_JSON}}", json.dumps(imgs))
            .replace("{{SLIDES_JS}}", pathlib.Path(a.slides).read_text(encoding="utf-8")))
    if a.accent:
        h = a.accent.lstrip("#")
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
        html = (html.replace("--accent:#B5735F;", f"--accent:#{h};")
                    .replace("--tint:rgba(181,115,95,.20);", f"--tint:rgba({r},{g},{b},.20);"))
    out = pathlib.Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(out, f"{len(html) / 1e6:.2f} MB", f"{len(imgs)} images")


if __name__ == "__main__":
    main()
