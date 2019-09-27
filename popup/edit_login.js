'use strict';

console.log("popup.js loaded");

document.addEventListener('DOMContentLoaded', function () {
  setupExtractLoginBtnHandler();
  setupSaveLoginBtnHandler();
  setupLoadLoginBtnHandler();
  setupFillLoginBtnHandler();
  setupInputChangeHandlers();
});

function setupExtractLoginBtnHandler() {
  let extractLoginBtn = document.getElementById('extractLoginBtn');
  extractLoginBtn.addEventListener("click", function(e) {
    console.log("extractLoginBtn clicked");
    chrome.tabs.executeScript({
      file: 'content-scripts/extract_login.js'
    });
  });
}

function setupSaveLoginBtnHandler() {
  let saveLoginBtn = document.getElementById('saveLoginBtn');
  saveLoginBtn.addEventListener("click", function(e) {
    console.log("saveLoginBtn clicked");
    chrome.tabs.executeScript({
      code: 'document.domain'
    },
    function(domain) { 
      console.log("got domain from page: " + domain[0]); 
      chrome.storage.sync.get(function(loginData) {

        loginData.action = "saveCredentials";
        loginData.domain = domain[0];
          console.log("savin values to sync: " + JSON.stringify(loginData));

          chrome.runtime.sendMessage(loginData, function(response) {
              console.log("result of saveCredentials: " + JSON.stringify(response));
          });
      });
    });
  });
}

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    console.log("Got message");
    if (msg.action == "setCredentials") {
      console.log("Got message from " + sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
      console.log("got login: " + msg.login + ", password: " + msg.password);
      setCredentials(msg);
      sendResponse("ok from edit_login.js");
    }
  }
);

function getCredentials() {
  var login_field = document.getElementById("loginField");
  var password_field = document.getElementById("passwordField");
  return {
    login: login_field.value,
    password: password_field.value
  };
}

function setCredentials(credentials) {
  var login_field = document.getElementById("loginField");
  login_field.value = credentials.login;
  var password_field = document.getElementById("passwordField");
  password_field.value = credentials.password;
}

function setupLoadLoginBtnHandler() {
  let loadLoginBtn = document.getElementById('loadLoginBtn');
  loadLoginBtn.addEventListener("click", function(e) {
    console.log("loadLoginBtn clicked");
    chrome.tabs.executeScript({
      code: 'document.domain'
    },
    function(domain) { 
      console.log("got domain from page: " + domain[0]); 
      var msg = {action: "loadCredentials"};
      msg.domain = domain[0];
      chrome.runtime.sendMessage(msg, function(response) {
          console.log("saving message: " + JSON.stringify(response));
          setCredentials(response);
          chrome.storage.sync.set(response);
      });
    });
  });
}

function setupFillLoginBtnHandler() {
  let fillLoginBtn = document.getElementById('fillLoginBtn');
  console.log("listener added to fillLoginBtn: " + fillLoginBtn);
  fillLoginBtn.addEventListener("click", function(e) {
    console.log("fillLoginBtn clicked");

    chrome.tabs.executeScript({
      file: 'content-scripts/fill_login.js'
    });
  });
}

function setupInputChangeHandlers() {
  let loginField = document.getElementById('loginField');
  console.log("listened set up on" + loginField);
  loginField.addEventListener("change", function(e) {
    var newCredentials = getCredentials() ;
    console.log("credentials changed to " + JSON.stringify(newCredentials));
    chrome.storage.sync.set(newCredentials);
  });

  loginField.addEventListener("focusout", function(e) {
    var newCredentials = getCredentials() ;
    console.log("credentials changed to " + JSON.stringify(newCredentials));
    chrome.storage.sync.set(newCredentials);
  });


  let passwordField = document.getElementById('passwordField');
  console.log("listened set up on" + passwordField);
  passwordField.addEventListener("change", function(e) {
    var newCredentials = getCredentials() ;
    console.log("credentials changed to " + JSON.stringify(newCredentials));
    chrome.storage.sync.set(newCredentials);
  });
}