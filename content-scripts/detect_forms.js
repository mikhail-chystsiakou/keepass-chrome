// if (detect_login_input()) {
//     if (detect_password_input()) {
//         load_credentials();
//         if (detect_submit_button()) {
//             console.log("calling setup_submit_button_handler");
//             setup_submit_button_handler();
//         }
//     }
// }
credentials_updated_confirmation();

var login_input = detect_login_input();
var password_input = detect_password_input();
var submit_button = detect_submit_button();
if (submit_button) {
    console.log("submit button found, adding handler");
    setup_submit_button_handler(submit_button);
}
load_credentials();


// + 1. get domain
// + 2. load password for domain
// ? 3. find login
// ? 4. find password
// ? 5. find button
// 6. setup handlers for button and key

function credentials_updated_confirmation() {
    chrome.storage.sync.get(function(storage) {
        if (storage.ask_login && storage.ask_password) {
            console.log("Need to ask confirmation (detect forms)");
            document.getElementsByTagName("body")[0].insertAdjacentHTML('afterbegin', confirmation_html);
            
            console.log("popup loaded");
            var popup = document.getElementById("confirmationPopup");
            console.log("popup object: " + popup);
                with (popup.style) {
                    right = "20px";
            }
            var popup_yes_button = document.getElementById("keepass__confirmation_yes");
            popup_yes_button.onclick = function() {
                console.log("login update confirmed");
                popup.style.display = "none";
                
                var new_credentials = {
                    login: storage.ask_login,
                    password: storage.ask_password,
                    domain: storage.ask_domain
                }
                save_credentials(new_credentials);

                chrome.storage.sync.set({
                    login: storage.ask_login,
                    password: storage.ask_password
                }, function() {
                    chrome.storage.sync.set({
                        ask_login: null,
                        ask_password: null
                    });
                });
            }
            var popup_no_button = document.getElementById("keepass__confirmation_no");
            popup_no_button.onclick = function() {
                console.log("login update confirmed");
                popup.style.display = "none";
                chrome.storage.sync.set({
                    ask_login: null,
                    ask_password: null
                });
            }
            
        } else {
            console.log("No need to ask");
        }
    });
}


function detect_login_input() {
    console.log("detecting login input");
    var login_input = document.getElementsByName("username")[0];
    if (login_input) {
        console.log("login input detected");
    //     chrome.storage.sync.get(function(credentials) {
    //         console.log("credentials[login]: " + credentials.login);
    //         login_input.value = credentials.login;
    //         chrome.storage.sync.set(
    //             { login_input: login_input.id }, 
    //             callback
    //         );
    //     });
    }
    return login_input;
}

function detect_password_input() {
    console.log("detecting password input");
    var password_input = document.getElementsByName("password")[0];
    if (password_input) {
        console.log("password input detected");
        // chrome.storage.sync.get(function(credentials) {
        //     console.log("credentials[password]: " + credentials.login);
        //     password_input.value = credentials.password;
        //     chrome.storage.sync.set(
        //         { password_input: password_input }, 
        //         callback
        //     );
        // });
    }
    return password_input;
}

function detect_submit_button() {
    console.log("detecting login button");
    var submit_button = document.getElementById("signupSubmit");
    if (submit_button) {
        console.log("submit button detected: " + submit_button.id);
        return submit_button;
    }
    var submit_button = document.getElementById("loginSubmit");
    if (submit_button) {
        console.log("submit button detected: " + submit_button.id);
        return submit_button;
    }
    return submit_button;
}

function setup_submit_button_handler(submit_button) {
    submit_button.addEventListener("click", function(e) {
        var current_credentials = extract_credentials();
        var domain = get_domain();
        console.log("submit button clicked, saving login/password: " + JSON.stringify(current_credentials));
        console.log("on page login: " + login_input.value + ", password: " + password_input.value);
        chrome.storage.sync.get(function(credentials) {
            console.log("current_credentials: " + credentials.login + ", password: " + credentials.password);
        });
        // chrome.storage.sync.get(function(credentials) {
        //     console.log("credentials[login]: " + credentials.login);
        //     login_input.value = credentials.login;
        //     chrome.storage.sync.set(
        //         { login_input: login_input.id }, 
        //         callback
        //     );
        // });


        chrome.storage.sync.get(function(credentials) {
            console.log("current_credentials: " + credentials.login + ", password: " + credentials.password + " for domain " + domain);

            if (!(credentials.login) || !(credentials.password)
                || (credentials.login != login_input.value)
                || (credentials.password != password_input.value)) {
                    console.log("credentials updated, will ask, domain: " + domain);
                    chrome.storage.sync.set({
                            ask_login: login_input.value,
                            ask_password: password_input.value,
                            ask_domain: domain
                        }
                    );
                }
        });
        // alert("Clicked!");
        
        // var login = storage.login_input.value;
        // var password = storage.passowrd_input.value;
        // console.log("extracted login: " + login + ", password: " + password);
    });
}

