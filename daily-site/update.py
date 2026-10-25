"""Daily publication runner; call only in this dedicated clean checkout."""
from pathlib import Path
import argparse, json, shutil, subprocess, sys
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser()
p.add_argument('--library',required=True)
p.add_argument('--push',action='store_true')
args=p.parse_args()
def run(*command,cwd=root):
    subprocess.run(command,cwd=cwd,check=True)
if subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True).strip():
    raise SystemExit('Checkout has pending edits. Review them before automatic publication.')
remote=subprocess.check_output(['git','remote','get-url','origin'],cwd=root,text=True).strip()
if 'whykeyday/whykeyday.github.io' not in remote.lower():
    raise SystemExit('Unexpected publication repository')
run('git','pull','--ff-only','origin','main')
run(sys.executable,str(root/'daily-site/sync.py'),'--library',args.library)
app=root/'daily-site'
if not (app/'node_modules/astro/bin/astro.mjs').exists():
    run(shutil.which('npm.cmd') or 'npm','ci','--ignore-scripts',cwd=app)
run(shutil.which('node') or 'node',str(app/'node_modules/astro/bin/astro.mjs'),'build',cwd=app)
run(sys.executable,str(app/'publish_build.py'))
run(sys.executable,str(app/'validate.py'))
rows=json.loads((app/'src/data/resource-catalog.json').read_text(encoding='utf-8'))
for row in rows:
    for key in ('href','zhHref','image'):
        if not (root/row[key].lstrip('/')).is_file():raise SystemExit(f'Missing {key}: {row[key]}')
if args.push:
    run('git','add','--sparse','art','news','daily-assets','daily-site/src/data/resource-catalog.json')
    if subprocess.run(['git','diff','--cached','--quiet'],cwd=root).returncode:
        run('git','commit','-m','content: update daily art and finance archive')
        run('git','push','origin','main')
    else:print('No new publication changes.')
print(json.dumps({k:max(x['date'] for x in rows if x['kind']==k) for k in ('art','news')}))
