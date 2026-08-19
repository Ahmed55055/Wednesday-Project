const loginSection = document.getElementById("login");
const registerSection = document.getElementById("register");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

showRegister.addEventListener("click", function () {
    loginSection.style.display = "none";
    registerSection.style.display = "block";
});

showLogin.addEventListener("click", function () {
    registerSection.style.display = "none";
    loginSection.style.display = "block";
});

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }
    if (email === "") {
        alert("Please enter your email.");
        return;
    }
    if (password === "") {
        alert("Please enter your password.");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("cineMaxUsers")) || [];

    const existingUser = users.find(function (user) {
        return user.email.toLowerCase() === email.toLowerCase();
    });

    if (existingUser) {
        alert("This email is already registered.");
        return;
    }

    const newUser = {
        name: name,
        username: name,
        email: email,
        password: password,
        country: "",
        profileImage: "",
        watched: [],
        favorites: [],
        reviews: []
    };

    users.push(newUser);
    localStorage.setItem("cineMaxUsers", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Account created successfully!");
    window.location.href = "profile.html";
});

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("cineMaxUsers")) || [];
    const user = users.find(function (u) {
        return u.email.trim().toLowerCase() === email && u.password.trim() === password;
    });

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    const rememberMe = document.getElementById("rememberMe");
    if (rememberMe.checked) {
        localStorage.setItem("rememberedEmail", email);
    } else {
        localStorage.removeItem("rememberedEmail");
    }

    alert("Login successful!");
    window.location.href = "home.html";
});

window.addEventListener("load", function () {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
        document.getElementById("loginEmail").value = rememberedEmail;
        document.getElementById("rememberMe").checked = true;
    }
});

const themeToggle = document.getElementById("themeToggle");
const currentTheme = document.documentElement.getAttribute("data-theme");

themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";

themeToggle.addEventListener("click", function () {
    const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    themeToggle.textContent = newTheme === "light" ? "🌙" : "☀️";
});

