"""Récupère les visuels d'un PDF client (catalogue, flyer, plaquette).

Usage :
  python extract_pdf_images.py <fichier.pdf> <dossier_sortie>

Produit :
  - page01.jpg, page02.jpg… : chaque page rendue (fiable même quand les images sont masquées)
  - img_p<page>_<n>.jpg : chaque image intégrée de plus de 300 px (parfois mal découpée : vérifier)
  - _sheet.png : planche contact de tout ce qui a été extrait, à regarder avant de choisir

Les noms sont neutres : renommer ensuite les images retenues avec des clés parlantes
(cover, produit, decor_terracotta…) car ces noms deviennent les clés IMG du deck.
"""
import io, pathlib, sys
import fitz  # PyMuPDF
from PIL import Image, ImageDraw


def main(pdf, out):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    d = fitz.open(pdf)
    for i, page in enumerate(d, 1):
        pm = page.get_pixmap(dpi=130)
        im = Image.open(io.BytesIO(pm.tobytes("png"))).convert("RGB"); im.thumbnail((1200, 1200))
        im.save(out / f"page{i:02d}.jpg", quality=80)
        for j, img in enumerate(page.get_images(full=True)):
            pm = fitz.Pixmap(d, img[0])
            if pm.width < 300 or pm.height < 300:
                continue
            if pm.n > 3:
                pm = fitz.Pixmap(fitz.csRGB, pm)
            im = Image.open(io.BytesIO(pm.tobytes("png"))).convert("RGB"); im.thumbnail((1000, 1000))
            im.save(out / f"img_p{i:02d}_{j}.jpg", quality=78)
    files = sorted(out.glob("*.jpg"))
    W = 6
    sheet = Image.new("RGB", (W * 200, ((len(files) + W - 1) // W) * 222), "white")
    dr = ImageDraw.Draw(sheet)
    for k, f in enumerate(files):
        im = Image.open(f); im.thumbnail((190, 190))
        x, y = (k % W) * 200, (k // W) * 222
        sheet.paste(im, (x, y)); dr.text((x, y + 196), f.name, fill="black")
    sheet.save(out / "_sheet.png")
    print(f"{len(files)} fichiers dans {out} · planche : {out / '_sheet.png'}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
