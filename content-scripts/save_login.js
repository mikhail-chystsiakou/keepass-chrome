console.log("save_login.js loaded");

var extracted_login = document.getElementsByName("username")[0].value;
var extracted_password = document.getElementsByName("password")[0].value;

chrome.runtime.sendMessage(loginData, function(response) {
    console.log("Message send: " + response);
});