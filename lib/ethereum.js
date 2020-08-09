const CLI = require('clui');
const Configstore = require('configstore');
const Spinner = CLI.Spinner;
const inquirer = require('./inquirer');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);

module.exports = {
    createNewTransaction: async () => {
        const credentials = await inquirer.askContractDetails();
        const status = new Spinner('Saving transaction please wait, please wait...');
        status.start();
        conf.set("test", credentials);
        status.stop();
        return credentials;
    }
}