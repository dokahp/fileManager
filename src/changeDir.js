import path from 'path';
import fs from 'fs';
import { stdout } from 'process';


export const changeDir = async (yourPath) => {
  let res = await fs.access(yourPath, () => console.log('Error'))
  return res;
};