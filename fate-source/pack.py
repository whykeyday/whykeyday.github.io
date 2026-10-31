import pathlib,json,zstandard as zstd,hashlib,argparse
root=pathlib.Path(__file__).resolve().parent.parent/'fate/data'
parser=argparse.ArgumentParser();parser.add_argument('--source',required=True);args=parser.parse_args()
source=pathlib.Path(args.source)
params=zstd.ZstdCompressionParameters.from_level(6,window_log=25)
files=[]
for p in sorted(source.glob('*.jsonl')):
    target=root/(p.name+'.zst')
    with p.open('rb') as src,target.open('wb') as out:zstd.ZstdCompressor(compression_params=params).copy_stream(src,out)
    with p.open('rb') as src:raw_hash=hashlib.file_digest(src,'sha256').hexdigest()
    files.append({'file':target.name,'rawBytes':p.stat().st_size,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'rawSha256':raw_hash})
    print(target.name,target.stat().st_size,flush=True)
(root/'WEB-MANIFEST.json').write_text(json.dumps({'format':'Zstandard, max window 32 MiB, level 6; unchanged decompressed content','source':'Renhuai123/ziwei-doushu v4.0-13d','files':files},indent=2),encoding='utf8')
print('All 77 browser archives ready',flush=True)
