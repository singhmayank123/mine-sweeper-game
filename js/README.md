# Minesweeper Game

This is a simple Minesweeper game implemented using HTML, CSS, and JavaScript. The game allows users to register, log in, and compete for high scores on a leaderboard.

## Table of Contents

- [How to Play](#how-to-play)
- [Pages Overview](#pages-overview)
  - [Index Page](#index-page)
  - [Game Page](#game-page)
  - [Login Page](#login-page)
  - [Register Page](#register-page)
  - [Rankings Page](#rankings-page)
- [Development](#development)
- [Setup](#setup)
- [Additional Notes](#additional-notes)

## How to Play

- **Objective**: Reveal all non-mine cells without triggering a mine.
- **Controls**:
  - Click on a cell to reveal it.
  - Right-click on a cell to flag it as a suspected mine.
- **Game Over**: The game ends when you click on a mine.
- **Winning**: Successfully reveal all non-mine cells.

## Pages Overview

### Index Page

- **File**: `index.html`
- **Purpose**: Main entry point for the game.
- **Features**:
  - Displays the game board.
  - Shows a welcome message with the player's name if logged in.
  - Provides a restart button to reset the game.

![Index Page Snapshot](#) *(Insert snapshot here)*

### Game Page

- **File**: `game.html`
- **Purpose**: Interactive game interface.
- **Features**:
  - Allows cell interaction (reveal or flag).
  - Displays the number of remaining mines and a timer.
  - Provides a logout option for logged-in users.

#### Functionality
- **Game Logic**: Handles cell revealing, flagging, and game state (win/lose).
- **Error Handling**: Prevents interaction with already revealed or flagged cells.
- **Input Validation**: Ensures only valid actions are performed on the game board.

![Game Page Snapshot](#) *(Insert snapshot here)*

### Login Page

- **File**: `login.html`
- **Purpose**: User login interface.
- **Features**:
  - Form for entering username/email and password.
  - Validates credentials against stored data.
  - Redirects to the game page upon successful login.

#### Functionality
- **Input Validation**: Checks for empty fields and valid credentials.
- **Error Handling**: Displays error messages for invalid login attempts.

![Login Page Snapshot](#) *(Insert snapshot here)*

### Register Page

- **File**: `register.html`
- **Purpose**: User registration interface.
- **Features**:
  - Form for entering a username, email, and password.
  - Validates input to ensure all fields are filled and unique.
  - Stores user data in local storage.

#### Functionality
- **Input Validation**: Ensures fields are completed and meet criteria (e.g., valid email format).
- **Error Handling**: Checks for duplicate usernames or emails.

![Register Page Snapshot](#) *(Insert snapshot here)*

### Rankings Page

- **File**: `rankings.html`
- **Purpose**: Displays user leaderboard.
- **Features**:
  - Lists users by rank and score in a table.
  - Sorted in descending order of scores.

#### Functionality
- **Data Retrieval**: Fetches and displays rankings from local storage.
- **Error Handling**: Manages cases where no rankings data is available.

![Rankings Page Snapshot](#) *(Insert snapshot here)*

## Development

- **Game Logic**: Implemented in `js/app.js`.
- **Styles**: Defined in `css/styles.css` and `css/com.css`.
- **Data Storage**: Utilizes local storage for user data and scores.

## Setup

1. Clone the repository.
2. Open `index.html` in your browser to start the game.

## Additional Notes

- **Responsive Design**: Ensures the game is playable on various screen sizes.
- **User Experience**: Provides feedback through animations and error messages.

---

This README provides a comprehensive overview of the Minesweeper game, detailing each page and its functionality. Please replace the image placeholders with actual snapshots of each page. If you have any questions or need further assistance, feel free to reach out.
