const { stdin, stdout } = process;
import readline from 'readline';

let username = null;

const readCommand = () => {
  const rl = readline.createInterface(stdin, stdout);
  rl.on('line', (input) => {
    let command = input.toString();
    if (command === '.exit' || command === 'exit') {
      rl.close();
    }
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
  readCommand();
}

main();