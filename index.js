const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const web3 = require('web3');
const files = require('./lib/files');
const inquirer  = require('./lib/inquirer');
const eth = require('./lib/ethereum');
const http = require('http');



const hasOwnProperty = Object.prototype.hasOwnProperty;

function createCORSResponseHeaders(method, requestHeaders) {
  // https://fetch.spec.whatwg.org/#http-requests
  const headers = {};
  const isCORSRequest = hasOwnProperty.call(requestHeaders, "origin");
  if (isCORSRequest) {
    // OPTIONS preflight requests need a little extra treatment
    if (method === "OPTIONS") {
      // we only allow POST requests, so it doesn't matter which method the request is asking for
      headers["Access-Control-Allow-Methods"] = "POST";
      // echo all requested access-control-request-headers back to the response
      if (hasOwnProperty.call(requestHeaders, "access-control-request-headers")) {
        headers["Access-Control-Allow-Headers"] = requestHeaders["access-control-request-headers"];
      }
      // Safari needs Content-Length = 0 for a 204 response otherwise it hangs forever
      // https://github.com/expressjs/cors/pull/121#issue-130260174
      headers["Content-Length"] = 0;

      // Make browsers and compliant clients cache the OPTIONS preflight response for 10
      // minutes (this is the maximum time Chromium allows)
      headers["Access-Control-Max-Age"] = 600; // seconds
    }

    // From the spec: https://fetch.spec.whatwg.org/#http-responses
    // "For a CORS-preflight request, request’s credentials mode is always "omit",
    // but for any subsequent CORS requests it might not be. Support therefore
    // needs to be indicated as part of the HTTP response to the CORS-preflight request as well.", so this
    // header is added to all requests.
    // Additionally, https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials,
    // states that there aren't any HTTP Request headers that indicate you whether or not Request.withCredentials
    // is set. Because web3@1.0.0-beta.35-? always sets `request.withCredentials = true` while Safari requires it be
    // returned even when no credentials are set in the browser this header must always be return on all requests.
    // (I've found that Chrome and Firefox don't actually require the header when credentials aren't set)
    //  Regression Commit: https://github.com/ethereum/web3.js/pull/1722
    //  Open Web3 Issue: https://github.com/ethereum/web3.js/issues/1802
    headers["Access-Control-Allow-Credentials"] = true;

    // From the spec: "It cannot be reliably identified as participating in the CORS protocol
    // as the `Origin` header is also included for all requests whose method is neither
    // `GET` nor `HEAD`."
    // Explicitly set the origin instead of using *, since credentials
    // can't be used in conjunction with *. This will always be set
    /// for valid preflight requests.
    headers["Access-Control-Allow-Origin"] = requestHeaders.origin;
  }
  return headers;
}

function sendResponse(response, statusCode, headers, data) {
  response.writeHead(statusCode, headers);
  response.end(data);
}

const run = async () => {
  var options = {
    port: 8545,
    host: "127.0.0.1",
  }

  var server = http.createServer(function(request, response) {
    var method = request.method;
    var body = [];

    request
      .on("data", function(chunk) {
        body.push(chunk);
      })
      .on("end", function() {
        body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.

        console.log("Body:", body);
        const headers = createCORSResponseHeaders(method, request.headers);

        switch (method) {
          case "POST":
            var payload;
            try {
              payload = JSON.parse(body);
            } catch (e) {
              headers["Content-Type"] = "text/plain";
              sendResponse(response, 400, headers, "400 Bad Request");
              return;
            }

            // Log messages that come into the TestRPC via http
            if (payload instanceof Array) {
              // Batch request
              for (var i = 0; i < payload.length; i++) {
                var item = payload[i];
                console.log(item.method);
              }
            } else {
              console.log(payload.method);
            }

            // http connections do not support subscriptions
            if (payload.method === "eth_subscribe" || payload.method === "eth_unsubscribe") {
              headers["Content-Type"] = "application/json";
              sendResponse(response, 400, headers, "notifications not supported: " + payload.id);
              break;
            }

            provider.send(payload, function(_, result) {
              headers["Content-Type"] = "application/json";
              sendResponse(response, 200, headers, JSON.stringify(result));
            });

            break;
          case "OPTIONS":
            sendResponse(response, 204, headers);
            break;
          default:
            headers["Content-Type"] = "text/plain";
            sendResponse(response, 400, headers, "400 Bad Request");
            break;
        }
      });
  });
  console.log(server);
  server.listen(options, function() {
    console.log("Listening on " + options.host + ":" + options.port);
  });
  
  // const credentials = await eth.createNewTransaction();
  // console.log(credentials);
};
  

clear(); // Clear screen
console.log(
  chalk.yellow(
    figlet.textSync('T-Orderer', { horizontalLayout: 'full' })
  )
);
run();