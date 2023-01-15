import { diskStorage } from 'multer';
import { join } from 'path';
import { setFileNameWithExt } from './setFileNameWithExt';

export const uploadSettings = () => {
  return diskStorage({
    destination: join('.', 'storage', 'static', 'chatimg'),
    // filename: setFileNameWithExt,
  });
};
