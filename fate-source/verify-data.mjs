import {Decompress} from 'fzstd';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.argv[2]||'../fate/data';
const manifest=JSON.parse(fs.readFileSync(path.join(root,'WEB-MANIFEST.json'),'utf8'));
if(manifest.files.length!==77)throw Error('Expected 77 years');
for(const row of manifest.files){const bytes=fs.readFileSync(path.join(root,row.file));if(crypto.createHash('sha256').update(bytes).digest('hex')!==row.sha256)throw Error(row.file+' compressed hash mismatch')}
for(const year of [1950,2026]){
 const row=manifest.files.find(f=>f.file===`year-${year}.jsonl.zst`);let n=0;const hash=crypto.createHash('sha256');
 const stream=new Decompress(c=>{hash.update(c);n+=c.length});stream.push(fs.readFileSync(path.join(root,row.file)),true);
 if(n!==row.rawBytes||hash.digest('hex')!==row.rawSha256)throw Error(year+' raw content mismatch');
 console.log(year+' full browser decode matches original, '+n+' bytes');
}
console.log('All 77 compressed hashes verified');
