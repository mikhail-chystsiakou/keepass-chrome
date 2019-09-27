console.log("extract_login.js loaded");

var extracted_login = document.getElementsByName("username")[0].value;
var extracted_password = document.getElementsByName("password")[0].value;

var msg =  {
    action: "fillLogin",
    login: extracted_login,
    password: extracted_password
};
console.log("extracted login: " + msg.login);

chrome.runtime.sendMessage(msg, function(response) {
    console.log("Message '" + msg.action + "' send, response: " + response);
});