"""Second geometry pass; preserve v1 for comparison."""
from pathlib import Path
import json, re
ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'concepts'
wordmark = json.loads((ROOT / 'wordmark-outlines.json').read_text())
paths = re.sub(r'-?\d+\.\d+', lambda m: f'{float(m[0]):.2f}', wordmark['paths'])

def svg(body, title, width=256):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 256" role="img" aria-label="{title}"><title>{title}</title><g fill="#111111">{body}</g></svg>\n'

for slug, name in [('a-in-step','In step'),('b-cadence','Cadence'),('c-daymark','Daymark')]:
    raw = (OUT / f'{slug}-v1.svg').read_text()
    body = raw.split('<g fill="#111111">',1)[1].rsplit('</g>',1)[0]
    if slug.startswith('a'):
        # Widen the dot/stem gap to 16 units and rebalance the asymmetric footprint.
        body = body.replace('cy="47" r="24"','cy="43" r="22"')
        body = f'<g transform="translate(10 0)">{body}</g>'
    elif slug.startswith('b'):
        # Enlarge the middle opening from 32 to 48 units for a clearer 16px silhouette.
        body = body.replace('V112 H184','V104 H184').replace('V144 H72','V152 H72')
    else:
        # Round the i-dot and widen the counter; preserve a 24-unit gap.
        body = body.replace('M100 104 H144 V184 H100 Z M100 56 H144 V84 H100 Z',
                            'M100 116 H148 V192 H100 Z M124 44 A24 24 0 1 1 124 92 A24 24 0 1 1 124 44 Z')
        body = f'<g transform="translate(4 0)">{body}</g>'
    (OUT / f'{slug}-v2.svg').write_text(svg(body, f'InCreditble / {name} / concept v2'))
    scale = 1.72
    width = round(300 + wordmark['width'] * scale + 30)
    lockup = f'<g id="symbol">{body}</g><g id="wordmark" transform="translate(292 177) scale({scale})">{paths}</g>'
    (OUT / f'{slug}-lockup-v2.svg').write_text(svg(lockup, f'InCreditble / {name} / concept lockup v2',width))
print('Saved the three v2 symbols and lockups.')
