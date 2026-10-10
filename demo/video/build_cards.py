"""Create editable 16:9 quote cards from founder-supplied discovery comments."""
from pathlib import Path
import base64
from html import escape

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
logo=base64.b64encode((ROOT/'prototype/assets/logo.svg').read_bytes()).decode()
cards=[
 ('01-search','THE SEARCH',['Finding a bond’s CUSIP','is such a pain.']),
 ('02-first-step','THE FIRST STEP',['I want to invest in bonds,','but I don’t know','where to start.']),
 ('03-experience','THE EXPERIENCE',['Fidelity’s bond account','is not for me.']),
 ('04-small-amount','THE BUDGET',['I only want to invest','a small amount.','How do I do it?']),
]
for i,(name,label,lines) in enumerate(cards,1):
 y=420
 text=''.join(f'<tspan x="150" y="{y+j*125}">{escape(line)}</tspan>' for j,line in enumerate(lines))
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="Customer discovery quotation {i}">
<rect width="1920" height="1080" fill="#faf9f6"/>
<image href="data:image/svg+xml;base64,{logo}" x="140" y="78" width="330" height="80"/>
<text x="150" y="258" font-family="Arial,sans-serif" font-size="27" font-weight="700" letter-spacing="5" fill="#633ac3">{label}</text>
<text x="110" y="{y-22}" font-family="Georgia,serif" font-size="105" fill="#cabbe4">“</text>
<text font-family="Arial,sans-serif" font-size="94" font-weight="700" letter-spacing="-2" fill="#241b35">{text}</text>
<rect x="150" y="820" width="96" height="7" rx="3.5" fill="#c4e980"/>
<text x="150" y="920" font-family="Arial,sans-serif" font-size="28" fill="#70687b">Customer discovery · Edited for clarity</text>
<text x="1750" y="920" text-anchor="end" font-family="Arial,sans-serif" font-size="28" fill="#70687b">0{i} / 04</text>
</svg>'''
 (HERE/f'{name}.svg').write_text(svg)
(HERE/'05-closing.svg').write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="InCreditble Your first bond At your pace">
<rect width="1920" height="1080" fill="#faf9f6"/>
<image href="data:image/svg+xml;base64,{logo}" x="145" y="95" width="430" height="103"/>
<circle cx="1600" cy="580" r="205" fill="#e6f4cf"/>
<text x="150" y="460" font-family="Arial,sans-serif" font-size="123" font-weight="700" letter-spacing="-3" fill="#241b35">Your first bond.</text>
<text x="150" y="625" font-family="Arial,sans-serif" font-size="123" font-weight="700" letter-spacing="-3" fill="#633ac3">At your pace.</text>
<text x="155" y="770" font-family="Arial,sans-serif" font-size="39" fill="#70687b">Understand the choice. Make it yours.</text>
<text x="155" y="957" font-family="Arial,sans-serif" font-size="27" fill="#70687b">Interactive prototype · Simulated data and trades</text>
</svg>''')
print('Created five editable SVG cards.')
