import pathlib,re,subprocess,shutil
root=pathlib.Path(__file__).resolve().parent.parent
assets=root/'fate/assets'
todo=re.findall(r'assets/([A-Za-z0-9_.-]+)',(root/'fate/index.html').read_text(encoding='utf8'))
seen=set()
while todo:
    name=todo.pop()
    if name in seen:continue
    seen.add(name)
    p=assets/name
    assert p.is_file(),p
    if p.suffix=='.js':todo.extend(re.findall(r'(?:Library|reading.worker)-[A-Za-z0-9_-]+\.js',p.read_text(encoding='utf8')))
print('Current compiled files:',sorted(seen))
archive=root/'fate-source/.build-archive';archive.mkdir(exist_ok=True)
for p in assets.iterdir():
    if p.is_file() and p.name not in seen:
        assert p.resolve().is_relative_to(assets.resolve())
        shutil.move(str(p),str(archive/p.name))
subprocess.run(['git','add','--sparse','--','.gitignore','fate-source','fate'],cwd=root,check=True)
