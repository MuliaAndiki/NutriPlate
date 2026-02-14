import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import path from 'path';
import sharp from 'sharp';
import { env } from '@/config/env.config';

const cloudName = env.CLOUDINARY_CLOUD_NAME!;
const apiKey = env.CLOUDINARY_API_KEY!;
const apiSecret = env.CLOUDINARY_API_SECRET!;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const uploadCloudinary = async (
  buffer: Buffer,
  folder: string,
  originalname: string,
): Promise<{ secure_url: string }> => {
  const ext = path.extname(originalname).toLowerCase();
  const filename = path.basename(originalname, ext);

  const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  const resource_type = isImage ? 'image' : 'raw';

  let finalBuffer = buffer;
  let format = ext.replace('.', '');

  if (isImage) {
    finalBuffer = await sharp(buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    format = 'jpg';
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        public_id: filename,
        format,
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve({ secure_url: result.secure_url });
      },
    );

    Readable.from(finalBuffer).pipe(uploadStream);
  });
};
