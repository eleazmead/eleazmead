import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const galleryDir = 'public/gallery';
const IMAGE_EXTS = /\.(jpg|jpeg|png|webp|gif|avif)$/i;

if (!existsSync(galleryDir)) mkdirSync(galleryDir, { recursive: true });

const files = readdirSync(galleryDir)
  .filter((f) => IMAGE_EXTS.test(f))
  .sort();

writeFileSync(join(galleryDir, 'manifest.json'), JSON.stringify(files, null, 2));
console.log(`gallery manifest: ${files.length} image(s) → ${galleryDir}/manifest.json`);
