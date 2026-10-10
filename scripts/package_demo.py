"""Build and check the complete demo ZIP from an explicit file allowlist."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/demo-submission/InCreditble-demo.zip'
FILES = [
    'README.md', 'package.json', 'demo/PACKAGE_CHECK.md',
    'demo/POSITIONING.md', 'demo/PITCH.md', 'demo/LIVE_DEMO.md', 'demo/JUDGE_QA.md',
    'demo/media/bond-matches.jpg', 'demo/media/order-review.jpg',
    'demo/media/welcome.jpg', 'demo/media/portfolio-overview.jpg',
    'demo/media/bond-finder.jpg', 'demo/media/bond-assistant.jpg',
    'demo/media/bond-quotes.jpg', 'demo/media/payment-schedule.jpg',
    'prototype/README.md', 'prototype/index.html', 'prototype/trading.css',
    'prototype/trading.js', 'prototype/bond-matching.js', 'prototype/bond-guide.js',
    'prototype/bond-quotes.js', 'prototype/company-profiles.js',
    'prototype/portfolio-history.js', 'prototype/portfolio-income.js',
    'prototype/demo-session.js', 'prototype/assets/favicon.svg',
    'prototype/assets/logo.svg', 'prototype/assets/wink.svg',
]
FILES += ['demo/deliverables/'+name for name in ['README.md','PITCH_SCRIPT.md','InCreditble-pitch-v4.pptx','InCreditble-demo-v1.mp4','InCreditble-demo-v1.srt']]
FILES += ['demo/video/'+name for name in ['QUOTE_NOTES.md','RECORDING.md','voiceover.txt','captions.srt','scenes.json']]
FILES += ['demo/video/'+name+ext for name in ['01-search','02-first-step','03-experience','04-small-amount','05-closing'] for ext in ['.svg','.png']]
TEXT = {'.md', '.html', '.css', '.js', '.json', '.svg', '.txt', '.srt'}
PATTERNS = {
    'private key': r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    'GitHub token': r'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b',
    'AWS access key': r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b',
    'API key': r'\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b',
    'assigned credential': r'''(?i)(?:api[_-]?key|client[_-]?secret|password|access[_-]?token)\s*[:=]\s*["'][^"']{12,}["']''',
    'local user path': r'/Users/[^/\s]+/',
}
contents = {}
for name in FILES:
    data = (ROOT / name).read_bytes()
    contents[name] = data
    if Path(name).suffix in TEXT:
        for label, pattern in PATTERNS.items():
            if re.search(pattern, data.decode('utf-8')):
                raise SystemExit(f'Review required: {label} pattern in {name}; value suppressed.')

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
    def handle_starttag(self, tag, attrs):
        for k,v in attrs:
            if k in ('src','href') and v:
                self.refs.append(v)

refs = References()
refs.feed(contents['prototype/index.html'].decode())
for ref in refs.refs:
    url = urlsplit(ref)
    if url.scheme or not url.path:
        continue
    name = (Path('prototype') / unquote(url.path)).as_posix()
    if name not in contents:
        raise SystemExit(f'Missing runtime asset: {name}')
for name, data in contents.items():
    if not name.endswith('.md'):
        continue
    for ref in re.findall(r'\]\(([^)]+)\)', data.decode()):
        url = urlsplit(ref)
        if url.scheme or not url.path:
            continue
        target = (ROOT / name).parent / unquote(url.path)
        rel = target.resolve().relative_to(ROOT).as_posix()
        if rel not in contents:
            raise SystemExit(f'Missing document link: {name} -> {rel}')

report = '''# Demo package check

Prepared October 10, 2026. This package contains the current prototype, its local assets, the submission README, pitch, live guide, judge Q&A, positioning notes, eight actual prototype screenshots the customer-led video recording materials, the final 2:58 video and the latest editable 10-slide PowerPoint with its speaker script.

## Checks

- Every local script, stylesheet and image referenced by the entry HTML is present.
- Relative Markdown links resolve within the package.
- Selected text files were scanned for private-key headers, common GitHub/AWS/API tokens, assigned credentials and local user paths; none of those patterns were found.
- The ZIP is built from an explicit allowlist. It excludes Git history, environment files, local agent tools, research notes, personal business materials, old payday code and the supplied requirements document.
- ZIP CRC integrity and file hashes are checked after creation. MANIFEST.sha256 records payload checksums.

## Scope and access

A pattern scan is not a guarantee that a repository is safe to publish. The full working repository and Git history are not included in this audit. The final video and PowerPoint are included. This package does not deploy a website or change repository visibility. Reviewers need repository access or a separately shared download. The video uses a screenshot montage and synthetic English narration.

The prototype uses fictional data and local deterministic explanations. No API keys are required.
'''
(ROOT / 'demo/PACKAGE_CHECK.md').write_text(report)
contents['demo/PACKAGE_CHECK.md'] = report.encode()
manifest = ''.join(f'{hashlib.sha256(data).hexdigest()}  {name}\n' for name,data in sorted(contents.items()))
contents['MANIFEST.sha256'] = manifest.encode()
OUT.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(OUT,'w',ZIP_DEFLATED) as z:
    for name,data in sorted(contents.items()):
        z.writestr('InCreditble-demo/'+name,data)
with ZipFile(OUT) as z:
    assert z.testzip() is None
    for name,data in contents.items():
        assert z.read('InCreditble-demo/'+name) == data
print(f'Packaged {len(contents)} files, {OUT.stat().st_size:,} bytes')
print('Asset references, Markdown links, selected credential patterns, ZIP integrity and hashes passed.')
print(OUT)

release = ROOT / 'demo/releases/InCreditble-demo.zip'
release.parent.mkdir(parents=True, exist_ok=True)
import shutil
shutil.copy2(OUT, release)
print(release)
