

const LOGIN_INPUT_NAMES = ['login', 'userid', 'username', 'user name', 'user id', 'customer id', 'login id', 'email', 'email address', 'e-mail', 'e-mail address'];
const PASSWORD_INPUT_NAMES = ['password', 'pass'];
const SUBMIT_INPUT_NAMES = ['login', 'register', 'sign in', 'войти', 'вход', 'sign up', 'enter', 'submit', 'регистрация', 'зарегестрироваться', 'sign'];

var old_login_input;
var login_input;
var password_input;
var submit_button;
var credentials_filled = false;

setInterval(function (e) {
    save_credentials_confirmation();
    console.log("find credentials");
    login_input = detect_login_input();
    console.log("login input: " + login_input.name);
    if (login_input && old_login_input != login_input) {
        console.log("============LOGIN INPUT CHANGED============");
        old_login_input = login_input;
        password_input = detect_password_input();
        submit_button = detect_submit_button();
        if (submit_button) {
            console.log("submit button found, adding handler, name: " + submit_button.name);
            console.log("submit button found, adding handler, name: " + JSON.stringify(submit_button));
            setup_submit_button_handler(submit_button);
        }
        load_credentials();
    }
}, 2000);

// // need to wait until SPA reload DOM :(..
// this.setTimeout(function(e) {
//     login_input = detect_login_input();
//     if (login_input) {
//         password_input = detect_password_input();
//         submit_button = detect_submit_button();
//         if (submit_button) {
//             console.log("submit button found, adding handler");
//             setup_submit_button_handler(submit_button);
//         }
//         load_credentials();
//     }
// }, 2000);

// window.addEventListener("hashchange", function(e) {
//     console.log("has changed");
//     // need to wait until SPA reload DOM :(..
//     this.setTimeout(function(e) {
//         save_credentials_confirmation();

//         login_input = detect_login_input();
//         if (login_input) {
//             password_input = detect_password_input();
//             submit_button = detect_submit_button();
//             if (submit_button) {
//                 console.log("submit button found, adding handler");
//                 setup_submit_button_handler(submit_button);
//             }
//             chrome.storage.sync.get(function(credentials) {
//                 fill_credentials(credentials);
//             });
//         }        
//     }, 2000);
// });



// + 1. get domain
// + 2. load password for domain
// ? 3. find login
// ? 4. find password
// ? 5. find button
// 6. setup handlers for button and key

function save_credentials_confirmation() {
    chrome.storage.sync.get(function (storage) {
        console.log("Page loaded. ask_login: " + storage.ask_login + ", ask_password: " + storage.ask_password + ", ask_domain: " + storage.ask_domain);
        if (storage.ask_login && storage.ask_password) {
            document.getElementsByTagName("body")[0].insertAdjacentHTML('afterbegin', confirmation_html);

            console.log("popup loaded");
            var popup = document.getElementById("confirmationPopup");
            console.log("popup object: " + popup);
            setTimeout(function () {
                with (popup.style) {
                    right = "20px";
                }
            }, 1000);

            var popup_yes_button = document.getElementById("keepass__confirmation_yes");
            popup_yes_button.onclick = function () {
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
                    password: storage.ask_password,
                    domain: storage.ask_domain
                }, function () {
                    chrome.storage.sync.set({
                        ask_login: null,
                        ask_password: null,
                        ask_domain: null
                    });
                });
            }
            var popup_no_button = document.getElementById("keepass__confirmation_no");
            popup_no_button.onclick = function () {
                console.log("login update not confirmed");
                popup.style.display = "none";
            }
            chrome.storage.sync.set({
                ask_login: null,
                ask_password: null,
                ask_domain: null
            });
        } else {
            console.log("No need to ask");
        }
    });
}


