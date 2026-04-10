// utils/csv-loader.js
import fs from 'fs';
import path from 'path';

export const loadCsv = (relativePath) => {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const content = fs.readFileSync(fullPath, 'utf-8');

  const [headerLine, ...rows] = content
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const headers = headerLine.split(',').map((h) => h.trim());

  return rows.map((row) => {
    const values = row.split(',').map((v) => v.trim());
    return headers.reduce((obj, key, i) => {
      obj[key] = values[i];
      return obj;
    }, {});
  });
};