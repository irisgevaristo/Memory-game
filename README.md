# Memory-game

A browser-based Card Memory Game built with HTML, CSS, and JavaScript, featuring two game modes and multiple themes.

In Memory Game, players flip cards to find matching pairs. The key objective is to match all pairs with the fewest moves or in the least amount of time, or score the most points, depending on whether you are playing in single-player or two-player mode.

## Table of contents

- [Features](#-features)
- [Software architecture and structure](#software-architecture-and-structure)
- [Running the game](#-running-the-game)
  - [Local server](#local-server)
  - [GitHub Pages](#github-pages)
- [Game rules and mechanics](#game-rules-and-mechanics)
  - [Game modes](#game-modes)
  - [Gameplay flow](#gameplay-flow)
- [Author](#-author)

## Features

- **Two Game Modes:** Support for Single Player and Two Players (pass-and-play with custom player names).
- **Themed Decks:** Choose between themes like Monuments and Flags loaded dynamically from JSON.
- **Responsive Layout:** Optimized for both desktop and mobile devices across different orientations.

## Software architecture and structure

The application is structured using a clean client-side architecture with vanilla JavaScript, HTML5, and CSS3:

- **HTML (`index.html`)**
   - **Internal Representation:** Defines the structural views (Mode selection screen, Theme selection screen, Game screen, and Win screen).
   - **Interface:** Manages UI transitions and dynamic visibility states.

- **JavaScript (`index.js`)**
   - **Internal Representation:** Handles game state, card shuffling, timer counting, turn management, and local statistics.

- **Styles (`style.css`)**
   - **Internal Representation:** Modern layout utilizing CSS Grid, Flexbox, and CSS variables/clamp functions for responsiveness.

## Running the game

Because the game fetches card assets dynamically using `fetch()` for the JSON data file, it requires a local server or a hosting platform to avoid CORS policy restrictions.

### Local server
The easiest way to run this project locally is using a development server with live reload capabilities, such as the **Live Server** extension in Visual Studio Code:

1. Clone or download this repository.
2. Open the project folder in **Visual Studio Code**.
3. Install the **Live Server** extension (by Ritwick Dey) from the VS Code Extensions marketplace if you haven't already.
4. Open the `index.html` file in the editor.
5. Right-click anywhere in the editor and select **"Open with Live Server"** (or click the "Go Live" button in the status bar at the bottom right).
6. Your default web browser will automatically open the game at `http://localhost:5500` (or a similar local port).

### GitHub Pages
You can play the game directly in your web browser without installing anything by visiting the live version hosted on GitHub Pages: **[Memory Game on GitHub Pages](https://irisgevaristo.github.io/Memory-game/)**

## Game rules and mechanics

### Game modes
- `Single player`: Play solo to test your memory. Tracks elapsed time, current score, wrong moves, and your best time yet.
- `Two players`: Local pass-and-play multiplayer where two players input their custom names and take turns matching pairs to score points across rounds.

### Gameplay flow
1. Choose your preferred game mode and input names if playing with two players.
2. Select a visual theme (Monuments or Flags).
3. On your turn, click any two cards to flip them and reveal their hidden images.
4. If the cards match, they stay face-up and you earn a point. If they do not match, they flip back over after a short delay, and the turn passes (in two-player mode).
5. Victory Condition: The game ends when all card pairs have been successfully matched, displaying the final stats or winner.
6. Unless you click on `Main Menu`, your best time (if playing alone) or your overall scores (if playing with two players) will continue being updated if you play another round.

## Author

- **Author:** Íris Gaspar Evaristo
- **License:** MIT License © 2026 Íris Evaristo