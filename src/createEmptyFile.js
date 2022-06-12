import { writeFile } from 'fs/promises';
import { stdout } from 'process';
import path from 'path';



export const create = async (currPath, filename) => {
  try {
    writeFile(path.join(currPath, filename), '', {encoding: 'utf-8'});
    stdout.write(`File: ${filename} succesfully created!\n`)
  } catch {
    stdout.write('Operation failed');
  }
};