const { stdin, stdout } = process;
import readline from 'readline';
import os from 'os';
import fs from 'fs';
import path from 'path';

let username = null;
let currPath = os.homedir();
const rl = readline.createInterface(stdin, stdout);


const list = (folderPath) => {
  let result = [];
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      stdout.write('Operation failed');
      readCommand();
    };
    result = files.map(file => {
      const stat = fs.lstatSync(path.join(currPath, file));
      return {name: file, 
        type: stat.isDirectory()? 'Directory': 'File',
        size: `${stat.size / 1000}kb`
      }
    });
    console.table(result);
    printCurrentCatalogue();
  });
};

const printCurrentCatalogue = () => {
  stdout.write(`You are currently in ${currPath}\n`);
};

const readCommand = () => {
  printCurrentCatalogue();
  rl.on('line', (input) => {
    let command = input.toString();
    if (command === '.exit' || command === 'exit') {
      rl.close();
    } else if (command === 'ls') {
      list(currPath);
      
    } else if (command === 'test') {
      console.log('this is test command');
    };
  });

  rl.on('SIGINT', () => {
    rl.close();
  });
  rl.on('close', () => {
    stdout.write(`Thank you for using File Manager, ${username? username: 'Anonymous'}!\n`);
    process.exit();
  });
}


const main = async () => {
  const args = process.argv.slice(2);
  username = args.filter(el => el.startsWith('--username=')).join('').slice(11);
  stdout.write(`Welcome to the File Manager, ${username? username: 'Anonymous'}!\n`);
  stdout.write('If you want to stop programm enter "exit" or ".exit" command\n');
  
  readCommand();
}

main();