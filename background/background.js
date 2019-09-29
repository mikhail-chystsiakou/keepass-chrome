'use strict';

// chrome.runtime.onInstalled.addListener(function() {
//   console.log("background script loaded");
//   hello();
//   chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="orange"'
//   });
// });



// chrome.webNavigation.onCommitted.addListener(function(e) {
//   chrome.storage.sync.get(function(storage) {
//     // if (storage.ask_login && storage.ask_password) {
//         console.log("Need to ask confirmation");
//         chrome.storage.sync.set({
//             ask_login: null,
//             ask_password: null
//         });
//         chrome.tabs.executeScript({
//           file: "content-scripts/save_confirmation.js"
//         });
//     // } else {
//     //     console.log("No need to ask");
//     // }
// });
// });

var backend_server = "http://85.143.11.137:9000";
var secrets_endpoint = backend_server + "/secrets/";

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
        console.log("sending login load request to " + backend_server + "/secrets" + msg.domain);
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