"""Build original vector concepts. No reference artwork is copied."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'concepts'
OUT.mkdir(exist_ok=True)
wordmark = json.loads((ROOT / 'wordmark-outlines.json').read_text())
# Round system font outlines to practical SVG precision.
type_paths = re.sub(r'-?\d+\.\d+', lambda m: f'{float(m[0]):.2f}', wordmark['paths'])

def svg(body, title, width=256):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 256" role="img" aria-label="{title}"><title>{title}</title><g fill="#111111">{body}</g></svg>\n'

concepts = {
    'a-in-step': (
        'In step',
        '<path d="M224.23 73.77 L193.11 104.89 A44 44 0 1 0 193.11 167.11 L224.23 198.23 A88 88 0 0 1 104 202.21 C54 230 12 196 12 150 V105 A22 22 0 0 1 56 105 V145 C56 168 68 183 83.51 175.72 A88 88 0 0 1 224.23 73.77 Z"/>'
        '<circle cx="34" cy="47" r="24"/>'),
    'b-cadence': (
        'Cadence',
        '<path d="M48 24 H164 A68 68 0 0 1 232 92 V112 H184 V92 A20 20 0 0 0 164 72 H48 A24 24 0 0 1 48 24 Z"/>'
        '<path d="M208 232 H92 A68 68 0 0 1 24 164 V144 H72 V164 A20 20 0 0 0 92 184 H208 A24 24 0 0 1 208 232 Z"/>'),
    'c-daymark': (
        'Daymark',
        '<path fill-rule="evenodd" d="M80 24 H152 Q168 24 184 40 L224 80 V168 Q224 232 160 232 H88 Q24 232 24 168 V88 Q24 24 80 24 Z M100 104 H144 V184 H100 Z M100 56 H144 V84 H100 Z"/>')
}

for slug, (name, body) in concepts.items():
    (OUT / f'{slug}-v1.svg').write_text(svg(body, f'InCreditble / {name} / concept v1'))
    # Match cap-height weight and keep the name readable beside the symbol.
    scale = 1.72
    width = round(300 + wordmark['width'] * scale + 30)
    lockup = f'<g id="symbol">{body}</g><g id="wordmark" transform="translate(292 177) scale({scale})">{type_paths}</g>'
    (OUT / f'{slug}-lockup-v1.svg').write_text(svg(lockup, f'InCreditble / {name} / concept lockup', width))

print('Built 3 symbol concepts and 3 outlined concept lockups.')
