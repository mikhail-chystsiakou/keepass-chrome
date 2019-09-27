var extracted_login = document.getElementsByName("username")[0].value;
var extracted_password = document.getElementsByName("password")[0].value;

chrome.storage.sync.get('loginData', function(loginData) {
    console.log("filling values: " + JSON.stringify(loginData));

    document.getElementsByName("username")[0].value = loginData.loginData.login;
    document.getElementsByName("password")[0].value = loginData.loginData.password;
});