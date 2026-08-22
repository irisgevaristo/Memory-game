const gridContainer = document.querySelector('.grid-container');

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let moves = 0;
let gameMode = 'single';
let currentPlayer = '1';
let firstPlayerOfRound = '1';

// Nomes personalizados dos jogadores
let player1Name = 'Player 1';
let player2Name = 'Player 2';

let score1 = 0;
let score2 = 0;
let rounds1 = 0;
let rounds2 = 0;
let bestTimeSeconds = null;
let selectedTheme = null;
let timerInterval = null;
let secondsElapsed = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mode-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            selectMode(e.currentTarget.dataset.mode);
        });
    });

    const startTwoPlayersBtn = document.getElementById('start-two-players-btn');
    if (startTwoPlayersBtn) {
        startTwoPlayersBtn.addEventListener('click', confirmTwoPlayersNames);
    }

    document.querySelectorAll('.theme-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            selectedTheme = e.currentTarget.dataset.theme;
            navigateTo('game-screen');
            startGame();
        });
    });

    document.querySelectorAll('#game-screen .restart-button').forEach((button) => {
        button.addEventListener('click', restartGame);
    });

    const playAgainBtn = document.getElementById('play-again-button');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', playAgain);
    }

    document.querySelectorAll('.menu-button').forEach((button) => {
        button.addEventListener('click', backToMenu);
    });
});

function selectMode(mode) {
    if (gameMode !== mode) {
        rounds1 = 0;
        rounds2 = 0;
    }
    gameMode = mode;

    const modeScreen = document.getElementById('mode-screen');
    const namesContainer = document.getElementById('player-names-container');
    const twoPlayersBtn = document.querySelector('.mode-button[data-mode="two"]');

    if (gameMode === 'two') {
        if (modeScreen) modeScreen.classList.add('shift-up');
        if (namesContainer) namesContainer.classList.add('show');
        if (twoPlayersBtn) twoPlayersBtn.classList.add('selected');
    } else {
        if (modeScreen) modeScreen.classList.remove('shift-up');
        if (namesContainer) namesContainer.classList.remove('show');
        if (twoPlayersBtn) twoPlayersBtn.classList.remove('selected');
        navigateTo('theme-screen');
    }
}

function confirmTwoPlayersNames() {
    const p1Input = document.getElementById('player1-name-input').value.trim();
    const p2Input = document.getElementById('player2-name-input').value.trim();

    player1Name = p1Input !== '' ? p1Input : 'Player 1';
    player2Name = p2Input !== '' ? p2Input : 'Player 2';

    firstPlayerOfRound = Math.random() < 0.5 ? '1' : '2';

    navigateTo('theme-screen');
}

function updatePlayerLabels() {
    const labelP1 = document.getElementById('label-player-1');
    const labelP2 = document.getElementById('label-player-2');
    const winLabelP1 = document.getElementById('win-label-player-1');
    const winLabelP2 = document.getElementById('win-label-player-2');

    if (labelP1) labelP1.textContent = player1Name;
    if (labelP2) labelP2.textContent = player2Name;
    if (winLabelP1) winLabelP1.textContent = player1Name;
    if (winLabelP2) winLabelP2.textContent = player2Name;
}

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach((screen) => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startTimer() {
    secondsElapsed = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const timerElement = document.getElementById('timer');

    if (timerElement) {
        timerElement.textContent = formattedTime;
    }
}

function shuffleCards() {
    let currentIndex = cards.length, randomIndex, tempValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        tempValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = tempValue;
    }
}

function generateCards() {
    gridContainer.innerHTML = '';

    for (let card of cards) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-name', card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="card-image" src="${card.image}" alt="${card.name}" />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener('click', flipCard);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flipped');
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    if (gameMode === 'single') {
        moves++;
        document.getElementById('moves').textContent = moves;
    }
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
        if (gameMode === 'single') {
            score++;
            document.getElementById('score').textContent = score;
        } else {
            if (currentPlayer === '1') {
                score1++;
                document.getElementById('score-1').textContent = score1;
            } else {
                score2++;
                document.getElementById('score-2').textContent = score2;
            }
        }
        const totalPairsFound = gameMode === 'single' ? score : (score1 + score2);
        if (totalPairsFound === cards.length / 2) {
            winGame();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        if (firstCard && secondCard) {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
        }
        if (gameMode === 'two') {
            currentPlayer = currentPlayer === '1' ? '2' : '1';
            updateTurnDisplay();
        }
        resetBoard();
    }, 1000);
}

