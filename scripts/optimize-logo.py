"""Reduce embedded raster layers in the supplied SVG without altering layout."""

from __future__ import annotations

import base64
import io
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
TARGETS = [ROOT / "public/brand/tekton-logo.svg", ROOT / "src/app/icon.svg"]
PATTERN = re.compile(r"data:image/png;base64,([^\"\s]+)")


def optimize(match: re.Match[str]) -> str:
    raw = base64.b64decode(match.group(1))
    with Image.open(io.BytesIO(raw)) as source:
        image = source.resize((512, 512), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        image.save(output, format="PNG", optimize=True, compress_level=9)
    return "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii")


for target in TARGETS:
    source = target.read_text(encoding="utf-8")
    optimized, count = PATTERN.subn(optimize, source)
    if count != 2:
        raise RuntimeError(f"Expected two embedded PNG layers in {target}, found {count}")
    target.write_text(optimized, encoding="utf-8")
    print(f"{target.name}: {len(source):,} -> {len(optimized):,} bytes")
