let currentUser = JSON.parse(localStorage.getItem("currentUser"));

const profileImage = document.getElementById("profileImage");
const profileImageInput = document.getElementById("profileImageInput");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const watchedCount = document.getElementById("watchedCount");
const favoritesCount = document.getElementById("favoritesCount");
const reviewsCount = document.getElementById("reviewsCount");
const favoritesBtn = document.getElementById("favoritesBtn");
const countryInput = document.getElementById("country");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const saveBtn = document.getElementById("saveBtn");
const discardBtn = document.getElementById("discardBtn");
const logoutBtn = document.getElementById("logoutBtn");
const DEFAULT_PROFILE_IMAGE = "https://th.bing.com/th/id/OIP.p7KrixEH76AInqJDLjj7oQAAAA?w=169&h=169&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

function getUsers() {
    return JSON.parse(localStorage.getItem("cineMaxUsers")) || [];
}

function saveUsers(users) {
    localStorage.setItem("cineMaxUsers", JSON.stringify(users));
}

function updateUserEverywhere(updatedUser) {
    let users = getUsers();
    const index = users.findIndex(function (u) {
        return u.email.toLowerCase() === currentUser.email.toLowerCase();
    });

    if (index !== -1) {
        users[index] = updatedUser;
    } else {
        users.push(updatedUser);
    }

    saveUsers(users);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    currentUser = updatedUser;
}

function loadProfileData() {
    profileUsername.textContent = currentUser.username || currentUser.name || "User";
    profileEmail.textContent = currentUser.email || "";

    usernameInput.value = currentUser.username || currentUser.name || "";
    emailInput.value = currentUser.email || "";
    countryInput.value = currentUser.country || "";

    currentPasswordInput.value = "";
    newPasswordInput.value = "";

    watchedCount.textContent = currentUser.watched ? currentUser.watched.length : 0;
    favoritesCount.textContent = currentUser.favorites ? currentUser.favorites.length : 0;
    reviewsCount.textContent = currentUser.reviews ? currentUser.reviews.length : 0;

    profileImage.src = currentUser.profileImage || DEFAULT_PROFILE_IMAGE;
}

loadProfileData();

profileImageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please add Valid Picture");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("The image size is too large. Please choose an image smaller than 2 MB");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const base64Image = event.target.result;
        profileImage.src = base64Image;

        const updatedUser = Object.assign({}, currentUser, { profileImage: base64Image });
        updateUserEverywhere(updatedUser);
    };
    reader.readAsDataURL(file);
});

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector("i");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
}
window.togglePassword = togglePassword;

saveBtn.addEventListener("click", function () {
    const newUsername = usernameInput.value.trim();
    const newEmail = emailInput.value.trim().toLowerCase();
    const newCountry = countryInput.value;
    const currentPasswordValue = currentPasswordInput.value.trim();
    const newPasswordValue = newPasswordInput.value.trim();

    if (newUsername === "") {
        alert("Please Enter User Name");
        return;
    }
    if (newEmail === "") {
        alert("Please Enter Email address");
        return;
    }

    let users = getUsers();

    const emailTaken = users.some(function (u) {
        return u.email.toLowerCase() === newEmail && u.email.toLowerCase() !== currentUser.email.toLowerCase();
    });

    if (emailTaken) {
        alert("This email is already in use");
        return;
    }

    let finalPassword = currentUser.password;

    if (newPasswordValue !== "") {
        if (currentPasswordValue === "") {
            alert("Please enter your current password to confirm the change");
            return;
        }
        if (currentPasswordValue !== currentUser.password.trim()) {
            alert("The current password is incorrect");
            return;
        }
        if (newPasswordValue.length < 6) {
            alert("The new password must be at least 6 characters long");
            return;
        }
        finalPassword = newPasswordValue;
    }

    const updatedUser = Object.assign({}, currentUser, {
        username: newUsername,
        name: newUsername,
        email: newEmail,
        country: newCountry,
        password: finalPassword
    });

    updateUserEverywhere(updatedUser);
    loadProfileData();

    alert("Updates Saved Successfully!");
});

discardBtn.addEventListener("click", function () {
    loadProfileData();
});

favoritesBtn.addEventListener("click", function () {
    window.location.href = "favorites.html";
});

logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});
const updatedUser = Object.assign({}, currentUser, {
    profileImage: base64Image
});

updateUserEverywhere(updatedUser);
