"""Export only the two public mentor pages from a Limen Astro dev build.

Usage: python telotia-demo/export.py /path/to/Limen/dist
Never copy a whole Limen dist: it also contains unrelated/private preview routes.
"""
from pathlib import Path
import re
import sys
import argparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('dist', type=Path)
parser.add_argument('--page', choices=('intro', 'test'), help='Export one route, preserving the other route and its bundles')
args = parser.parse_args()
source = args.dist.resolve()
root = Path(__file__).resolve().parents[1]
namespace = "/telotia-demo"
pages = {name: (source / f"{name}.html").read_text(encoding="utf-8")
         for name in ((args.page,) if args.page else ("intro", "test"))}
assert all('data-page="pharmacy-intro"' in page for page in pages.values())
pending = set(url for page in pages.values() for url in re.findall(r'/_astro/[^\s"\'<>]+', page))
files = {}
while pending:
    url = pending.pop()
    if url in files:
        continue
    path = source / url.lstrip("/")
    content = path.read_text(encoding="utf-8")
    files[url] = content
    # Follow both root URLs and Vite's relative chunk imports.
    pending.update(re.findall(r'/_astro/[\w.\-]+', content))
    pending.update("/_astro/" + name for name in
                   re.findall(r'["\']\./([\w.\-]+\.(?:js|css))["\']', content))

def rewrite(content):
    return content.replace("/assets/", namespace + "/assets/").replace(
        "/_astro/", namespace + "/bundles/")

for name, content in pages.items():
    target = root / name / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(rewrite(content), encoding="utf-8")
for url, content in files.items():
    target = root / "telotia-demo/bundles" / Path(url).name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(rewrite(content), encoding="utf-8")

# Allowlisted public assets; no private animation, auth worker, or other routes.
assets = list((source / "assets/resource-intro").rglob("*"))
assets += [source / "assets/ink-wash/textures/xuan-paper-generated.jpg"]
for asset in assets:
    if asset.is_file():
        target = root / "telotia-demo" / asset.relative_to(source)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(asset.read_bytes())
print(f"Exported {len(pages)} pages, {len(files)} bundles, and public brand/texture assets.")
