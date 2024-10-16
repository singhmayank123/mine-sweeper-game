const loginForm = document.getElementById("login-form");
const users = JSON.parse(localStorage.getItem("users")) || [];

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();
  
  const usernameOrEmail = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  const user = users.find(user => 
    (user.username.toLowerCase() === usernameOrEmail || user.email.toLowerCase() === usernameOrEmail) && user.password === password
  );

  if (user) {
    alert("Login successful!");
    localStorage.setItem("currentUser", user.username);
    window.location.href = "index.html"; // Redirect to the game
  } else {
    alert("Invalid username/email or password.");
  }
});