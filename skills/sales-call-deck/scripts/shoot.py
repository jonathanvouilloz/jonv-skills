"""Capture chaque slide (et la vue présentateur) avec Chrome headless, puis fait des planches contact.

Usage :
  python shoot.py <deck.html> <dossier_captures> [nombre_de_slides]

Regarder les planches (sheet_*.png) avant de livrer : texte coupé, maquette vide, image manquante.
"""
import os, pathlib, shutil, subprocess, sys
from PIL import Image

CHROME = (os.environ.get("CHROME_PATH")
          or next((p for p in ("google-chrome", "chromium", "chromium-browser", "chrome") if shutil.which(p)), None)
          or r"C:/Program Files/Google/Chrome/Application/chrome.exe")


def shot(url, path, w, h):
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    f"--window-size={w},{h}", "--virtual-time-budget=7000",
                    f"--screenshot={path}", url], capture_output=True)


def main(deck, out, n=None):
    deck = pathlib.Path(deck).resolve(); out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    url = deck.as_uri()
    n = int(n) if n else deck.read_text(encoding="utf-8").count("{t:\"")
    for old in list(out.glob("s[0-9][0-9].png")) + list(out.glob("sheet_*.png")):
        old.unlink()  # une capture d'un passage précédent fausserait les planches
    for i in range(1, n + 1):
        shot(f"{url}#{i}", out / f"s{i:02d}.png", 1280, 720)
    shot(f"{url}?presenter#{n - 1}", out / "presenter.png", 1400, 850)
    files = sorted(out.glob("s[0-9][0-9].png"))
    for part in range(0, len(files), 9):
        sheet = Image.new("RGB", (3 * 640, 3 * 360), "white")
        for k, f in enumerate(files[part:part + 9]):
            im = Image.open(f).convert("RGB").resize((640, 360))
            sheet.paste(im, ((k % 3) * 640, (k // 3) * 360))
        sheet.save(out / f"sheet_{part // 9 + 1}.png")
    print(f"{len(files)} slides capturées dans {out}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
