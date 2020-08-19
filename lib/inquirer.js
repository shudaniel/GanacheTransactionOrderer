const inquirer = require('inquirer');

module.exports = {
    askForAction: () => {
      const questions = [
          {
            name: 'index',
            type: 'list',
            choices: [ "Get queue", "Pop queue", "Flip processing bit" ],
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
    },
    
    flipProcessingBit: () => {
      const questions = [
        {
          name: 'newbool',
          type: 'list',
          choices: [ "true", "false" ],
          message: 'Choose bool:',
          default: "true",
        }
      ];

      return inquirer.prompt(questions);
    }
    
  };