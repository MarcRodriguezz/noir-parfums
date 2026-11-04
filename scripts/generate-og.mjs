import sharp from 'sharp';

await sharp('src/assets/images/noir-front.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile('public/og-image.jpg');
