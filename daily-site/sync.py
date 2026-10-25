"""Sync reviewed public daily output, preserving each article's authored design.

python daily-site/sync.py --library C:/.../Library/knowledge [--seed C:/.../Limen/public/resource]
Then: cd daily-site && npm ci && npm run build && python publish_build.py
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from datetime import date
import argparse, json, re, shutil
from urllib.parse import unquote
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES=True

root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--library',required=True,type=Path)
parser.add_argument('--seed',type=Path)
parser.add_argument('--refresh-images',action='store_true')
args=parser.parse_args()
data=root/'daily-site/src/data/resource-catalog.json'
catalog=json.loads(data.read_text(encoding='utf-8'))

def rewrite(s):
    s=s.replace('/resource/art/','/art/').replace('/resource/news/','/news/').replace('/resource/finance/','/news/')
    s=s.replace('/resource.html','/art/').replace('/favicon.svg?v=8','/daily-assets/favicon.svg')
    # Preserve external provenance/image-source URLs exactly.
    def local(m):
        url=m[3]
        if not re.match(r'^(https?:|data:|//|#)',url):
            url=re.sub(r'\.(?:png|jpe?g)(?=[?#]|$)','.webp',url,flags=re.I)
        return m[1]+m[2]+url+m[2]
    s=re.sub(r'((?:src|href|poster)\s*=\s*)(["\'])(.*?)\2',local,s,flags=re.I)
    def css(m):
        url=m[1].strip('"\' ')
        if url.startswith('file:'):return "local('SimSun')"
        if not re.match(r'^(https?:|data:|//|#)',url):url=re.sub(r'\.(?:png|jpe?g)(?=[?#]|$)','.webp',url,flags=re.I)
        return f'url("{url}")'
    return re.sub(r'url\(([^)]+)\)',css,s,flags=re.I)

def copy_file(pair):
    source,target=pair
    if source.suffix.lower() in ('.jpg','.jpeg','.png'):
        target=target.with_suffix('.webp')
    image=source.suffix.lower() in ('.jpg','.jpeg','.png')
    if target.exists() and target.stat().st_mtime>=source.stat().st_mtime and not (image and args.refresh_images):return
    target.parent.mkdir(parents=True,exist_ok=True)
    if source.suffix.lower() in ('.jpg','.jpeg','.png'):
        with Image.open(source) as im:
            im.thumbnail((1600,1600),Image.Resampling.LANCZOS)
            im.save(target,'WEBP',quality=86,method=4)
    elif source.suffix.lower() in ('.html','.css'):target.write_text(rewrite(source.read_text(encoding='utf-8')),encoding='utf-8')
    else:shutil.copy2(source,target)
    # A stable timestamp makes daily sync incremental and idempotent.
    import os
    os.utime(target,(source.stat().st_atime,source.stat().st_mtime))

def transfer(folder,dest):
    pairs=[(p,dest/p.relative_to(folder)) for p in folder.rglob('*')
           if p.is_file() and p.suffix.lower() in ('.html','.jpg','.jpeg','.png','.webp','.svg','.mp4','.mp3','.ogg','.wav','.woff2','.css','.js')]
    with ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(copy_file,pairs))

class Heading(HTMLParser):
    def __init__(self):super().__init__();self.depth=0;self.parts=[];self.done=False
    def handle_starttag(self,t,a):
        if t=='h1' and not self.done:self.depth=1
    def handle_endtag(self,t):
        if t=='h1' and self.depth:self.depth=0;self.done=True
    def handle_data(self,d):
        if self.depth:self.parts.append(d.strip())

if args.seed:
    for kind in ('art','news'):
        transfer(args.seed/kind,root/kind)
        print('Recovered historical',kind,flush=True)

existing={(x['kind'],x['date']) for x in catalog}
added=[]
for kind,area in [('art','art'),('news','finance')]:
    for locale in sorted((args.library/area).glob('20[0-9][0-9]/[0-1][0-9]/[0-3][0-9]/*/en/index.html')):
        folder=locale.parents[1]
        y,m,d=folder.parts[-4:-1]
        stamp=f'{y}-{m}-{d}'
        if stamp>date.today().isoformat() or (kind,stamp) in existing:continue
        if kind=='news' and folder.name!='daily-news':continue
        if not (folder/'zh/index.html').exists():continue
        # Only publish the public article/card/image allowlist, never source notes,
        # trading accounts, scripts, state, credentials, or private research.
        dest=root/kind/y/m/d/folder.name
        transfer(folder,dest)
        if kind=='art':
            source=next(iter(sorted(dest.glob('source.*'))),None)
            if not source:raise RuntimeError(f'Missing art image: {folder}')
            cover=dest/'cover.webp';shutil.copy2(source,cover)
        else:
            cover=dest/'cover.webp'
            if not cover.exists():
                # Keep the actual first designed card as the thumbnail when PNG
                # export is not available; a generated neutral cover is explicit.
                oldcover=next(iter(sorted((dest/'en').glob('card-*.webp'))),None)
                if oldcover:shutil.copy2(oldcover,cover)
        heading=Heading();heading.feed(locale.read_text(encoding='utf-8'))
        rel='/'+dest.relative_to(root).as_posix()
        cards=[rel+'/en/'+p.name for p in sorted((dest/'en').glob('card-*.webp'))]
        catalog.append(dict(kind=kind,categories=[kind],title=' '.join(heading.parts),date=stamp,dateLabel=date.fromisoformat(stamp).strftime('%b %d, %Y'),folderLabel=f'{y}/{m}/{d}/{folder.name}',href=rel+'/en/index.html',zhHref=rel+'/zh/index.html',image=rel+'/cover.webp',cards=cards))
        existing.add((kind,stamp));added.append(f'{kind} {stamp}')

for x in catalog:
    for key in ('href','zhHref','image'):
        x[key]=rewrite(f'href="{x[key]}"')[6:-1]
    x['cards']=[rewrite(f'href="{p}"')[6:-1] for p in x.get('cards',[])]
# Repair missing dependencies in historical exports from the matching public
# daily article folder. Never traverse outside the public art/finance area.
for kind,area in [('art','art'),('news','finance')]:
    for page in (root/kind).rglob('*.html'):
        text=page.read_text(encoding='utf-8');fixed=rewrite(text)
        if fixed!=text:page.write_text(fixed,encoding='utf-8')
        refs=re.findall(r'(?:src|href|poster)=["\']([^"\']+)',fixed)+re.findall(r'url\(["\']?([^\)"\']+)',fixed)
        for url in refs:
            rel=unquote(url.split('?')[0].split('#')[0])
            if not rel or rel.startswith(('http:','https:','data:','//','#','mailto:','file:')):continue
            target=(root/rel.lstrip('/') if rel.startswith('/') else page.parent/rel).resolve()
            if target.exists():continue
            try:local=target.relative_to(root/kind)
            except ValueError:continue
            origin=(args.library/area/local).resolve()
            try:origin.relative_to((args.library/area).resolve())
            except ValueError:continue
            if not origin.exists() and origin.suffix=='.webp':
                origin=next((origin.with_suffix(ext) for ext in ['.png','.jpg','.jpeg'] if origin.with_suffix(ext).is_file()),origin)
            if origin.is_file() and (origin.suffix.lower() in ('.html','.css','.js','.jpg','.png','.jpeg','.webp','.svg','.ttf','.otf','.woff','.woff2') or origin.name=='index.md'):
                copy_file((origin,target))
# Normalize legacy locale links that were already malformed in old exports.
for kind in ('art','news'):
    for page in (root/kind).rglob('*.html'):
        parts=page.relative_to(root/kind).parts
        if len(parts)<5:continue
        article=root/kind/Path(*parts[:4])
        base='/'+article.relative_to(root).as_posix()
        def fix_href(m):
            url=m[2];rel=unquote(url.split('?')[0].split('#')[0])
            if not rel or rel.startswith(('http:','https:','data:','//','#','mailto:')):return m[0]
            target=root/rel.lstrip('/') if rel.startswith('/') else page.parent/rel
            if target.exists():return m[0]
            match=re.search(r'(en|zh)/(index\.html|cards\.html|$)',rel)
            if match and (article/match[0]).exists():url=base+'/'+match[0]
            elif rel.endswith('_index.md'):url='/'+kind+'/'
            elif rel.endswith('cards.html') and (article/'zh/cards.html').exists():url=base+'/zh/cards.html'
            elif rel.endswith('index.html') and (article/'zh/index.html').exists():url=base+'/zh/index.html'
            elif rel.endswith('index.md'):
                # Public Markdown sidecars were absent for a few legacy locales.
                # Derive a readable text sidecar from the already-public article.
                target.parent.mkdir(parents=True,exist_ok=True)
                public=page.read_text(encoding='utf-8')
                public=re.sub(r'<(?:style|script)\b[^>]*>.*?</(?:style|script)>','',public,flags=re.S|re.I)
                public=re.sub(r'<[^>]+>','\n',public)
                from html import unescape
                target.write_text(unescape(public),encoding='utf-8')
            return 'href='+m[1]+url+m[1]
        text=page.read_text(encoding='utf-8')
        fixed=re.sub(r'href=(["\'])(.*?)\1',fix_href,text)
        if fixed!=text:page.write_text(fixed,encoding='utf-8')
catalog.sort(key=lambda x:(x['date'],x['kind']),reverse=True)
data.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Added:',', '.join(added) or 'none; archive already current',flush=True)
for kind in ('art','news'):
    rows=[x for x in catalog if x['kind']==kind]
    print(kind,len(rows),'entries; latest',rows[0]['date'],flush=True)
