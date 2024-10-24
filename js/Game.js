export default class Game {
    constructor(grid, timerElement, mineCounter) {
        this.grid = grid;
        this.timerElement = timerElement;
        this.mineCounter = mineCounter;
        this.width = 10;
        this.height = 10;
        this.totalMines = 10;
        this.cells = [];
        this.mineArray = [];
        this.gameOver = false;
        this.timer = null;
        this.flagsUsed = 0;
        this.score = 0;
        this.flagCount = 0;
        this.fireworks = [];
    }

    initGame() {
        console.log("Initializing game");
        // Initialize game variables
        this.grid.innerHTML = ''; // Reset grid
        this.gameOver = false;
        this.flagsUsed = 0;
        this.score = 0; // Initialize score
        this.mineCounter.innerText = this.totalMines;
        clearInterval(this.timer); // Clear previous timer
        this.startTimer();

        // Initialize mineArray
        const mines = Array(this.totalMines).fill("mine");
        const empty = Array(this.width * this.height - this.totalMines).fill("safe");
        this.mineArray = [...mines, ...empty].sort(() => Math.random() - 0.5);

        this.generateBoard();
        this.updateScoreDisplay(); // Update score display
    }
    

    startTimer() {
        let time = 0;
        this.timer = setInterval(() => {
            if (!this.gameOver) {
                time++;
                this.timerElement.innerText = time;
            }
        }, 1000);
    }

    generateBoard() {
        console.log("Generating board");
    
        let clickTimeout = 0;
    
        const boardWidth = this.grid.clientWidth;
        const computedStyle = window.getComputedStyle(this.grid);
    
        // Extract padding, gap, and margin from the computed style
        const padding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const gap = parseFloat(computedStyle.gap) || 0; // Default to 0 if not set
        const margin = parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight);
    
        // Adjust cellSize by subtracting padding, gap, and margin
        const adjustedCellSize = Math.floor((boardWidth - padding - (gap * (this.width - 1)) - margin) / this.width);
    
        console.log('Cell Size:', adjustedCellSize);
        console.log('Board Width:', boardWidth);
        console.log('Width:', this.width);
        console.log('Height:', this.height);
    
        // Clear existing cells
        this.grid.innerHTML = '';
    
        this.mineArray.forEach((cellType, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.id = index;
            cell.dataset.type = cellType;
            cell.dataset.revealed = "false";
    
            cell.addEventListener("click", (e) => {
                clearTimeout(clickTimeout);
                if (cell.dataset.type === "mine") {
                    clickTimeout = setTimeout(() => {
                        this.revealCell(e);
                    }, 500);
                } else {
                    this.revealCell(e);
                }
            });
    
            cell.addEventListener('dblclick', (event) => {
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
    
            this.grid.appendChild(cell);
        });
    
        this.grid.style.gridTemplateColumns = `repeat(${this.width}, ${adjustedCellSize}px)`;
        this.grid.style.gridTemplateRows = `repeat(${this.height}, ${adjustedCellSize}px)`;
    
        this.cells = document.querySelectorAll(".cell");
    }

    revealAllMines() {
        this.cells.forEach(cell => {
            if (cell.dataset.type === "mine") {
                cell.innerHTML = "💣";
                cell.classList.add("revealed");
            }
        });
    }

    revealCell(e) {
        const cell = e.target;
        if (this.gameOver || cell.dataset.revealed === "true" || cell.classList.contains("flagged"))
            return;
        
        cell.dataset.revealed = "true";
        cell.classList.add("revealed");
    
        if (cell.dataset.type === "mine") {
            cell.innerHTML = "💣";
            this.gameOver = true;
            clearInterval(this.timer);
            this.showFloatingWindow(false);
            this.endGame(false);
            this.revealAllMines();
        } else {
            const minesAround = this.countMinesAround(cell);
            if (minesAround > 0) {
                cell.innerText = minesAround;
                cell.style.color = this.getColorForNumber(minesAround);
            } else {
                this.revealAdjacentSafeCells(cell);
            }
            this.score++;
            this.updateScoreDisplay();
            this.checkWin();
        }
    }

    countMinesAround(cell) {
        const id = parseInt(cell.dataset.id);
        const adjacentCells = this.getAdjacentCells(id);
        return adjacentCells.filter(c => c.dataset.type === "mine").length;
    }
    
    getAdjacentCells(id) {
        const row = Math.floor(id / this.width);
        const col = id % this.width;
        const adjacentIndices = [];
    
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                const newRow = row + x;
                const newCol = col + y;
                if (newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width) {
                    adjacentIndices.push(newRow * this.width + newCol);
                }
            }
        }
        return adjacentIndices.map(index => this.cells[index]);
    }
    
    revealAdjacentSafeCells(cell) {
        const id = parseInt(cell.dataset.id);
        const adjacentCells = this.getAdjacentCells(id);
        adjacentCells.forEach((c, index) => {
            if (c.dataset.revealed === "false" && !c.classList.contains("flagged")) {
                setTimeout(() => {
                    this.revealCell({ target: c });
                }, index * 100); // Delay based on index for spreading effect
            }
        });
    }
    
    revealAllMines() {
        this.cells.forEach(cell => {
            if (cell.dataset.type === "mine") {
                cell.innerHTML = "💣";
                cell.classList.add("revealed");
            }
        });
    }
    
    checkWin() {
        const revealedCells = Array.from(this.cells).filter(c => c.dataset.revealed === "true").length;
        if (revealedCells + this.totalMines === this.width * this.height) {
            this.gameOver = true;
            clearInterval(this.timer);
            this.triggerWinAnimation();
        }
    }

    // Function to reveal a square
    revealSquare(square) {
        if (!square.revealed) {
            square.revealed = true;
            this.score += 1; // Increment score for each revealed square
            // ... existing code to handle revealing logic ...
        }
    }
    
    // Function to end the game
    endGame(isWin) {
        clearInterval(this.timer);
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) { 
            // Get existing rankings or initialize empty array
            let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
            
            // Calculate score based on time and remaining mines
            const timeScore = parseInt(this.timerElement.innerText);
            // Calculate digit factor: fewer digits (faster time) = higher multiplier
            const digitFactor = Math.max(1, 2 - Math.floor(Math.log10(timeScore + 1)) * 0.5);
            // Calculate score based on time and remaining mines
            this.score = this.score * digitFactor;
            
            // Find if user already exists in rankings
            const userIndex = rankings.findIndex(rank => rank.username === currentUser);
            
            if (userIndex !== -1) {
                // Update score if new score is higher
                if (this.score > rankings[userIndex].score) {
                    rankings[userIndex].score = this.score;
                }
            } else {
                // Add new user score
                rankings.push({
                    username: currentUser,
                    score: this.score
                });
            }
            
            // Sort rankings by score in descending order
            rankings.sort((a, b) => b.score - a.score);
            
            // Store updated rankings
            localStorage.setItem('rankings', JSON.stringify(rankings));
        }

        // Show win/lose message
        this.showFloatingWindow(isWin);
    }
    
    updateScoreDisplay() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
            const userRank = rankings.find(rank => rank.username === currentUser);
            if (userRank) {
                const scoreElement = document.getElementById("score");
                if (scoreElement) {
                    scoreElement.innerText = `High Score: ${userRank.score}`;
                }
            }
        }
    }
    
    getColorForNumber(number) {
        switch (number) {
            case 1: return 'rgb(6, 6, 125)';
            case 2: return 'rgb(4, 58, 4)';
            case 3: return 'rgb(72, 5, 5)';
            case 4: return 'rgb(84, 10, 84)';
            default: return '#0c30e4'; // Default color
        }
    }
    
    updateFlagCountDisplay() {
        const flagCountElement = document.getElementById("flag-count");
        if (flagCountElement) {
            flagCountElement.innerText = `Flags: ${this.flagCount}/3`; // Update the display
        }
    }

    triggerWinAnimation() {
        const animationContainer = document.createElement('div');
        animationContainer.style.position = 'fixed';
        animationContainer.style.top = '0';
        animationContainer.style.left = '0';
        animationContainer.style.width = '100%';
        animationContainer.style.height = '100%';
        animationContainer.style.pointerEvents = 'none';
        animationContainer.style.zIndex = '1000';
        document.body.appendChild(animationContainer);

        this.createWinText(animationContainer);
        this.createFireworks(animationContainer);
        this.createStarburst(animationContainer);

        setTimeout(() => {
            animationContainer.remove();
            showFloatingWindow("Congratulations! You won the game!", true);
        }, 7000);
    }

    createWinText(container) {
        const text = document.createElement('div');
        text.textContent = 'YOU WIN!';
        text.style.position = 'absolute';
        text.style.top = '50%';
        text.style.left = '50%';
        text.style.transform = 'translate(-50%, -50%)';
        text.style.fontSize = '0em';
        text.style.fontWeight = 'bold';
        text.style.color = '#FFD700';
        text.style.textShadow = '0 0 10px #FFA500';
        text.style.transition = 'all 1s ease-out';
        container.appendChild(text);

        setTimeout(() => {
            text.style.fontSize = '5em';
            text.style.transform = 'translate(-50%, -50%) scale(1.2)';
        }, 100);

        setTimeout(() => {
            text.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 1100);
    }

    createFireworks(container) {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createFirework(container, colors[Math.floor(Math.random() * colors.length)]);
            }, i * 300);
        }
    }

    createFirework(container, color) {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const firework = {
            x: Math.random() * canvas.width,
            y: canvas.height,
            size: 4,
            color: color,
            velocity: {
                x: Math.random() * 6 - 3,
                y: Math.random() * -3 - 3
            }
        };

        const animate = () => {
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            firework.x += firework.velocity.x;
            firework.y += firework.velocity.y;

            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
            ctx.fillStyle = firework.color;
            ctx.fill();

            if (firework.size > 0.2) {
                firework.size -= 0.1;
                requestAnimationFrame(animate);
            } else {
                this.explodeFirework(ctx, firework.x, firework.y, firework.color);
                setTimeout(() => {
                    canvas.remove();
                }, 1500);
            }
        };

        animate();
    }

    explodeFirework(ctx, x, y, color) {
        const particles = [];
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1;
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 2 + 1,
                color: color,
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                },
                alpha: 1
            });
        }

        const animate = () => {
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            particles.forEach((particle, index) => {
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.velocity.y += 0.05; // Add gravity
                particle.alpha -= 0.01;

                ctx.globalAlpha = particle.alpha;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    createStarburst(container) {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const rays = 50;

        const animate = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < rays; i++) {
                const angle = (i / rays) * Math.PI * 2;
                const length = Math.sin(time / 200 + i * 0.1) * 100 + 100;
                const x = centerX + Math.cos(angle) * length;
                const y = centerY + Math.sin(angle) * length;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `hsl(${(i / rays) * 360}, 100%, 50%)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        animate(0);
    }

    showFloatingWindow(isWin) {
        const message = isWin ? "Congratulations! You won the game." : "Game over! You hit a mine.";
        showFloatingWindow(message, isWin);
    }
}
