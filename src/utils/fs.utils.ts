import * as fs from 'fs';
import * as path from 'path';

export const getPath = (filePath: string) => path.join(__dirname, filePath);

export const getFile = (filePath: string) => {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
};

export const writeFile = (filePath: string, data: any) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  return fs.writeFileSync(filePath, data, 'utf8');
};

export const appendFile = (filePath: string, data: any) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  return fs.appendFileSync(filePath, data, 'utf8');
};

export const removeFolder = (folderPath: string) => {
  fs.rmdirSync(getPath(folderPath), { recursive: true });
};
