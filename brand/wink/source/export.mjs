import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require(process.env.SHARP_MODULE || 'sharp');
const root=path.resolve(import.meta.dirname,'..');
for(const folder of ['logos','icons','social','templates']){
  for(const name of await fs.readdir(path.join(root,folder))){
    if(!name.endsWith('.svg'))continue;
    const source=path.join(root,folder,name);
    const width=folder==='logos'?(name.includes('symbol')?1024:1800):undefined;
    await sharp(source,{density:72}).resize(width?{width}:{}).png().toFile(source.replace('.svg','.png'));
  }
}
for(const size of [16,32,48,180,192,512]){
  const source=path.join(root,'icons',size<=48?'favicon.svg':'app-icon.svg');
  await sharp(source).resize(size,size).png().toFile(path.join(root,'icons',`icon-${size}.png`));
}
for(const name of ['brand-board','checks/size-proof']){
  await sharp(path.join(root,`${name}.svg`)).png().toFile(path.join(root,`${name}.png`));
}
await fs.writeFile(path.join(root,'icons/site.webmanifest'),JSON.stringify({name:'InCreditble',short_name:'InCreditble',display:'standalone',background_color:'#FFFDF5',theme_color:'#241634',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png'}]},null,2));
console.log('Exported transparent logo PNGs, social/stationery PNGs and web icon sizes.');
