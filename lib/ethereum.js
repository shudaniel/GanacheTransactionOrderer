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
        const answers = await inquirer.askForIndex();
        var client = new XMLHttpRequest();
        var method = "eth_popQueue"
        client.open("GET", "http://" + options.host + ":" + options.port + "?method=" + method + "&index=" + answers.index);

        // Set the header
        client.setRequestHeader("content-type", "application/json");
        // payload = {
        //   method: "eth_getQueue",
        // }

        client.onreadystatechange = function () {
            // Request finished. Do processing here.
            if (client.readyState === 4) {
                console.log("Received Response");
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
                console.log("Received Response");
                // console.log(client.responseText)
                var response = JSON.parse(client.responseText);
                for (var i = 0; i < response.length; i++) {
                    console.log(i, JSON.stringify(response[i], null, 4));
                }
            }
        };
        client.send();
    },
    flipBit: async () => {
        const newbool = await inquirer.flipProcessingBit();
        var method = "eth_flipImmediateProcessing";
        var client = new XMLHttpRequest();
        client.open("GET", "http://" + options.host + ":" + options.port + "?method=" + method + "&flipbit=" + newbool.newbool);
        client.setRequestHeader("content-type", "application/json");

        client.onreadystatechange = function () {
            // Request finished. Do processing here.
            if (client.readyState === 4) {
                console.log("Received Response");
                console.log(client.responseText);
            }
        };
        client.send();
    }
}