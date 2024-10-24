import Game from './Game.js';

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const welcomeMessage = document.getElementById("welcome-message");
  const playerName = document.getElementById("player-name");
  const gameInfo = document.querySelector(".game-info");
  const gameBoard = document.getElementById("game-board");
  const restartBtn = document.getElementById("restart-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginLink = document.querySelector('a[href="login.html"]');

  // Debugging: Log elements to the console
  console.log('Welcome Message:', welcomeMessage);
  console.log('Player Name:', playerName);
  console.log('Game Info:', gameInfo);
  console.log('Game Board:', gameBoard);
  console.log('Restart Button:', restartBtn);
  console.log('Logout Button:', logoutBtn);

  if (currentUser) {
    playerName.textContent = currentUser;
    welcomeMessage.style.display = "block";
    gameInfo.style.display = "flex";
    gameBoard.style.display = "grid";
    restartBtn.style.display = "block";
    logoutBtn.style.display = "inline";
    if (loginLink) {
      loginLink.style.display = "none";
    }
  } else {
    const messageBlock = document.createElement("div");
    messageBlock.id = "login-message";
    messageBlock.innerHTML = `
      <div style="padding: 20px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px;">
        <strong>Notice:</strong> Please log in to play the game Minesweeper.
      </div>
    `;
    document.body.appendChild(messageBlock);
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000); // Redirect after 3 seconds
  }

  if(loginLink){
    loginLink.style.display = "inline";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }

  const grid = document.getElementById("game-board");
  const timerElement = document.getElementById("time");
  const mineCounter = document.getElementById("mine-counter");

  const width = 10;
  const height = 10;
  const totalMines = 10;

  let cells, mineArray, gameOver, timer, flagsUsed, score, flagCount;

  const game = new Game(grid, timerElement, mineCounter);
  game.initGame();

  restartBtn.addEventListener("click", () => game.initGame());
});
