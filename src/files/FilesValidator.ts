import { MulterError } from 'multer';

export interface validatorOptions {
  mimetype: string;
}

export const validateFiles = (req, file, cb, options: validatorOptions) => {
  if (file.mimetype.match(options.mimetype)) {
    cb(null, true);
  } else {
    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  }
};
