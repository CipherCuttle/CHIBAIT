import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const manifestPath = path.join(root,'assets','ASSET_MANIFEST.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function pngDimensions(buf) {
  if (buf.length < 24 || buf.toString('ascii',1,4) !== 'PNG') throw new Error('not png');
  return { width:buf.readUInt32BE(16), height:buf.readUInt32BE(20) };
}

let failures = [];

for (const asset of manifest.assets) {
  const file = path.join(root,asset.path);
  if (!fs.existsSync(file)) {
    failures.push(`${asset.path}: missing`);
    continue;
  }
  const buf = fs.readFileSync(file);
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  if (sha !== asset.sha256) failures.push(`${asset.path}: sha256 mismatch`);

  if (asset.path.endsWith('.png')) {
    const dim = pngDimensions(buf);
    if (dim.width !== asset.width || dim.height !== asset.height) {
      failures.push(`${asset.path}: expected ${asset.width}x${asset.height}, got ${dim.width}x${dim.height}`);
    }
  }
}

const mapPath = path.join(root,'assets','maps','slopwater-v1.tmj');
const map = JSON.parse(fs.readFileSync(mapPath,'utf8'));
if (map.tilewidth !== 16 || map.tileheight !== 16) failures.push('map: tile size must be 16x16');
for (const name of ['Water','Shore','Collision','Entities']) {
  if (!map.layers.some(layer => layer.name === name)) failures.push(`map: missing ${name} layer`);
}
const spawn = map.layers.find(l => l.name === 'Entities')?.objects?.filter(o => o.type === 'spawn') ?? [];
if (spawn.length !== 1) failures.push(`map: expected exactly one spawn, got ${spawn.length}`);

if (manifest.visual_target.internal_width !== 384 || manifest.visual_target.internal_height !== 256) {
  failures.push('manifest: visual target must be 384x256');
}

if (failures.length) {
  console.error('ASSET GATE FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log(`ASSET GATE PASS: ${manifest.assets.length} artifacts, map ${map.width}x${map.height}, visual target 384x256`);
