'use strict';

console.log("popup.js loaded");

document.addEventListener('DOMContentLoaded', function () {
  console.log("page with extract_login.js loaded");
  setupExtractLoginBtnHandler();
  setupSaveLoginBtnHandler();
  setupLoadLoginBtnHandler();
  setupFillLoginBtnHandler();

  chrome.storage.sync.get('loginData', function(loginData) {
      console.log("filling values: " + JSON.stringify(loginData));
      setCurrentLoginPassword({login:  loginData.loginData.login, password:  loginData.loginData.password});
  });
});

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg.action == "fillLogin") {
      console.log("Got message from " + sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
      console.log("got login: " + msg.login + ", password: " + msg.password);
      setCurrentLoginPassword(msg);
      sendResponse("ok from edit_login.js");
    }
  }
);

function getCurrentLoginPassword() {
  var login_field = document.getElementById("loginField");
  var password_field = document.getElementById("passwordField");
  return {
    login: login_field.value,
    password: password_field.value
  };
}

function setCurrentLoginPassword(msg) {
  var login_field = document.getElementById("loginField");
  login_field.value = msg.login;
  var password_field = document.getElementById("passwordField");
  password_field.value = msg.password;

  chrome.storage.sync.set('loginData', msg, function() {
    console.log('current login: ' + msg.login);
    console.log('current password: ' + msg.password);
  });
}

function setupExtractLoginBtnHandler() {
    let extractLoginBtn = document.getElementById('extractLoginBtn');
    console.log("listener added to extractLoginBtn: " + extractLoginBtn);
    extractLoginBtn.addEventListener("click", function(e) {
      console.log("extractLoginBtn clicked");
      chrome.tabs.executeScript({
        file: 'content-scripts/extract_login.js'
      });
    });
}

function setupLoadLoginBtnHandler() {
  let loadLoginBtn = document.getElementById('loadLoginBtn');
  console.log("listener added to loadLoginBtn: " + loadLoginBtn);
  loadLoginBtn.addEventListener("click", function(e) {
    console.log("loadLoginBtn clicked");
    var msg = {action: "loadLogin"};
    chrome.runtime.sendMessage(msg, function(response) {
        console.log("Message '" + msg.action + "' send, response: " + response);
        setCurrentLoginPassword(response);
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


function setupSaveLoginBtnHandler() {
  let saveLoginBtn = document.getElementById('saveLoginBtn');
  console.log("listener added to saveLoginBtn: " + saveLoginBtn);

  saveLoginBtn.addEventListener("click", function(e) {
    console.log("saveLoginBtn clicked");

    var msg = getCurrentLoginPassword();
    msg.action = "saveLogin";
    chrome.runtime.sendMessage(msg, function(response) {
      console.log("Message '" + msg.action + "' send, response: " + response);
    });
  });
}