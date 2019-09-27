'use strict';

chrome.runtime.onInstalled.addListener(function() {
  console.log("background script loaded 1");
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg.action == "saveLogin") {
      sendResponse("ok from background");
      console.log("got login: " + msg.login + ", password: " + msg.password);
      console.log("sending login send request to localhost:8087...");


      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:8087', false);
      xhr.send();
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); 
      } else {
        console.log( xhr.responseText ); 
      }
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg.action == "loadLogin") {
      console.log("sending login retrieve request to localhost:8086...");


      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:8086', false);
      xhr.send();
      if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText ); 
        sendResponse("get login operation failed in background: " + xhr.status + ': ' + xhr.statusText );
      } else {
        console.log( xhr.responseText ); 
        var serverResponse = JSON.parse(xhr.responseText);
        msg.login = serverResponse.login;
        msg.password = serverResponse.password;
        sendResponse(msg);
      }
    }
  }
);