function startGame() {
    score = 0;
    moves = 0;
    score1 = 0;
    score2 = 0;
    currentPlayer = firstPlayerOfRound;

    updatePlayerLabels();

    const singleStats = document.getElementById('single-player-stats');
    const twoStats = document.getElementById('two-player-stats');

    if (gameMode === 'single') {
        singleStats.classList.remove('hidden');
        singleStats.classList.add('visible-flex');
        twoStats.classList.add('hidden');
        twoStats.classList.remove('visible-flex');
        document.getElementById('score').textContent = score;
        document.getElementById('moves').textContent = moves;
        resetTimer();
        startTimer();
    } else {
        singleStats.classList.add('hidden');
        singleStats.classList.remove('visible-flex');
        twoStats.classList.remove('hidden');
        twoStats.classList.add('visible-flex');
        document.getElementById('score-1').textContent = score1;
        document.getElementById('score-2').textContent = score2;
        updateTurnDisplay();
    }
    resetBoard();
    fetch('./data/cards.json')
        .then((res) => res.json())
        .then((data) => {
            const themeData = data[selectedTheme] ? data[selectedTheme] : data;
            cards = [...themeData, ...themeData];
            shuffleCards();
            generateCards();
            if (gameMode === 'single') {
                document.getElementById('max').textContent = cards.length / 2;
            }
        });
}

function updateTurnDisplay() {
    const box1 = document.getElementById('player-1-box');
    const box2 = document.getElementById('player-2-box');

    if (currentPlayer === '1') {
        box1.classList.add('active-turn');
        box2.classList.remove('active-turn');
    } else {
        box2.classList.add('active-turn');
        box1.classList.remove('active-turn');
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function winGame() {
    resetTimer();
    const winTitle = document.getElementById('win-title');
    const singleWinStats = document.getElementById('single-player-win-stats');
    const twoWinStats = document.getElementById('two-player-win-stats');
    const playAgainBtn = document.getElementById('play-again-button');

    if (gameMode === 'single') {
        const formattedTime = formatTime(secondsElapsed);
        winTitle.textContent = "Congratulations! You won!";
        singleWinStats.classList.remove('hidden');
        singleWinStats.classList.add('visible-flex');
        twoWinStats.classList.add('hidden');
        twoWinStats.classList.remove('visible-flex');
        if (playAgainBtn) playAgainBtn.textContent = "Play Again";
        document.getElementById('final-time-single').textContent = formattedTime;
        let finalMoves = document.getElementById('moves').textContent;
        document.getElementById('final-moves').textContent = finalMoves - cards.length / 2;
        if (bestTimeSeconds === null || secondsElapsed < bestTimeSeconds) {
            bestTimeSeconds = secondsElapsed;
        }
        document.getElementById('best-time').textContent = formatTime(bestTimeSeconds);
    } else {
        if (score1 > score2) {
            winTitle.textContent = `${player1Name} wins!`;
            rounds1++;
            firstPlayerOfRound = '1';
        } else if (score2 > score1) {
            winTitle.textContent = `${player2Name} wins!`;
            rounds2++;
            firstPlayerOfRound = '2';
        } else {
            winTitle.textContent = "It's a tie!";
        }

        singleWinStats.classList.add('hidden');
        singleWinStats.classList.remove('visible-flex');
        twoWinStats.classList.remove('hidden');
        twoWinStats.classList.add('visible-flex');
        if (playAgainBtn) playAgainBtn.textContent = "New Round";
        document.getElementById('rounds-1').textContent = rounds1;
        document.getElementById('rounds-2').textContent = rounds2;
    }
    setTimeout(() => {
        navigateTo('win-screen');
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function backToMenu() {
    resetTimer();
    rounds1 = 0;
    rounds2 = 0;
    bestTimeSeconds = null;

    player1Name = 'Player 1';
    player2Name = 'Player 2';
    const p1Input = document.getElementById('player1-name-input');
    const p2Input = document.getElementById('player2-name-input');
    if (p1Input) p1Input.value = '';
    if (p2Input) p2Input.value = '';

    const modeScreen = document.getElementById('mode-screen');
    const namesContainer = document.getElementById('player-names-container');
    const twoPlayersBtn = document.querySelector('.mode-button[data-mode="two"]');

    if (modeScreen) modeScreen.classList.remove('shift-up');
    if (namesContainer) namesContainer.classList.remove('show');
    if (twoPlayersBtn) twoPlayersBtn.classList.remove('selected');

    navigateTo('mode-screen');
}

function playAgain() {
    resetTimer();
    navigateTo('theme-screen');
}

function restartGame() {
    resetTimer();
    navigateTo('game-screen');
    startGame();
}