function detect_login_input() {
    console.log("detecting login input");
    var login_input;
    var all_inputs = document.getElementsByTagName("input");
    for (input in all_inputs) {
        if (input.type == "password") {
            continue;
        }

        if (all_inputs[input].name) {
            for (i in LOGIN_INPUT_NAMES) {
                if (all_inputs[input].name.toLowerCase() == LOGIN_INPUT_NAMES[i].toLowerCase()) {
                    login_input = all_inputs[input];
                    console.log("login input detected: " + login_input.id);
                    return login_input;
                }
            }
        }
    }

    for (input in all_inputs) {
        if (input.type == "password") {
            continue;
        }
        if (all_inputs[input].placeholder) {
            for (i in LOGIN_INPUT_NAMES) {
                if (all_inputs[input].placeholder.toLowerCase() == LOGIN_INPUT_NAMES[i].toLowerCase()) {
                    login_input = all_inputs[input];
                    console.log("login input detected: " + login_input.id);
                    return login_input;
                }
            }
        }
        console.log("not placeholder");
    }

    for (input in all_inputs) {
        if (input.type == "password") {
            continue;
        }
        if (all_inputs[input].id) {
            for (i in LOGIN_INPUT_NAMES) {
                if (all_inputs[input].id.toLowerCase() == LOGIN_INPUT_NAMES[i].toLowerCase()) {
                    login_input = all_inputs[input];
                    console.log("login input detected: " + login_input.id);
                    return login_input;
                }
            }
        }
        console.log("not id");
    }

    for (input in all_inputs) {
        if (input.type == "password") {
            continue;
        }
        if (all_inputs[input].labels) {
            for (label in all_inputs[input].labels) {
                if (label.innerText) {
                    for (i in LOGIN_INPUT_NAMES) {
                        if (lable.innerText.toLowerCase() == LOGIN_INPUT_NAMES[i].toLowerCase()) {
                            login_input = all_inputs[input];
                            console.log("login input detected: " + login_input.id);
                            return login_input;
                        }
                    }
                }
            }
        }
        console.log("not label");
    }
    // for (input in all_inputs) {
    //     if (all_inputs[input].placeholder) {
    //         for (i in LOGIN_INPUT_NAMES) {
    //             if (all_inputs[input].placeholder.toLowerCase() == LOGIN_INPUT_NAMES[i].toLowerCase()) {
    //                 login_input = all_inputs[input];
    //                 console.log("login input detected");
    //                 return login_input;
    //             }
    //         }
    //     }
    // }
    console.log("login field not found");
    return null;
}

function detect_password_input() {
    var password_input;
    if (login_input.form) {
        var form_inputs = login_input.form.elements;
        for (input in form_inputs) {
            if (form_inputs[input].type) {
                if (form_inputs[input].type.toLowerCase() == "password") {
                    password_input = form_inputs[input];
                    console.log("password input detected: " + password_input.id);
                    return password_input;
                }
            }
            console.log("not password field: " + form_inputs[input].id);
        }

        for (input in form_inputs) {
            if (form_inputs[input].name) {
                for (i in PASSWORD_INPUT_NAMES) {
                    if (form_inputs[input].name.toLowerCase().includes(PASSWORD_INPUT_NAMES[i].toLowerCase())) {
                        password_input = form_inputs[input];
                        console.log("password input detected: " + password_input.id);
                        return password_input;
                    }
                }
            }
        }

        for (input in form_inputs) {
            if (form_inputs[input].placeholder) {
                for (i in PASSWORD_INPUT_NAMES) {
                    if (form_inputs[input].placeholder.toLowerCase().includes(PASSWORD_INPUT_NAMES[i].toLowerCase())) {
                        password_input = form_inputs[input];
                        console.log("password input detected: " + password_input.id);
                        return password_input;
                    }
                }
            }
        }

        for (input in form_inputs) {
            if (form_inputs[input].id) {
                for (i in PASSWORD_INPUT_NAMES) {
                    if (form_inputs[input].id.toLowerCase().includes(PASSWORD_INPUT_NAMES[i].toLowerCase())) {
                        password_input = form_inputs[input];
                        console.log("password input detected: " + password_input.id);
                        return password_input;
                    }
                }
            }
        }
    }

    var all_inputs = document.getElementsByTagName("input");

    for (input in all_inputs) {
        if (all_inputs[input].type) {
            if (all_inputs[input].type.toLowerCase() == "password") {
                password_input = all_inputs[input];
                console.log("password input detected: " + password_input.id);
                return password_input;
            }
        }
    }

    for (input in all_inputs) {
        if (all_inputs[input].name) {
            for (i in PASSWORD_INPUT_NAMES) {
                if (all_inputs[input].name.toLowerCase().includes(PASSWORD_INPUT_NAMES[i].toLowerCase())) {
                    password_input = all_inputs[input];
                    console.log("password input detected: " + password_input.id);
                    return password_input;
                }
            }
        }
    }

    if (all_inputs[input].placeholder) {
        for (i in PASSWORD_INPUT_NAMES) {
            if (all_inputs[input].placeholder.toLowerCase().includes(PASSWORD_INPUT_NAMES[i].toLowerCase())) {
                password_input = all_inputs[input];
                console.log("password input detected: " + password_input.id);
                return password_input;
            }
        }
    }

    if (all_inputs[input].id) {
        for (i in PASSWORD_INPUT_NAMES) {
            if (all_inputs[input].id.toLowerCase().includes(PASSWORD_INPUT_NAMES[i].toLowerCase())) {
                password_input = all_inputs[input];
                console.log("password input detected: " + password_input.id);
                return password_input;
            }
        }
    }
}

