const { stdin, stdout } = process;
import readline from 'readline';
import os from 'os';

let username = null;
let path = os.homedir();

const readCommand = () => {
  const rl = readline.createInterface(stdin, stdout);
  stdout.write(`You are currently in ${path}\n`);

  rl.on('line', (input) => {
    let command = input.toString();
    if (command === '.exit' || command === 'exit') {
      rl.close();
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
  stdout.write('If you want to stop programm enter "exit" or ".exit" command\n')
  readCommand();
}

main();