const gridContainer = document.querySelector('.grid-container');

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let score = 0;
let attempts = 0;
let gameMode = 'single';
let currentPlayer = 'A';
let scoreA = 0;
let scoreB = 0;

let roundsA = 0;
let roundsB = 0;

let selectedTheme = null;
let timerInterval = null;
let secondsElapsed = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mode-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            selectMode(e.currentTarget.dataset.mode);
        });
    });

    document.querySelectorAll('.theme-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            selectedTheme = e.currentTarget.dataset.theme;
            navigateTo('game-screen');
            startGame();
        });
    });

    document.querySelectorAll('.restart-button').forEach((button) => {
        button.addEventListener('click', restartGame);
    });

    document.querySelectorAll('.menu-button').forEach((button) => {
        button.addEventListener('click', backToMenu);
    });
});

function selectMode(mode) {
    if (gameMode !== mode) {
        roundsA = 0;
        roundsB = 0;
    }
    gameMode = mode;
    navigateTo('theme-screen');
}

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach((screen) => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function backToMenu() {
    resetTimer();
    roundsA = 0;
    roundsB = 0;
    navigateTo('mode-screen');
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
    
    document.querySelectorAll('#timer').forEach((element) => {
        element.textContent = formattedTime;
    });
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
        attempts++;
        document.getElementById('attempts').textContent = attempts;
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
            if (currentPlayer === 'A') {
                scoreA++;
                document.getElementById('score-a').textContent = scoreA;
            } else {
                scoreB++;
                document.getElementById('score-b').textContent = scoreB;
            }
        }

        const totalPairsFound = gameMode === 'single' ? score : (scoreA + scoreB);
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
            currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
            updateTurnDisplay();
        }

        resetBoard();
    }, 1000);
}

function startGame() {
    score = 0;
    attempts = 0;
    scoreA = 0;
    scoreB = 0;
    currentPlayer = 'A';
    
    const singleStats = document.getElementById('single-player-stats');
    const twoStats = document.getElementById('two-player-stats');

    if (gameMode === 'single') {
        singleStats.classList.remove('hidden');
        singleStats.classList.add('visible-flex');
        twoStats.classList.add('hidden');
        twoStats.classList.remove('visible-flex');

        document.getElementById('score').textContent = score;
        document.getElementById('attempts').textContent = attempts;
    } else {
        singleStats.classList.add('hidden');
        singleStats.classList.remove('visible-flex');
        twoStats.classList.remove('hidden');
        twoStats.classList.add('visible-flex');

        document.getElementById('score-a').textContent = scoreA;
        document.getElementById('score-b').textContent = scoreB;
        updateTurnDisplay();
    }

    resetTimer();
    startTimer();
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
    const boxA = document.getElementById('player-a-box');
    const boxB = document.getElementById('player-b-box');

    if (currentPlayer === 'A') {
        boxA.classList.add('active-turn');
        boxB.classList.remove('active-turn');
    } else {
        boxB.classList.add('active-turn');
        boxA.classList.remove('active-turn');
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function winGame() {
    resetTimer();
    
    const formattedTime = formatTime(secondsElapsed);

    const winTitle = document.getElementById('win-title');
    const singleWinStats = document.getElementById('single-player-win-stats');
    const twoWinStats = document.getElementById('two-player-win-stats');
    const restartBtn = document.getElementById('restart-button');

    if (gameMode === 'single') {
        winTitle.textContent = "Congratulations! You won!";
        
        singleWinStats.classList.remove('hidden');
        singleWinStats.classList.add('visible-flex');
        
        twoWinStats.classList.add('hidden');
        twoWinStats.classList.remove('visible-flex');

        restartBtn.textContent = "Play Again";

        document.getElementById('final-time-single').textContent = formattedTime;
        let finalAttempts = document.getElementById('attempts').textContent;
        document.getElementById('final-attempts').textContent = finalAttempts - cards.length / 2;

        const storageKey = `bestTime_${selectedTheme}`;
        let bestSeconds = localStorage.getItem(storageKey);

        if (!bestSeconds || secondsElapsed < parseInt(bestSeconds, 10)) {
            bestSeconds = secondsElapsed;
            localStorage.setItem(storageKey, bestSeconds);
        }

        document.getElementById('best-time').textContent = formatTime(parseInt(bestSeconds, 10));
    } else {
        winTitle.textContent = scoreA > scoreB ? "Player A wins!" : (scoreB > scoreA ? "Player B wins!" : "It's a tie!");
        if (scoreA > scoreB) roundsA++;
        else if (scoreB > scoreA) roundsB++;

        singleWinStats.classList.add('hidden');
        singleWinStats.classList.remove('visible-flex');

        twoWinStats.classList.remove('hidden');
        twoWinStats.classList.add('visible-flex');

        restartBtn.textContent = "New Round";

        document.getElementById('final-time-two').textContent = formattedTime;
        document.getElementById('rounds-a').textContent = roundsA;
        document.getElementById('rounds-b').textContent = roundsB;
    }

    setTimeout(() => {
        navigateTo('win-screen');
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function restartGame() {
    resetTimer();
    navigateTo('game-screen');
    startGame();
}