function detect_submit_button() {
    console.log("detecting submit button");
    if (!login_input || !password_input) {
        return null;
    }
    var form = login_input.form;
    if (form) {
        var form_elements = form.elements;
        console.log("finding by submit inside same form: " + form);
        for (e in form_elements) {
            if (form_elements[e] && form_elements[e].type) {
                if (form_elements[e].type == "submit") {
                    submit_button = form_elements[e];
                    console.log("submit button detected by type: " + submit_button.name);
                    return submit_button;
                }
            }
        }
        for (e in form_elements) {
            if (form_elements[e].name) {
                for (i in SUBMIT_INPUT_NAMES) {
                    if (form_elements[e].name.toLowerCase().includes(SUBMIT_INPUT_NAMES[i])) {
                        submit_button = form_elements[e];
                        console.log("submit button detected by name: " + submit_button.name);
                        return submit_button;
                    }
                }
            }

            if (form_elements[e].id) {
                for (i in SUBMIT_INPUT_NAMES) {
                    if (form_elements[e].id.toLowerCase().includes(SUBMIT_INPUT_NAMES[i])) {
                        submit_button = form_elements[e];
                        console.log("submit button detected by id: " + submit_button.id);
                        return submit_button;
                    }
                }
            }
        }
    }



    var all_buttons = document.getElementsByTagName("button");
    for (button in all_buttons) {
        if (all_buttons[button].name) {
            for (i in SUBMIT_INPUT_NAMES) {
                if (all_buttons[button].name.toLowerCase().includes(SUBMIT_INPUT_NAMES[i])) {
                    submit_button = all_buttons[button];
                    console.log("submit button detected: " + submit_button.id);
                    return submit_button;
                }
            }
        }
        if (all_buttons[button].id) {
            for (i in SUBMIT_INPUT_NAMES) {
                if (all_buttons[button].id.toLowerCase().includes(SUBMIT_INPUT_NAMES[i])) {
                    submit_button = all_buttons[button];
                    console.log("submit button detected: " + submit_button.id);
                    return submit_button;
                }
            }
        }
    }

    // var all_links = document.getElementsByTagName("a");
    // for (button in all_links) {
    //     if (all_links[button].name) {
    //         for (i in SUBMIT_INPUT_NAMES) {
    //             if (all_links[button].name.toLowerCase().includes(SUBMIT_INPUT_NAMES[i])) {
    //                 submit_button = all_links[button];
    //                 console.log("submit button detected: " + submit_button.id);
    //                 return submit_button;
    //             }
    //         }
    //     }
    //     if (all_links[button].id) {
    //         for (i in SUBMIT_INPUT_NAMES) {
    //             if (all_links[button].id.toLowerCase().includes(SUBMIT_INPUT_NAMES[i])) {
    //                 submit_button = all_links[button];
    //                 console.log("submit button detected: " + submit_button.id);
    //                 return submit_button;
    //             }
    //         }
    //     }

    //     if (all_links[button].classList) {
    //         all_links[button].classList.forEach((clazz) => {
    //                 // console.log("all_links[b].classList[c]: " + clazz);
    //                 for (i in SUBMIT_INPUT_NAMES) {
    //                     if (clazz.toLowerCase().includes(SUBMIT_INPUT_NAMES[i])) {
    //                         submit_button = all_links[button];
    //                         console.log("submit button detected: " + submit_button);
    //                         return submit_button;
    //                     }
    //                 }
    //         });          
    //     }
    // }
}

