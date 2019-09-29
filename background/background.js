'use strict';

chrome.storage.sync.clear(function() {
  var error = chrome.runtime.lastError;
  if (error) {
      console.error(error);
  } else {
    console.log("data cleared");
  }
});

var backend_server = "http://127.0.0.1:9000";
// var backend_server = "http://85.143.11.137:9000";
var secrets_endpoint = backend_server + "/";
// var secrets_endpoint = backend_server + "/secrets/";

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg.action == "save_credentials") {
      console.log("sending login save request to " + secrets_endpoint + msg.domain);

      var req = {
        type: "password",
        domain: msg.domain,
        username: msg.login,
        password: msg.password
      };
      console.log("sending message: " + JSON.stringify(req));

      var xhr = new XMLHttpRequest();
      if (req.domain) {
        xhr.open('POST', secrets_endpoint + req.domain, false);
      } else {
        sendResponse({status: "nok"})
      }
      xhr.send(JSON.stringify(req));

      console.log( xhr.status + ': ' + xhr.statusText ); 
      if (xhr.status == 204) {
        sendResponse({status: "ok"});
      } else {
        sendResponse({status: "nok"});
      }
    }
  }
);

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        if (msg.action != "load_credentials") {
            return;
        }
        console.log("sending login load request to " + secrets_endpoint  + msg.domain);
        // var xhr = new XMLHttpRequest();
        // if (msg.domain) {
        //     xhr.open('GET', 'http://localhost:9000/' + msg.domain, true);
        // } else {
        //     xhr.open('GET', 'http://localhost:9000/', true);
        // }
        // xhr.onload = function (e) {
        //     console.log( xhr.responseText ); 
        //     var serverResponse = JSON.parse(xhr.responseText);
        //     msg.login = serverResponse.username;
        //     msg.password = serverResponse.password;
        //     msg.status = "ok";
        //     sendResponse(msg);
        // };
        // xhr.onerror = function (e) {
        //     console.error(xhr.statusText);
        //     msk = {status: "nok"};
        //     sendResponse(msg);
        // };
        // xhr.send(null);

        var xhr = new XMLHttpRequest();
        if (msg.domain) {
            xhr.open('GET', secrets_endpoint + msg.domain, false);
        } else {
            xhr.open('GET', secrets_endpoint, false);
        }
        xhr.send(null);
        if (xhr.status == 200) {
            console.log( xhr.responseText ); 
            var serverResponse = JSON.parse(xhr.responseText);
            var res = {
                login: serverResponse.username,
                password: serverResponse.password,
                status: "ok"
            };
            sendResponse(res);
          } else {
            console.log( xhr.responseText ); 
            var res = {
                status: "nok"
            }
            sendResponse(res);
          }
    }
);