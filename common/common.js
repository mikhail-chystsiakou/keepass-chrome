function hello() {
    console.log("Hello");
}

function set_credentials(credentials) {
    chrome.storage.sync.set(credentials);
}

function get_credentials() {
    var data;
    chrome.storage.sync.get(function(credentials) {
        data = {
            login: credentials.login,
            password: credentials.password
        }
    });
    return data;
}