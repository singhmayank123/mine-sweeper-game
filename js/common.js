document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const logoutBtn = document.getElementById("logout-btn");
  const loginLink = document.querySelector('a[href="login.html"]');
  const registerLink = document.querySelector('a[href="register.html"]');

  if (currentUser) {
    if (logoutBtn) logoutBtn.style.display = "inline";
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
  } else {
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginLink) loginLink.style.display = "inline";
    if (registerLink) registerLink.style.display = "inline";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
});
// Add this function to the global scope
window.showFloatingWindow = function(message, isSuccess = true) {
  const floatingWindow = document.createElement('div');
  floatingWindow.style.position = 'fixed';
  floatingWindow.style.top = '50%';
  floatingWindow.style.left = '50%';
  floatingWindow.style.transform = 'translate(-50%, -50%)';
  floatingWindow.style.padding = '20px';
  floatingWindow.style.backgroundColor = '#2c2c2c';
  floatingWindow.style.border = isSuccess ? '2px solid #00ff00' : '2px solid #ff0000';
  floatingWindow.style.borderRadius = '10px';
  floatingWindow.style.boxShadow = isSuccess ? '0 0 10px rgba(0, 255, 0, 0.5)' : '0 0 10px rgba(255, 0, 0, 0.5)';
  floatingWindow.style.zIndex = '1000';

  const messageElement = document.createElement('p');
  messageElement.style.fontSize = '18px';
  messageElement.style.marginBottom = '15px';
  messageElement.style.color = '#ffffff';
  messageElement.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.padding = '5px 10px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.backgroundColor = isSuccess ? '#00ff00' : '#ff0000';
  closeButton.style.color = '#000000';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '5px';
  closeButton.onclick = () => document.body.removeChild(floatingWindow);

  floatingWindow.appendChild(messageElement);
  floatingWindow.appendChild(closeButton);
  document.body.appendChild(floatingWindow);
};
