import { stat } from 'fs/promises';
import { stdout } from 'process';

export const changeDir = async (yourPath) => {
  try {
    const isDir = (await stat(yourPath)).isDirectory();
    return isDir;
  } catch {
    stdout.write('Operation failed\n');
  }
}
