const { stdin, stdout } = process;
import readline from 'readline';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { changeDir } from './changeDir.js';

let username = null;
export let currPath = os.homedir();
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

const upLevelPath = () => {
  let probablyPath = currPath.split(path.sep).slice(0, -1).join(path.sep);
  fs.access(probablyPath, (err) => {
    if (err) {
      stdout.write('Operation failed\n');
      printCurrentCatalogue();
    } else {
      currPath = probablyPath;
      printCurrentCatalogue();
    };
  });
}


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
    } else if (command === 'up') {
      upLevelPath();
    } else if (command.startsWith('cd') && command.split(' ').length === 2) {
      let probablyPath = command.split(' ')[1];
      if (path.isAbsolute(probablyPath)) {
        console.log('Path is absolute');
        probablyPath = changeDir(probablyPath);
        currPath = probablyPath? probablyPath: currPath;
      } else {
        console.log('path is relative');
        let res = changeDir(path.join(currPath, probablyPath));
        console.log(res);
        // currPath = probablyPath? probablyPath: currPath;
      };
      printCurrentCatalogue();
    } else if (command.startsWith('os')) {
      let [oscommand, arg] = command.split(' ');
      switch (arg) {
        case "--EOL":
          stdout.write(os.EOL);
          printCurrentCatalogue();
          break;
        case "--cpus":
          let cpuInfo = os.cpus();
          const arch = os.arch();
          cpuInfo = cpuInfo.map(el => {
            return {model: el.model, 
              speed: arch === 'arm64'? el.speed / 10 + 'Ghz': el.speed / 1000 + 'Ghz'
            };
          })
          console.table(cpuInfo)
          printCurrentCatalogue();
          break;
        case "--homedir":
          stdout.write(`Home dirrectory: ${os.homedir()}\n`);
          printCurrentCatalogue();
          break;
        case "--username":
          const userInfo = os.userInfo();
          stdout.write(`Username: ${userInfo.username}\n`)
          printCurrentCatalogue();
          break;
        case "--architecture":
          stdout.write(`CPU architecture: ${os.arch()}\n`);
          printCurrentCatalogue();
          break;
        default:
          stdout.write('Invalid command\n');
          printCurrentCatalogue();
          break;
      }
    } else {
      console.log('Invalid input');
      printCurrentCatalogue();
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