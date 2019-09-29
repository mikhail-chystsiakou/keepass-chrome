var extracted_login = document.getElementsByName("username")[0].value;
var extracted_password = document.getElementsByName("password")[0].value;

chrome.storage.sync.get(function(loginData) {
    console.log("filling values: " + JSON.stringify(loginData));

    document.getElementsByName("username")[0].value = loginData.login;
    document.getElementsByName("password")[0].value = loginData.password;
    console.log("document.getElementsByName(\"username\")[0].value: " + document.getElementsByName("username")[0].value);
});

// <img id="icon" width="32" src="/home/mich/js/pass/img/key.svg"/>