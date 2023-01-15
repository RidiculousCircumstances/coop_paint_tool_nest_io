import { v4 } from 'uuid';

export const setFileNameWithExt = (ext: string) => {
  return `/${v4()}${ext}`;
};
