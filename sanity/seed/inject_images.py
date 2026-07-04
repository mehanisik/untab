#!/usr/bin/env python3
"""Inject local images from sanity/seed/images/<slug>/ into projects.ndjson.

For each project record, look in the folder matching its slug:
  - hero.(jpg|jpeg|png|webp)     -> image (hero)
  - card.(jpg|jpeg|png|webp)     -> cardImage (work/home cards)
  - preview.(mp4|webm)           -> previewVideo (hover media)
  - every other image (sorted)   -> gallery[]

Images are referenced with Sanity's `_sanityAsset` file:// scheme, so the
importer uploads them as real assets. Run before `bun run seed:import`.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
NDJSON = os.path.join(HERE, "projects.ndjson")
IMAGES = os.path.join(HERE, "images")
HERO_STEMS = {"hero", "cover", "main"}
CARD_STEMS = {"card", "work-card", "cover-card"}
PREVIEW_STEMS = {"preview", "hover", "motion"}
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".avif")
VIDEO_EXTS = (".mp4", ".webm")


def asset(path, key=None):
    a = {"_sanityAsset": f"image@file://{path}"}
    if key:
        a["_key"] = key
    return a


def file_asset(path):
    return {"_sanityAsset": f"file@file://{path}"}


def collect(slug):
    folder = os.path.join(IMAGES, slug)
    if not os.path.isdir(folder):
        return None, None, None, []
    files = sorted(
        f for f in os.listdir(folder)
        if f.lower().endswith(EXTS + VIDEO_EXTS) and not f.startswith(".")
    )
    hero = None
    card = None
    preview = None
    gallery = []
    for f in files:
        full = os.path.join(folder, f)
        stem = os.path.splitext(f)[0].lower()
        ext = os.path.splitext(f)[1].lower()
        if hero is None and stem in HERO_STEMS and ext in EXTS:
            hero = full
        elif card is None and stem in CARD_STEMS and ext in EXTS:
            card = full
        elif preview is None and stem in PREVIEW_STEMS and ext in VIDEO_EXTS:
            preview = full
        elif ext in EXTS:
            gallery.append(full)
    # If no explicit hero.*, promote the first file.
    if hero is None and gallery:
        hero = gallery.pop(0)
    return hero, card, preview, gallery


def main():
    records = [json.loads(l) for l in open(NDJSON) if l.strip()]
    wired = 0
    for r in records:
        slug = r.get("slug", {}).get("current")
        if not slug:
            continue
        hero, card, preview, gallery = collect(slug)
        if hero:
            r["image"] = asset(hero)
            wired += 1
        else:
            r.pop("image", None)
        if card:
            r["cardImage"] = asset(card)
        else:
            r.pop("cardImage", None)
        if preview:
            r["previewVideo"] = file_asset(preview)
        else:
            r.pop("previewVideo", None)
        if gallery:
            r["gallery"] = [asset(p, f"g{i+1}") for i, p in enumerate(gallery)]
        else:
            r.pop("gallery", None)
        n = 1 + len(gallery) if hero else 0
        parts = []
        if hero:
            parts.append("hero")
        if card:
            parts.append("card")
        if preview:
            parts.append("preview")
        if gallery:
            parts.append(f"{len(gallery)} gallery")
        print(f"  {slug}: {', '.join(parts) if parts else 'NO IMAGES'}")
    with open(NDJSON, "w") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"\nWired images into {wired}/{len(records)} projects.")
    if wired < len(records):
        print("Projects without images will import with no hero - add files and re-run.")


if __name__ == "__main__":
    main()
