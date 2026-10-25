"""Check the published archive's real article, card and design dependencies."""
from pathlib import Path
from urllib.parse import unquote
import json,re
root=Path(__file__).resolve().parents[1]
rows=json.loads((root/'daily-site/src/data/resource-catalog.json').read_text(encoding='utf-8'))
errors=[]
for row in rows:
    for url in [row['href'],row['zhHref'],row['image'],*row.get('cards',[])]:
        if not (root/url.lstrip('/')).is_file():errors.append(f'Catalog: {url}')
for kind in ('art','news'):
    for page in (root/kind).rglob('*.html'):
        text=page.read_text(encoding='utf-8')
        refs=re.findall(r'(?:src|href|poster)=["\']([^"\']+)',text)+re.findall(r'url\(["\']?([^\)"\']+)',text)
        for url in refs:
            rel=unquote(url.split('?')[0].split('#')[0])
            if not rel or rel.startswith(('http:','https:','data:','//','#','mailto:','file:','javascript:')):continue
            target=root/rel.lstrip('/') if rel.startswith('/') else page.parent/rel
            if not target.exists():errors.append(f'{page.relative_to(root)}: {url}')
size=sum(p.stat().st_size for name in ['art','news','daily-assets'] for p in (root/name).rglob('*') if p.is_file())
if size>300*1024**2:errors.append('Archive exceeds its 300 MiB share of the portfolio Pages budget')
if errors:raise SystemExit('\n'.join(errors))
print(f'{len(rows)} bilingual entries; all local article/card/design links valid; archive {size/1024**2:.1f} MiB.')
