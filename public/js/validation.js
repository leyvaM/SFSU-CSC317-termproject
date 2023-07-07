
const FORM = document.getElementById("form");
FORM.addEventListener("submit", validateForm);

function validateForm (event) {
event.preventDefault();

let username = document.forms["form"]["username"].value;
let email = document.forms["form"]["email"].value;
let password = document.forms["form"]["password"].value;
let secondPassword = document.forms["form"]["confirm_password"].value;

let letters = /^[a-zA-Z]+$/;
let emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordValidation =/^(?=.*\d)(?=.*[A-Z])(?=.*[0-9])(?=.*[\-+!@#$^&*])[a-zA-Z0-9\-+!@#$^&*]{8,20}$/;

    //username verification
    if (username == "") {
        alert("must enter a username");
        return false;
    } else if (!(letters.test(username[0]))) {
        alert("first character must be a letter");
        return false;
    } else if (username.length < 3) {
        alert("username must be 3 characters or more");
        return false;
    }

    //email verification
    if (email == "") {
        alert("must enter an email");
        return false;
    } else if (!(emailValidation.test(email))) {
        alert("invalid email address");
        return false;
    }

    //password verification
    if (password == "") {
        alert("must enter a password");
        return false;
    } else if (password.length < 8) {
        alert("password must contain 8 or more characters");
        return false;
    } else if (!(passwordValidation.test(password))) {
        alert("password does not contain one of the following: 1 number, 1 uppercase letter" +
        ", and 1 special character (- + ! @ # $ ^ & *)");
        return false;
    }

    //password confirmation
    if (secondPassword == "") {
        alert("must confirm password");
        return false;
    } else if (password != secondPassword) {
        alert("passwords do not match");
        return false;
    }

    // checkbox confirmation
    if (!(document.getElementById("first-checkbox").checked)) {
        alert("must confirm that you are 13 years of age or older");
        return false;
    } else if (!(document.getElementById("second-checkbox").checked)) {
        alert("must agree to the TOS and Privacy rules");
        return false;
    }
    
    FORM.submit();
}