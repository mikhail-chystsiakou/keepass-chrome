'use strict';

chrome.runtime.onInstalled.addListener(function() {
  console.log("background script loaded");
});

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg.action == "saveCredentials") {
      sendResponse("ok from background");
      console.log("sending login save request to localhost:9000/" + msg.domain);
      var req = {
        type: "password",
        domain: msg.domain,
        username: msg.login,
        password: msg.password
      };
      console.log("sending message: " + JSON.stringify(req));
      var xhr = new XMLHttpRequest();
      if (req.domain) {
        xhr.open('PUT', 'http://localhost:9000/' + req.domain, false);
      } else {
        xhr.open('PUT', 'http://localhost:9000/', false);
      }
      xhr.send(JSON.stringify(req));
      if (xhr.status != 204) {
        console.log( xhr.status + ': ' + xhr.statusText ); 
      } else {
        console.log( xhr.responseText ); 
      }
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg.action == "loadCredentials") {
      console.log("sending login retrieve request to localhost:9000/" + msg.domain);


      var xhr = new XMLHttpRequest();
      if (msg.domain) {
        xhr.open('GET', 'http://localhost:9000/' + msg.domain, false);
      } else {
        xhr.open('GET', 'http://localhost:9000/', false);
      }
      xhr.send();
      if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText ); 
        sendResponse("get login operation failed in background: " + xhr.status + ': ' + xhr.statusText );
      } else {
        console.log( xhr.responseText ); 
        var serverResponse = JSON.parse(xhr.responseText);
        msg.login = serverResponse.username;
        msg.password = serverResponse.password;
        sendResponse(msg);
      }
    }
  }
);