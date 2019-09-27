console.log("save_login.js loaded");

chrome.storage.sync.get(function(loginData) {
    console.log("saving values: " + JSON.stringify(loginData));
    chrome.runtime.sendMessage(loginData, function(response) {
        console.log("Message '" + loginData.action + "' send to domain " + loginData.domain + ", response: " + response);
    });
});