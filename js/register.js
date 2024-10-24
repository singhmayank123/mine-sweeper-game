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
    showFloatingWindow("Password must be at least 6 characters long, include one uppercase letter and one special character.", false);
    return;
  }

  // Phone number validation: US phone number format
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    showFloatingWindow("Phone number must be in the format (123) 456-7890.", false);
    return;
  }

  if (users.some(user => user.username.toLowerCase() === newUsername || user.email.toLowerCase() === email)) {
    showFloatingWindow("Username or email already exists!", false);
  } else {
    users.push({ username: newUsername, email: email, password: password, phone: phone, age: age });
    localStorage.setItem("users", JSON.stringify(users));
    showFloatingWindow("Registration successful! You can now login.", true);
    window.location.href = "login.html"; // Redirect to login page
  }
});