function setup_submit_button_handler(submit_button) {
    submit_button.addEventListener("click", function (e) {
        var current_credentials = extract_credentials();
        var domain = get_domain();
        console.log("submit button clicked, saving login/password: " + JSON.stringify(current_credentials));
        console.log("on page login: " + login_input.value + ", password: " + password_input.value);
        chrome.storage.sync.get(function (credentials) {
            console.log("current_credentials: " + credentials.login + ", password: " + credentials.password + " for domain " + domain);
        });
        // chrome.storage.sync.get(function(credentials) {
        //     console.log("credentials[login]: " + credentials.login);
        //     login_input.value = credentials.login;
        //     chrome.storage.sync.set(
        //         { login_input: login_input.id }, 
        //         callback
        //     );
        // });

        chrome.storage.sync.get(function (credentials) {
            console.log("current_credentials: " + credentials.login + ", password: " + credentials.password + " for domain " + domain);

            if (!(credentials.login) || !(credentials.password)
                || (credentials.login != login_input.value)
                || (credentials.password != password_input.value)) {
                console.log("credentials updated, will ask, domain: " + domain);
                chrome.storage.sync.set({
                    ask_login: login_input.value,
                    ask_password: password_input.value,
                    ask_domain: domain
                }, function () { console.log("ask login and ask password was set"); }
                );
            }
        });

        // alert("Ready to go?");
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

    chrome.runtime.sendMessage(msg, function (response) {
        if (!response) {
            return;
        }
        if (response.status == "ok") {
            var credentials = {
                domain: msg.domain,
                login: response.login,
                password: response.password
            };
            console.log("credentials loaded: " + JSON.stringify(credentials));
            if (login_input && password_input) {
                chrome.storage.sync.set(credentials, function () {
                    fill_credentials(credentials);
                });
            }
        }
    });
}

function fill_credentials(credentials) {
    var login_filled = false;
    if (login_input && credentials.login) {
        login_input.value = credentials.login;
        login_input.dispatchEvent(new Event("focus", { bubbles: true }));
        login_input.dispatchEvent(new Event("change", { bubbles: true }));
        login_input.dispatchEvent(new Event("input", { bubbles: true }));
        console.log("filled login: " + credentials.login);
        login_filled = true;
    }
    var password_filled = false;
    if (password_input && credentials.password) {
        password_input.value = credentials.password;
        password_input.dispatchEvent(new Event("focus", { bubbles: true }));
        password_input.dispatchEvent(new Event("change", { bubbles: true }));
        password_input.dispatchEvent(new Event("input", { bubbles: true }));
        console.log("filled password: " + credentials.password);
        password_filled = true;
    }

    if (login_filled || password_filled) {
        credentials_filled = true;
        console.log("stop checking credentials");
    }
}

function save_credentials(msg) {
    msg.action = "save_credentials";

    console.log("trying to save credentials: " + JSON.stringify(msg));

    chrome.runtime.sendMessage(msg, function (response) {
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
    .keepas-nc-popup {
        /* background-color: rgba(0, 0, 255, 0.15); */
        background-color: white;
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, .5);
        position: fixed;
        top: 20px;
        right: -500px;
        transition: right .5s;
        border-radius: 10px;
        padding: 15px;
        text-align: right;
        z-index: 99999999;
    }
    .keepas-nc-popup__message {
        text-align: right;
    }
    .keepas-nc-popup__yes {
        background-color: rgba(0, 150, 0, 0.8);
        padding: 3px 15px 3px 15px;
        border-radius: 5px;
        margin-right: 10px;
        color: white;
    }
    .keepas-nc-popup__yes:hover {
        background-color: rgba(0, 150, 0, 1);
        cursor: pointer;
    }
    .keepas-nc-popup__yes:active {
        position: relative;
        top: 1px;
        left: 1px;
    }
    .keepas-nc-popup__no {
        background-color: rgba(150, 0, 0, 0.8);
        padding: 3px 15px 3px 15px;
        border-radius: 5px;
        color: white;
    }
    .keepas-nc-popup__no:hover {
        background-color: rgba(150, 0, 0, 1);
        cursor: pointer;
    }
    .keepas-nc-popup__no:active {
        position: relative;
        top: 1px;
        left: 1px;
    }
</style>
<div id='confirmationPopup' class='keepas-nc-popup'>
    <div class='keepas-nc-popup__message'>
            Password changed, do you want to update it now?
    </div>
<br/>
    <span class='keepas-nc-popup__yes' id='keepass__confirmation_yes'>Yes</span>
    <span class='keepas-nc-popup__no' id='keepass__confirmation_no'>No</span>
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