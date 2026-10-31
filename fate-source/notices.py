import pathlib
root=pathlib.Path(__file__).resolve().parent
mods=root/'node_modules'
pkgs=[p for p in mods.iterdir() if p.is_dir() and not p.name.startswith('.')]
pkgs=[q for p in pkgs for q in (list(p.iterdir()) if p.name.startswith('@') else [p]) if q.is_dir()]
texts=[]
for p in pkgs:
    for f in p.iterdir():
        if f.is_file() and f.name.lower().startswith(('license','licence','copying')):
            texts.append(p.name+' / '+f.name+'\n'+f.read_text(encoding='utf8',errors='replace'))
(root.parent/'fate/THIRD-PARTY-NOTICES.txt').write_text('\n\n'.join(texts),encoding='utf8')
print(len(texts),'license notices retained')
