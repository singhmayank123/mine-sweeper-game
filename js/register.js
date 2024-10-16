const registerForm = document.getElementById("register-form");
const users = JSON.parse(localStorage.getItem("users")) || [];

registerForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const newUsername = document.getElementById("new-username").value.trim().toLowerCase();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (users.some(user => user.username.toLowerCase() === newUsername || user.email.toLowerCase() === email)) {
    alert("Username or email already exists!");
  } else {
    users.push({ username: newUsername, email: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now login.");
    window.location.href = "login.html"; // Redirect to login page
  }
});
