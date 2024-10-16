document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const welcomeMessage = document.getElementById("welcome-message");
  const playerName = document.getElementById("player-name");
  const gameInfo = document.querySelector(".game-info");
  const gameBoard = document.getElementById("game-board");
  const restartBtn = document.getElementById("restart-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginLink = document.querySelector('a[href="login.html"]');

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
    logoutBtn.style.display = "none";
    if (loginLink) {
      loginLink.style.display = "inline";
    }
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });

  restartBtn.addEventListener("click", initGame);
  initGame();
});

const grid = document.getElementById("game-board");
const restartBtn = document.getElementById("restart-btn");
const timerElement = document.getElementById("time");
const mineCounter = document.getElementById("mine-counter");

const width = 10;
const height = 10;
const totalMines = 10;

let cells, mineArray, gameOver, timer, flagsUsed, score, flagCount;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    initGame();
});


function initGame() {
    console.log("Initializing game");
    // Initialize game variables
    grid.innerHTML = ''; // Reset grid
    gameOver = false;
    flagsUsed = 0;
    score = 0; // Initialize score
    mineCounter.innerText = totalMines;
    clearInterval(timer); // Clear previous timer
    startTimer();

    // Initialize mineArray
    const mines = Array(totalMines).fill("mine");
    const empty = Array(width * height - totalMines).fill("safe");
    mineArray = [...mines, ...empty].sort(() => Math.random() - 0.5);

    generateBoard();
    updateScoreDisplay(); // Update score display
}

function startTimer() {
    let time = 0;
    timer = setInterval(() => {
        if (!gameOver) {
            time++;
            timerElement.innerText = time;
        }
    }, 1000);
}

function generateBoard() {
    console.log("Generating board");

    let clickTimeout = 0;

    const boardWidth = grid.clientWidth;
    const computedStyle = window.getComputedStyle(grid);

    // Extract padding, gap, and margin from the computed style
    const padding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    const gap = parseFloat(computedStyle.gap) || 0; // Default to 0 if not set
    const margin = parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight);

    // Adjust cellSize by subtracting padding, gap, and margin
    const adjustedCellSize = Math.floor((boardWidth - padding - (gap * (width - 1)) - margin) / width);

    console.log('Cell Size:', adjustedCellSize);
    console.log('Board Width:', boardWidth);
    console.log('Width:', width);
    console.log('Height:', height);

    // Clear existing cells
    grid.innerHTML = '';

    mineArray.forEach((cellType, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.id = index;
        cell.dataset.type = cellType;
        cell.dataset.revealed = "false";

        cell.addEventListener("click", (e) => {
            clearTimeout(clickTimeout);
            if (cell.dataset.type === "mine") {
                clickTimeout = setTimeout(() => {
                    revealCell(e);
                }, 500);
            } else {
                revealCell(e);
            }
        });

        cell.addEventListener('dblclick', function(event) {
            clearTimeout(clickTimeout);
            event.preventDefault();
            cell.classList.toggle('flagged');

            if (cell.classList.contains('flagged')) {
                cell.dataset.previousContent = cell.innerHTML;
                cell.innerHTML = '🚩';
            } else {
                cell.innerHTML = cell.dataset.previousContent || '';
            }
        });

        grid.appendChild(cell);
    });

    grid.style.gridTemplateColumns = `repeat(${width}, ${adjustedCellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${height}, ${adjustedCellSize}px)`;

    cells = document.querySelectorAll(".cell");
}

function revealCell(e) {
    const cell = e.target;
    if (gameOver || cell.dataset.revealed === "true" || cell.classList.contains("flagged"))
        return;
    
    cell.dataset.revealed = "true";
    cell.classList.add("revealed");

    if (cell.dataset.type === "mine") {
        cell.innerHTML = "💣";
        gameOver = true;
        clearInterval(timer);
        alert(`You hit a bomb! Your score is: ${score} points.`);
        revealAllMines();
    } else {
        const minesAround = countMinesAround(cell);
        if (minesAround > 0) {
            cell.innerText = minesAround;
            cell.style.color = getColorForNumber(minesAround);
        } else {
            revealAdjacentSafeCells(cell);
        }
        score++;
        updateScoreDisplay();
        checkWin();
    }
}


function countMinesAround(cell) {
    const id = parseInt(cell.dataset.id);
    const adjacentCells = getAdjacentCells(id);
    return adjacentCells.filter(c => c.dataset.type === "mine").length;
}

function getAdjacentCells(id) {
    const row = Math.floor(id / width);
    const col = id % width;
    const adjacentIndices = [];

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const newRow = row + x;
            const newCol = col + y;
            if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
                adjacentIndices.push(newRow * width + newCol);
            }
        }
    }
    return adjacentIndices.map(index => cells[index]);
}

