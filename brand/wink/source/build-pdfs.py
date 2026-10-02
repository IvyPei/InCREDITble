from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
ROOT=Path(__file__).resolve().parents[3]
KIT=ROOT/'brand/wink';OUT=ROOT/'output/pdf';OUT.mkdir(parents=True,exist_ok=True)
INK='#241634';PAPER='#FFFDF5';LIME='#D9FF66';VIOLET='#7445FF'
W,H=612,792

def bg(c,color=PAPER):c.setFillColor(HexColor(color));c.rect(0,0,W,H,fill=1,stroke=0)
def box(c,x,y,w,h,color):c.setFillColor(HexColor(color));c.roundRect(x,y,w,h,12,fill=1,stroke=0)
def t(c,x,y,s,size=12,color=INK,bold=False):c.setFillColor(HexColor(color));c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.drawString(x,y,s)
def p(c,x,y,s,width=516,size=11,color=INK):
 st=ParagraphStyle('p',fontName='Helvetica',fontSize=size,leading=size*1.45,textColor=HexColor(color));q=Paragraph(s,st);_,h=q.wrap(width,700);q.drawOn(c,x,y-h);return y-h

def logo(c,x=45,y=691,w=235,white=False):c.drawImage(str(KIT/'logos'/('increditble-horizontal-white.png' if white else 'increditble-horizontal-ink.png')),x,y,width=w,height=w*256/1100,mask='auto')
def footer(c,page):t(c,48,28,'InCreditble / Product concept / October 2026',8);t(c,550,28,str(page),8)

c=canvas.Canvas(str(OUT/'InCreditble-customer-one-pager.pdf'),pagesize=(W,H));c.setTitle('InCreditble - Your portfolio. Your payday.');bg(c)
box(c,28,468,556,296,LIME);logo(c,y=677)
t(c,48,622,'Your portfolio.',43,bold=True);t(c,48,572,'Your payday.',43,bold=True)
p(c,48,537,'Bond investing. Everyday cash flow.',size=18)
t(c,48,431,'Give your savings a schedule.',23,bold=True)
p(c,48,407,'Explore Treasury and corporate bond portfolios around the life you want to fund. Start with an amount, choose your comfort with risk, and see an estimated after-tax interest equivalent.',size=12)
for y,n,h,d in [(325,'01','Choose an amount.','Try an investment amount and see the capital allocated to bonds and a cash reserve.'),(252,'02','Find your rhythm.','Compare weekly, biweekly, monthly or quarterly interest equivalents. Actual transfers need a funded payment schedule.'),(179,'03','Know the trade-offs.','Review the bonds, taxes and risks. Higher coupons can come with greater risk of loss. Principal returned is not income.')]:
 box(c,48,y-21,35,35,LIME);t(c,56,y-8,n,12,bold=True);t(c,98,y,h,15,bold=True);p(c,98,y-10,d,width=456,size=10.5)
p(c,48,104,'<b>Explore the prototype. Help shape InCreditble.</b> Founded by Ivy Pei, with a background in corporate bond portfolio management.',size=11)
p(c,48,62,'Concept only. Synthetic examples, not live quotes or forecasts. No live investment, account, card or payment service. Investing involves risk; returns and payouts are not guaranteed.',size=8.5)
footer(c,1);c.showPage();c.save()

c=canvas.Canvas(str(OUT/'InCreditble-WINK-brand-guide.pdf'),pagesize=(W,H));c.setTitle('InCreditble - WINK brand guide');bg(c);logo(c)
t(c,48,655,'WINK / The selected identity',30,bold=True)
p(c,48,625,'A tilted rounded square. A crescent eye. A confident smile. An approachable identity for people who want their savings to connect to everyday life.',size=12)
c.drawImage(str(KIT/'brand-board.png'),35,185,width=542,height=379.4,mask='auto')
t(c,48,151,'Your portfolio. Your payday.',23,bold=True)
p(c,48,128,'Write InCreditble; say it like incredible. Descriptor: Bond investing. Everyday cash flow. Supporting line: Give your savings a schedule.',size=11)
p(c,48,73,'Approved direction 02. Use the supplied masters. Historical concepts are not current brand assets.',size=10)
footer(c,1);c.showPage();bg(c);logo(c)
t(c,48,656,'Make it feel like InCreditble.',28,bold=True)
y=620
for heading,body in [
 ('Logo','Use Ink on light surfaces and white on Ink or Violet. Allow clear space equal to 25% of the symbol width. Prefer 32 px or larger; use the small variant for 16-24 px favicons. Horizontal minimum: 160 px. Do not stretch, mirror, redraw or add rotation.'),
 ('Color','Ink #241634. Violet #7445FF. Lime #D9FF66. Paper #FFFDF5. Apricot #FFAA7A. Default to Ink on Paper or Lime, and Paper on Ink. Do not communicate risk with color alone.'),
 ('Type and layout','Outlined Avenir Next Bold wordmark. Templates use Avenir Next with Arial/sans-serif fallbacks. Font software is not included; confirm deployment licensing. Short headlines, generous margins, rounded panels, one idea per graphic.'),
 ('Voice','Warm, clear and a little playful. Say estimated cash flow, explore the prototype, and understand the trade-offs. Never promise guaranteed passive income or imply that higher risk guarantees a higher return.'),
 ('Meaning','Payday means a proposed transfer. Transfers can include interest, existing cash or principal. A weekly display does not mean weekly bond coupons. The 2%-10% demo range is synthetic and is not expected total return.'),
 ('Handoff','SVG masters, transparent PNGs, web icons, seven social layouts, four stationery concepts, landing and email templates, marketing copy and this guide. RGB concept artwork is not printer-ready CMYK production. Email templates require approved sender details and hosted assets before sending.')]:
 t(c,48,y,heading,15,bold=True);y=p(c,48,y-12,body,size=10.5)-23
p(c,48,75,'Discovery-stage identity; no trademark clearance is claimed. No live investing, card or payment service. Pair short marketing assets with their full explanatory captions.',size=9)
footer(c,2);c.showPage();c.save()
print('Created customer one-pager (1 page) and brand guide (2 pages).')
