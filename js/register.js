const registerForm = document.getElementById("register-form");
const users = JSON.parse(localStorage.getItem("users")) || [];

registerForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const newUsername = document.getElementById("new-username").value.trim().toLowerCase();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value.trim();
  const age = parseInt(document.getElementById("age").value, 10);

  // Password validation: at least 6 characters, one special character, and one uppercase letter
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(password)) {
    alert("Password must be at least 6 characters long, include one uppercase letter and one special character.");
    return;
  }

  // Phone number validation: US phone number format
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    alert("Phone number must be in the format (123) 456-7890.");
    return;
  }

  if (users.some(user => user.username.toLowerCase() === newUsername || user.email.toLowerCase() === email)) {
    alert("Username or email already exists!");
  } else {
    users.push({ username: newUsername, email: email, password: password, phone: phone, age: age });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now login.");
    window.location.href = "login.html"; // Redirect to login page
  }
});