function revealAdjacentSafeCells(cell) {
    const id = parseInt(cell.dataset.id);
    const adjacentCells = getAdjacentCells(id);
    adjacentCells.forEach((c, index) => {
        if (c.dataset.revealed === "false" && !c.classList.contains("flagged")) {
            setTimeout(() => {
                revealCell({ target: c });
            }, index * 100); // Delay based on index for spreading effect
        }
    });
}

function revealAllMines() {
    cells.forEach(cell => {
        if (cell.dataset.type === "mine") {
            cell.innerHTML = "💣";
            cell.classList.add("revealed");
        }
    });
}

function checkWin() {
    // Save score to localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        const userIndex = rankings.findIndex(user => user.username === currentUser);
        if (userIndex !== -1) {
            rankings[userIndex].score = Math.max(rankings[userIndex].score, score);
        } else {
            rankings.push({ username: currentUser, score: score });
        }
        localStorage.setItem('rankings', JSON.stringify(rankings));
    }
    const revealedCells = Array.from(cells).filter(c => c.dataset.revealed === "true").length;
    if (revealedCells + totalMines === width * height) {
        gameOver = true;
        clearInterval(timer);
        alert("Congratulations! You won the game.");
        triggerFirecrackerAnimation(); 
    }
}

restartBtn.addEventListener("click", initGame);
initGame();

// Function to reveal a square
function revealSquare(square) {
  if (!square.revealed) {
    square.revealed = true;
    score += 1; // Increment score for each revealed square
    // ... existing code to handle revealing logic ...
  }
}

// Function to end the game
function endGame(isWin) {
    clearInterval(timer);
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        const userIndex = rankings.findIndex(user => user.username === currentUser);
        if (userIndex !== -1) {
            // Update the score if the new score is higher
            rankings[userIndex].score = Math.max(rankings[userIndex].score, score);
        } else {
            // Add new user score
            rankings.push({ username: currentUser, score: score });
        }
        localStorage.setItem('rankings', JSON.stringify(rankings));
    }

    if (isWin) {
        alert("Congratulations! You won the game.");
    } else {
        alert("Game over! You hit a mine.");
    }
}

// Example usage
// Call endGame(true) if the user wins
// Call endGame(false) if the user loses

function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    }
}

function getColorForNumber(number) {
    switch (number) {
        case 1: return 'rgb(6, 6, 125)';
        case 2: return 'rgb(4, 58, 4)';
        case 3: return 'rgb(72, 5, 5)';
        case 4: return 'rgb(84, 10, 84)';
        default: return '#0c30e4'; // Default color
    }
}

// Function to update the displayed flag count
function updateFlagCountDisplay() {
    const flagCountElement = document.getElementById("flag-count");
    if (flagCountElement) {
        flagCountElement.innerText = `Flags: ${flagCount}/3`; // Update the display
    }
}

// Example of how to call flagCell when a cell is right-clicked
cells.forEach(cell => {
    cell.addEventListener("contextmenu", function(event) {
        event.preventDefault(); // Prevent the default context menu
        flagCell(cell); // Call the flagging function
    });
});

// Add this HTML structure for firecracker animation
const firecrackerContainer = document.createElement("div");
firecrackerContainer.id = "firecracker-animation";
document.body.appendChild(firecrackerContainer);

// Function to trigger firecracker animation
function triggerFirecrackerAnimation() {
    firecrackerContainer.classList.add("animate");
    firecrackerContainer.style.display = "block"; // Ensure it's visible
    setTimeout(() => {
        firecrackerContainer.classList.remove("animate"); // Remove class after animation
        firecrackerContainer.style.display = "none"; // Hide again if needed
    }, 3000); // Duration of the animation
}

function updateCellDisplay(cell, value) {
    cell.textContent = value; // Set the cell's text to the value

    // Set the color based on the value
    switch (value) {
        case 1:
            cell.style.color = "blue"; // Color for 1
            break;
        case 2:
            cell.style.color = "white"; // Color for 2
            break;
        case 3:
            cell.style.color = "red"; // Color for 3
            break;
        case 4:
            cell.style.color = "darkblue"; // Color for 4
            break;
        case 5:
            cell.style.color = "darkred"; // Color for 5
            break;
        case 6:
            cell.style.color = "cyan"; // Color for 6
            break;
        case 7:
            cell.style.color = "black"; // Color for 7
            break;
        case 8:
            cell.style.color = "gray"; // Color for 8
            break;
        default:
            cell.style.color = "black"; // Default color for 0 or other values
            break;
    }
}
