const inquirer = require('inquirer');

module.exports = {
    askContractDetails: () => {
      const questions = [
        {
          name: 'address',
          type: 'input',
          message: 'Enter the smart contract address:',
          validate: function( value ) {
            return true;
          }
        },
        {
          name: 'function',
          type: 'input',
          message: 'Enter the function name:',
          validate: function(value) {
            return true;
          }
        },
        {
            name: 'from',
            type: 'input',
            message: 'Enter the address to send the transaction from:',
            validate: function(value) {
              return true;
            }
          },
          {
            name: 'gasPrice',
            type: 'number',
            message: 'Enter the gas price (Optional):',
            default: 1e6,
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                else {
                    return "Must enter a number";
                }
            }
          },
          {
            name: 'gas',
            type: 'number',
            message: 'Enter the gas:',
            default: 50000,
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                else {
                    return "Must enter a number";
                }
            }
          },
          {
            name: 'value',
            type: 'number',
            message: 'Enter the value in wei (Optional):',
            default: 0,
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                else {
                    return "Must enter a number";
                }
            }
          },
      ];
      return inquirer.prompt(questions);
    },

    askSelectFunction: () => {
        const questions = [
            
        ];

        return inquirer.prompt(questions);
    } 

  };