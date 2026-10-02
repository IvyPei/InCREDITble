"""Build the selected WINK identity as portable vector artwork and editable layouts."""
from pathlib import Path
import json, re, html, shutil

ROOT = Path(__file__).resolve().parents[1]
INK, VIOLET, LIME, PAPER, APRICOT = '#241634','#7445FF','#D9FF66','#FFFDF5','#FFAA7A'
BODY = 'M80 30 H180 C215 30 228 50 228 85 V177 C228 213 207 229 173 229 H78 C43 229 26 211 26 178 V89 C26 51 43 30 80 30 Z'
EYE = 'M157 67 C123 67 109 92 117 115 C125 139 152 146 171 132 C181 125 187 114 187 103 C165 113 146 94 157 67 Z'
SMILE = 'M81 160 C85 155 91 155 96 161 C110 177 132 182 154 176 C161 174 168 178 170 184 C172 191 168 197 161 199 C130 207 98 197 79 176 C74 170 75 164 81 160 Z'
SMALL_EYE = 'M156 62 C119 62 104 89 114 115 C123 140 153 147 174 131 C185 123 192 110 192 97 C167 110 145 90 156 62 Z'

def mark(color=INK, small=False, reverse=False):
    # Cutouts are real holes in a compound path, not background-colored overlays.
    eye = SMALL_EYE if small else EYE
    if reverse:
        # Slightly enlarged holes compensate for the perceived weight of light marks.
        eye = SMALL_EYE
    return f'<g transform="rotate(-15 128 128)"><path fill="{color}" fill-rule="evenodd" d="{BODY} {eye} {SMILE}"/></g>'

wm = json.loads((ROOT/'source/wordmark-outlines.json').read_text())
TYPE = re.sub(r'-?\d+\.\d+', lambda m:f'{float(m[0]):.2f}', wm['paths'])
TYPE_W = wm['width']
def word(x,y,scale=1,color=INK):
    return f'<g fill="{color}" transform="translate({x} {y}) scale({scale})">{TYPE}</g>'
def logo(x=0,y=0,width=500,color=INK):
    return f'<g transform="translate({x} {y}) scale({width/1100})">'+mark(color,reverse=color in (PAPER,"#FFFFFF"))+word(285,177,1.65,color)+'</g>'
def svg(body,w,h,title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(title)}"><title>{html.escape(title)}</title>{body}</svg>\n'
def write(path,body,w,h,title):
    p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(svg(body,w,h,title))
def text(x,y,value,size=28,color=INK,weight=500):
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="Avenir Next, Arial, sans-serif" font-size="{size}" font-weight="{weight}">{html.escape(value)}</text>'
def rect(x,y,w,h,c,rx=0):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{c}"/>'
def lines(x,y,items,size=72,color=INK,step=None):
    return ''.join(text(x,y+i*(step or size*1.06),s,size,color,800) for i,s in enumerate(items))
def pose(x,y,size,color=INK):return f'<g transform="translate({x} {y}) scale({size/256})">{mark(color,small=size<=32,reverse=color in (PAPER,"#FFFFFF"))}</g>'

for name,c in [('ink',INK),('violet',VIOLET),('black','#000000'),('white','#FFFFFF')]:
    write(f'logos/wink-symbol-{name}.svg',mark(c,reverse=name=='white'),256,256,'InCreditble WINK symbol')
    write(f'logos/increditble-horizontal-{name}.svg',logo(width=1100,color=c),1100,256,'InCreditble')
    write(f'logos/increditble-wordmark-{name}.svg',word(10,76,1,c),round(TYPE_W+20),96,'InCreditble wordmark')
    write(f'logos/increditble-stacked-{name}.svg',pose(182,20,256,c)+word(28,350,1.15,c),620,400,'InCreditble stacked logo')
write('logos/wink-symbol-small.svg',mark(INK,small=True),256,256,'InCreditble small WINK symbol')
write('icons/app-icon.svg',rect(0,0,1024,1024,LIME)+pose(132,132,760),1024,1024,'InCreditble app icon')
write('icons/avatar.svg',f'<circle cx="256" cy="256" r="256" fill="{LIME}"/>'+pose(88,88,336),512,512,'InCreditble avatar')
write('icons/favicon.svg',mark(INK,small=True),256,256,'InCreditble')
tokens={'ink':INK,'violet':VIOLET,'lime':LIME,'paper':PAPER,'apricot':APRICOT}
(ROOT/'tokens.json').write_text(json.dumps(tokens,indent=2)+'\n')
(ROOT/'tokens.css').write_text(':root{'+''.join(f'--brand-{k}:{v};' for k,v in tokens.items())+'--brand-font:"Avenir Next",Arial,sans-serif;}\n')

# Social templates: no invented yield, traction, or account functionality.
caption='Product concept. Investing involves risk. Payouts are not guaranteed.'
b=rect(0,0,1080,1080,LIME)+logo(60,50,430)+lines(60,350,['Your portfolio.','Your payday.'],94)+pose(632,558,340)+text(60,716,'Bond investing.',36)+text(60,766,'Everyday cash flow.',36)+text(60,948,'EXPLORE THE PROTOTYPE',24,INK,800)+text(60,1020,caption,18)
write('social/square-payday.svg',b,1080,1080,'Your portfolio. Your payday. Social concept')
b=rect(0,0,1080,1350,PAPER)+logo(64,58,420)+lines(64,328,['Give your savings','a schedule.'],83)+pose(670,510,295,VIOLET)
for i,(h,d) in enumerate([('01  Choose your cash-flow goal.','Start with your life and what you want to spend.'),('02  Explore a bond portfolio.','See estimated income, principal use, and risks.'),('03  Understand your plan.','Compare alternatives before making a decision.')]):
    y=690+i*153;b+=text(64,y,h,31,INK,750)+text(64,y+47,d,24)
