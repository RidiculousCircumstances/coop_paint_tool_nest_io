import sharp from 'sharp';
import { v4 } from 'uuid';

export const transformToWEBP = (file: Express.Multer.File) => {
  return sharp(file.buffer).webp().toBuffer();
};
