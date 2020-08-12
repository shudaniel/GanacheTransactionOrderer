const CLI = require('clui');
const Configstore = require('configstore');
const Spinner = CLI.Spinner;
const inquirer = require('./inquirer');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const _ = require("lodash");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var options = {
    port: 8545,
    host: "127.0.0.1",
  }

module.exports = {
    popQueue: async () => {
        const index = await inquirer.askForIndex();
        var client = new XMLHttpRequest();
        var method = "eth_popQueue"
        client.open("GET", "http://" + options.host + ":" + options.port + "?method=" + method + "&index=" + index);

        // Set the header
        client.setRequestHeader("content-type", "application/json");
        // payload = {
        //   method: "eth_getQueue",
        // }

        client.onreadystatechange = function () {
            // Request finished. Do processing here.
            if (client.readyState === 4) {
            console.log("Received Respond");
            console.log(client.responseText);
            }
        };
        client.send();
    },
    getQueue: async () => {
        var client = new XMLHttpRequest();
        var method = "eth_getQueue"
        client.open("GET", "http://" + options.host + ":" + options.port + "?method=" + method);

        // Set the header
        client.setRequestHeader("content-type", "application/json");

        client.onreadystatechange = function () {
            // Request finished. Do processing here.
            if (client.readyState === 4) {
                console.log("Received Respond");
                const response = JSON.parse(client.responseText);
                if (response instanceof Array) {
                    for (var i = 0; i < response.length; ++i) {
                        console.log(response[i]);
                    }
                }
                else {
                    console.log("Error. Response is not array:", client.responseText);
                }
            }
        };
        client.send();
    }
}