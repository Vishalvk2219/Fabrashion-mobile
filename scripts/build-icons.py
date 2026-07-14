#!/usr/bin/env python3
"""Regenerate the Material Symbols Rounded icon subset used by the app.

Single source of truth for icons: `design/icon-names.txt`. This script:
  1. merges any names in NEW_ICONS into `design/icon-names.txt` (sorted, deduped),
  2. maps each name -> codepoint via `design/MaterialSymbolsRounded.codepoints`,
  3. instances the Rounded VARIABLE font into 3 static TTFs and subsets each to
     exactly the glyph set the app uses:
        - MaterialSymbolsRounded-Outline.ttf  FILL 0, wght 400  (default)
        - MaterialSymbolsRounded-Fill.ttf     FILL 1, wght 400  (active/selected)
        - MaterialSymbolsRounded-Thin.ttf     FILL 0, wght 300  (nav/chrome)
     all pinned opsz 24, GRAD 0,
  4. rewrites `src/theme/material-icons.ts` (glyph map + IconName union).

The ~15 MB variable source font is NOT committed. Point SRC_FONT at a local copy, or the script
downloads it to a temp cache. Requires: python -m pip install fonttools

Run from the repo root:  python scripts/build-icons.py
"""
from __future__ import annotations
import os, sys, tempfile, urllib.request
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.subset import Subsetter, Options

ROOT = Path(__file__).resolve().parents[1]
NAMES_TXT = ROOT / "design" / "icon-names.txt"
CODEPOINTS = ROOT / "design" / "MaterialSymbolsRounded.codepoints"
FONTS_DIR = ROOT / "assets" / "fonts"
GLYPH_TS = ROOT / "src" / "theme" / "material-icons.ts"

# Variable font (FILL,GRAD,opsz,wght). Override with SRC_FONT=/path/to.ttf
SRC_FONT = os.environ.get("SRC_FONT")
SRC_URL = ("https://github.com/google/material-design-icons/raw/master/variablefont/"
           "MaterialSymbolsRounded%5BFILL,GRAD,opsz,wght%5D.ttf")

# Icons added since the last build (merged into icon-names.txt). Safe to leave populated;
# the merge is idempotent. Back-office (staff/admin) additions — plan 14.
NEW_ICONS = [
    "add_a_photo", "add_box", "badge", "bookmark", "cloud_done", "cloud_sync", "group", "groups",
    "inventory", "inventory_2", "monitoring", "move_up", "person_add", "point_of_sale",
    "qr_code_scanner", "save", "schedule", "shield_person", "space_dashboard", "style",
    "sync_problem", "warning",
]

# The 3 static instances the Icon primitive expects (see src/components/ui/icon.tsx).
VARIANTS = {
    "MaterialSymbolsRounded-Outline.ttf": {"FILL": 0, "wght": 400, "opsz": 24, "GRAD": 0},
    "MaterialSymbolsRounded-Fill.ttf":    {"FILL": 1, "wght": 400, "opsz": 24, "GRAD": 0},
    "MaterialSymbolsRounded-Thin.ttf":    {"FILL": 0, "wght": 300, "opsz": 24, "GRAD": 0},
}


def load_codepoints() -> dict[str, int]:
    m: dict[str, int] = {}
    for line in CODEPOINTS.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        name, hexcp = line.split()
        m[name] = int(hexcp, 16)
    return m


def merge_names() -> list[str]:
    existing = [l.strip() for l in NAMES_TXT.read_text(encoding="utf-8").splitlines() if l.strip()]
    names = sorted(set(existing) | set(NEW_ICONS))
    NAMES_TXT.write_text("\n".join(names) + "\n", encoding="utf-8")
    return names


def src_font_path() -> str:
    if SRC_FONT and Path(SRC_FONT).exists():
        return SRC_FONT
    cache = Path(tempfile.gettempdir()) / "MaterialSymbolsRounded-var.ttf"
    if not cache.exists():
        print(f"downloading variable font -> {cache}")
        urllib.request.urlretrieve(SRC_URL, cache)
    return str(cache)


def build():
    names = merge_names()
    cps = load_codepoints()
    missing = [n for n in names if n not in cps]
    if missing:
        sys.exit(f"ERROR: no codepoint for: {', '.join(missing)}")
    unicodes = sorted({cps[n] for n in names})
    src = src_font_path()
    FONTS_DIR.mkdir(parents=True, exist_ok=True)

    for fname, axes in VARIANTS.items():
        font = TTFont(src)
        instantiateVariableFont(font, axes, inplace=True)
        opts = Options()
        opts.name_IDs = ["*"]
        opts.recalc_bounds = True
        opts.glyph_names = False
        opts.notdef_outline = True
        opts.layout_features = ["*"]
        ss = Subsetter(options=opts)
        ss.populate(unicodes=unicodes)
        ss.subset(font)
        out = FONTS_DIR / fname
        font.save(out)
        print(f"  {fname}: {len(font.getBestCmap())} glyphs, {out.stat().st_size // 1024} KB")

    # Emit the TS glyph map (alphabetical, matching prior generated style).
    lines = [
        "// AUTO-GENERATED from the ANDRÓ design (design/icon-names.txt) by scripts/build-icons.py.",
        "// Do not edit by hand. Material Symbols Rounded codepoints for the icons the app uses.",
        "export const glyphs = {",
    ]
    for n in names:
        lines.append(f"  {n}: 0x{cps[n]:04x},")
    lines.append("} as const;")
    lines.append("")
    lines.append("export type IconName = keyof typeof glyphs;")
    lines.append("")
    GLYPH_TS.write_text("\n".join(lines), encoding="utf-8")
    print(f"  wrote {GLYPH_TS.relative_to(ROOT)} ({len(names)} icons)")


if __name__ == "__main__":
    build()
    print("done.")