b+=text(64,1250,'Help shape InCreditble.',30,INK,800)+text(64,1300,caption,18)
write('social/portrait-how-it-works.svg',b,1080,1350,'How InCreditble works - concept')
b=rect(0,0,1080,1920,VIOLET)+logo(70,235,480,PAPER)+lines(70,630,['A little more','life in your','money plans.'],88,PAPER)+pose(243,980,600,LIME)+text(70,1610,'Explore the InCreditble prototype.',31,PAPER,700)+text(70,1680,'Planned cash flow. Clear trade-offs.',28,PAPER)+text(70,1750,'Concept only. Investing involves risk.',24,PAPER)
write('social/story-life.svg',b,1080,1920,'InCreditble story concept')
b=rect(0,0,1200,630,INK)+logo(54,42,400,PAPER)+lines(54,290,['Your portfolio.','Your payday.'],76,PAPER)+pose(855,180,285,LIME)+text(54,498,'Bond investing. Everyday cash flow.',30,PAPER)+text(54,582,'Interactive concept. No live investment or payment service.',19,PAPER)
write('social/linkedin-banner.svg',b,1200,630,'InCreditble landscape campaign')
for i,(headline,sub) in enumerate([(['A payout is not','always income.'],['A transfer can include interest, existing cash,','and returned or spent principal.']),(['Know what','you are spending.'],['See estimated interest and principal separately.','Your payout goal may need to change.']),(['Start with','your own rhythm.'],['Choose your rhythm. See the trade-offs.','Explore the choices in our prototype.'])],1):
    b=rect(0,0,1080,1080,PAPER if i!=2 else LIME)+logo(60,50,420)+text(930,116,f'0{i}',35)+lines(60,360,headline,85)+pose(782,590,205)+lines(60,760,sub,29,INK,43)+text(60,1015,caption,18)
    write(f'social/carousel-0{i}.svg',b,1080,1080,f'InCreditble education carousel {i}')

# Card/stationery are artwork concepts, not representations of issued products.
b=rect(0,0,1000,630,INK,44)+logo(62,48,450,PAPER)+pose(616,210,310,LIME)+text(64,389,'YOUR PORTFOLIO.',26,PAPER,650)+text(64,429,'YOUR PAYDAY.',26,PAPER,650)+text(64,556,'CASH CARD / DESIGN CONCEPT',19,PAPER)+text(64,594,'No issuing bank or payment network selected.',15,PAPER)
write('templates/card-concept.svg',b,1000,630,'InCreditble cash-card design concept')
b=rect(0,0,1050,600,LIME)+logo(55,52,460)+text(60,362,'Ivy Pei',55,INK,750)+text(62,409,'Founder',27)+text(62,532,'Bond investing. Everyday cash flow.',27)+pose(767,306,230)
write('templates/founder-card.svg',b,1050,600,'Ivy Pei founder card - contact-free concept')
b=rect(0,0,1600,900,INK)+logo(90,68,460,PAPER)+lines(90,420,['Your portfolio.','Your payday.'],116,PAPER)+pose(1120,279,370,LIME)+text(90,786,'InCreditble  /  Product concept',29,PAPER)
write('templates/presentation-cover.svg',b,1600,900,'InCreditble presentation cover')
b=rect(0,0,1200,1600,PAPER)+logo(80,55,420)+text(80,355,'[Your headline]',62,INK,700)+text(80,430,'[Your message goes here]',27)+text(80,1480,'InCreditble / Bond investing. Everyday cash flow.',22)+pose(925,1340,185,VIOLET)
write('templates/letterhead.svg',b,1200,1600,'InCreditble editable letterhead template')

# Review board; all marks reuse the exact master geometry.
b=rect(0,0,1600,1120,PAPER)+text(55,65,'InCreditble / WINK brand kit',32,INK,750)
b+=rect(50,110,960,450,LIME,28)+logo(95,258,850)+text(100,495,'Your portfolio. Your payday.',32)
b+=rect(1040,110,510,450,INK,28)+pose(1167,186,256,PAPER)+text(1095,505,'ONE EXPRESSION. MANY PLACES.',18,PAPER)
b+=rect(50,590,480,350,VIOLET,28)+pose(206,620,160,PAPER)+text(91,846,'Give your savings',32,PAPER,750)+text(91,888,'a schedule.',32,PAPER,750)
b+=rect(555,590,480,350,INK,28)+logo(587,626,350,PAPER)+pose(834,734,165,LIME)+text(594,826,'CASH CARD',24,PAPER,700)+text(594,870,'DESIGN CONCEPT',17,PAPER)
b+=rect(1060,590,490,350,LIME,28)+pose(1220,650,170)+text(1104,886,'App icon / Avatar / Favicon',23)
for i,(n,c) in enumerate(tokens.items()):
    x=55+i*310;b+=rect(x,980,285,65,c,12)+text(x,1080,f'{n.upper()}  {c}',18)
write('brand-board.svg',b,1600,1120,'InCreditble selected WINK identity and applications')

# Measured small-size proof and reversal, not generated mockups.
b=rect(0,0,1200,650,PAPER)+text(30,42,'WINK / Small-size and background proof',25)
for i,size in enumerate([16,24,32,48,64,128]):
    x=30+i*165;b+=pose(x,90,size)+text(x,250,f'{size}px',18)
b+=rect(30,300,360,300,INK)+pose(91,325,240,PAPER)+rect(420,300,360,300,VIOLET)+pose(481,325,240,PAPER)+rect(810,300,360,300,LIME)+pose(871,325,240)
write('checks/size-proof.svg',b,1200,650,'WINK actual pixel-size proof')
print('Built logo masters, seven social templates, four stationery templates, and proofs.')
