import * as fs from 'fs';
import * as path from 'path';

export const getPath = (filePath: string): string => path.join(__dirname, filePath);

export const getFile = (filePath: string): string => {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
};

export const writeFile = (filePath: string, data: string | Uint8Array): void => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data, 'utf8');
};

export const appendFile = (filePath: string, data: string | Uint8Array): void => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, data, 'utf8');
};

export const removeFolder = (folderPath: string): void => {
  fs.rmdirSync(getPath(folderPath), { recursive: true });
};