function extract_credentials() {
    return {
        login: login_input.value,
        password: password_input.value
    }
}

// function setup_submit_button_handler() {
//     chrome.storage.sync.get(function(storage) {
//         for (key in storage) {
//             console.log("storage key: " + key + ", value: " + storage[key]);
//             if (key = "submit_button") {
//                 for (key2 in storage[key]) {

//                     console.log("submit button key: " + key2 + ", value: " + storage[key][key2]);
//                 }
//             }
//         }
//         console.log("data loaded from storage");
//         var submit_button = storage.submit_button;
//         console.log("adding listener to " + submit_button.id);
//         submit_button.addEventListener(function(e) {
//             console.log("submit button clicked, saving login/password");
//             var login = storage.login_input.value;
//             var password = storage.passowrd_input.value;
//             console.log("extracted login: " + login + ", password: " + password);

//             save_credentials({
//                 login: login,
//                 password: password
//             });
//         });
//         console.log("handler set for submit button");
//     });
// }

function load_credentials() {
    if (!login_input || !password_input) {
        return;
    }
    var msg = {
        action: "load_credentials",
        domain: get_domain()
    };
    console.log("trying to load credentials: " + JSON.stringify(msg));
    
    chrome.runtime.sendMessage(msg, function(response) {
        if (response.status == "ok") {
            var credentials = {
                domain: msg.domain,
                login: response.login,
                password: response.password
            };
            console.log("credentials loaded: " + JSON.stringify(credentials));
            if (login_input && password_input) {
                chrome.storage.sync.set(credentials, function() {
                    login_input.value = credentials.login;
                    password_input.value = credentials.password;

                    login_input.dispatchEvent(new Event("focus"));
                    login_input.dispatchEvent(new Event("change"));
                    password_input.dispatchEvent(new Event("focus"));
                    password_input.dispatchEvent(new Event("change"));
                });
            }
        }
    });
}

function save_credentials(msg) {
    msg.action = "save_credentials";
    
    console.log("trying to save credentials: " + JSON.stringify(msg));
    
    chrome.runtime.sendMessage(msg, function(response) {
        if (response.status == "ok") {
            console.log("credentials saved: " + JSON.stringify(response));
        } else {
            console.log("failed to save credentials");
        }
    });
}


function get_domain() {
    return document.domain;
}

var confirmation_html = String.raw`
<style>
    .popup {
        /* background-color: rgba(0, 0, 255, 0.15); */
        background-color: rgb(212, 212, 255);
        border-color: rgb(95, 95, 255);
        border-width: 2px;
        border: solid;
        position: absolute;
        top: 20px;
        right: -350px;
        transition: right .5s;
        border-radius: 10px;
        padding: 15px;
        text-align: right;
        z-index: 99999999;
    }
    .popup__message {
        text-align: right;
    }
    .popup__yes {
        background-color: rgba(0, 150, 0, 0.8);
        padding: 3px 15px 3px 15px;
        border-radius: 5px;
        margin-right: 10px;
        color: white;
    }
    .popup__yes:hover {
        background-color: rgba(0, 150, 0, 1);
        cursor: pointer;
    }
    .popup__yes:active {
        position: relative;
        top: 1px;
        left: 1px;
    }
    .popup__no {
        background-color: rgba(150, 0, 0, 0.8);
        padding: 3px 15px 3px 15px;
        border-radius: 5px;
        color: white;
    }
    .popup__no:hover {
        background-color: rgba(150, 0, 0, 1);
        cursor: pointer;
    }
    .popup__no:active {
        position: relative;
        top: 1px;
        left: 1px;
    }
</style>
<div id='confirmationPopup' class='popup'>
    <div style='popup__message'>
            Password changed, do you want to update it now?
    </div>
<br/>
    <span class='popup__yes' id='keepass__confirmation_yes'>Yes</span>
    <span class='popup__no' id='keepass__confirmation_no'>No</span>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        var popup = document.getElementById("confirmationPopup");
        console.log("popup: " + popup);
        with (popup.style) {
            right = "20px";
        }
    });
</script>
`