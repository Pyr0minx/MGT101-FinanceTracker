const form = document.getElementById("signupForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const notification = document.getElementById("notification");

let notificationTimer;

function notify(message, success = false) {
    clearTimeout(notificationTimer);

    notification.textContent = message;
    notification.classList.add("show");

    if (success) {
        notification.classList.add("success");
    } else {
        notification.classList.remove("success");
    }

    notificationTimer = setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

function checkField(input) {
    let valid = true;

    if (input.value.trim() === "") {
        valid = false;
    }

    if (input.id === "username") {
        const usernamePattern = /^[A-Za-z0-9]+$/;

        if (input.value.length < 5 || !usernamePattern.test(input.value)) {
            valid = false;
        }
    }

    if (input.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(input.value)) {
            valid = false;
        }
    }

    if (input.id === "password") {
        if (input.value.length < 8) {
            valid = false;
        }
    }

    if (input.id === "confirmPassword") {
        if (input.value === "" || input.value !== password.value) {
            valid = false;
        }
    }

    if (valid) {
        input.classList.remove("error");
        input.classList.add("valid");
    } else {
        input.classList.remove("valid");
        input.classList.add("error");
    }

    return valid;
}

const inputs = [
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword
];

inputs.forEach(input => {

    input.addEventListener("blur", function () {

        if (!checkField(input)) {

            if (input.value.trim() === "") {
                notify("This field cannot be blank.");
            }

            else if (input.id === "username") {
                notify("Username must be 5+ characters and only letters/numbers.");
            }

            else if (input.id === "email") {
                notify("Please enter a valid email.");
            }

            else if (input.id === "password") {
                notify("Password must be at least 8 characters.");
            }

            else if (input.id === "confirmPassword") {
                notify("Passwords do not match.");
            }
        }
    });

    input.addEventListener("input", function () {
        input.classList.remove("error");
        input.classList.remove("valid");
    });

});


form.addEventListener("submit", function (event) {

    event.preventDefault();

    let formValid = true;

    inputs.forEach(input => {
        if (!checkField(input)) {
            formValid = false;
        }
    });

    if (!formValid) {
        notify("Please fix the highlighted fields.");
        return;
    }

    const formObject = {
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
        email: email.value,
        password: password.value
    };

    console.log("Sending:", formObject);

    fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formObject)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        notify("Account created successfully!", true);
    })
    .catch(error => {
        console.error(error);
        notify("Server error.");
    });

});
