const gridContainer = document.querySelector('.grid-container');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;

// Variáveis de Estado do Jogo
let score = 0;
let attempts = 0;
let selectedTheme = null;
let timerInterval = null;
let secondsElapsed = 0;

// Configurar ouvintes nos botões de tema
document.querySelectorAll('.theme-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        selectedTheme = e.target.dataset.theme;
        navigateTo('mode-screen');
    });
});

// Navegação entre telas
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach((screen) => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function selectMode(mode) {
    if (mode === 'single') {
        navigateTo('game-screen');
        startGame();
    }
}

// Inicializa ou reinicia o jogo
function startGame() {
    // Reset dos contadores
    score = 0;
    attempts = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('attempts').textContent = attempts;
    
    // Reiniciar cronómetro
    resetTimer();
    startTimer();

    gridContainer.innerHTML = '';
    resetBoard();

    // Carregar dados
    fetch('./data/cards.json')
        .then((res) => res.json())
        .then((data) => {
            const themeData = data[selectedTheme] ? data[selectedTheme] : data;
            cards = [...themeData, ...themeData];
            shuffleCards();
            generateCards();
            document.getElementById('max').textContent = cards.length / 2;
        });
    
}

// Timer
function startTimer() {
    secondsElapsed = 0;
    updateTimerDisplay();
    // setInterval executa a função a cada 1000ms
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
    document.getElementById('timer').textContent = formattedTime;
}

function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        tempValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        tempValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = tempValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-name', card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="card-image" src="${card.image}" />
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

    attempts++;
    document.getElementById('attempts').textContent = attempts;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        disableCards();
        score++;
        document.getElementById('score').textContent = score;

        if (score === cards.length / 2) {
            winGame();
        }
    } else {
        unflipCards();
    }
}

function winGame() {
    resetTimer();
    setTimeout(() => {
        navigateTo('win-screen');
    }, 1000);
    let finalTime = document.getElementById('timer').textContent;
    let finalAttempts = document.getElementById('attempts').textContent;
    document.getElementById('final-time').textContent = finalTime;
    document.getElementById('final-attempts').textContent = finalAttempts - cards.length / 2;
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
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

function backToMenu() {
    resetTimer();
    navigateTo('theme-screen');
}