const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer  = require('./lib/inquirer');
const eth = require('./lib/ethereum');


const run = async () => {
  while (true) {
    const action = await inquirer.askForAction();
    if (action.index === "Get queue") {
      await eth.getQueue();
    }
    else if (action.index === "Pop queue") {
      await eth.popQueue();
    }
    else if (action.index === "Flip processing bit") {
      await eth.flipBit();
    }
  }
};
  

clear(); // Clear screen
console.log(
  chalk.yellow(
    figlet.textSync('T-Orderer', { horizontalLayout: 'full' })
  )
);
run();