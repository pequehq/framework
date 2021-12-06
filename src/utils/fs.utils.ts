import * as path from 'path';
import * as fs from 'fs';

export const getPath = (filePath: string) => path.join(__dirname, filePath);

export const getFile = (filePath: string) => {
  return fs.readFileSync(
    path.join(__dirname, filePath),
    'utf8'
  );
}

export const writeFile = (filePath: string, data: any) => {
  const fullFilePath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });
  return fs.writeFileSync(
    fullFilePath,
    data,
    'utf8'
  );
}

export const appendFile = (filePath: string, data: any) => {
  const fullFilePath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });
  return fs.appendFileSync(
    fullFilePath,
    data,
    'utf8'
  );
}
