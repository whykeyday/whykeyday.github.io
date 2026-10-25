"""Publish only the two generated index pages and their compiled bundles."""
from pathlib import Path
import shutil
app=Path(__file__).resolve().parent
root=app.parent
for kind in ['art','news']:
    text=(app/'dist'/kind/'index.html').read_text(encoding='utf-8')
    (root/kind/'index.html').write_text(text.replace('/bundles/','/daily-assets/bundles/'),encoding='utf-8')
shutil.copytree(app/'dist/bundles',root/'daily-assets/bundles',dirs_exist_ok=True)
print('Published art/news index pages and compiled bundles; portfolio and mentor demos untouched.')
