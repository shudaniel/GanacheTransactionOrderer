const inquirer = require('inquirer');

module.exports = {
    askForAction: () => {
      const questions = [
          {
            name: 'index',
            type: 'list',
            choices: [ "Get queue", "Pop queue" ],
            message: 'Choose an action:',
            default: "Get queue",
        }
      ];

      return inquirer.prompt(questions);
    },

    askForIndex: () => {
        const questions = [
            {
            name: 'index',
            type: 'number',
            message: 'Enter the index:',
            default: 0,
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                else {
                    return "Must enter a number";
                }
            }
          }
        ];

        return inquirer.prompt(questions);
    } 

  };