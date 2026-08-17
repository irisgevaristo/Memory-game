const gridContainer = document.querySelector('.grid-container');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let selectedTheme = null;

// Configurar ouvintes nos botões de tema
document.querySelectorAll('.theme-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
        // e.target.dataset.theme acede ao atributo 'data-theme' do HTML
        selectedTheme = e.target.dataset.theme;
        navigateTo('mode-screen');
    });
});

// Transição entre telas
function navigateTo(screenId) {
    // Remove a classe 'active' de todas as telas
    document.querySelectorAll('.screen').forEach((screen) => {
        screen.classList.remove('active');
    });
    // Adiciona a classe 'active' apenas à tela pretendida
    document.getElementById(screenId).classList.add('active');
}

// Seleção do modo de jogo
function selectMode(mode) {
    if (mode === 'single') {
        navigateTo('game-screen');
        startGame();
    }
}

// Inicia o jogo com base no tema escolhido
function startGame() {
    score = 0;
    document.querySelector('.score').textContent = score;
    gridContainer.innerHTML = '';
    resetBoard();

    // Procura os dados do JSON
    fetch('./data/cards.json')
        .then((res) => res.json())
        .then((data) => {
            // Se o JSON contiver múltiplos temas, seleciona as cartas do tema escolhido.
            // Se o JSON for um Array direto, utiliza o array diretamente.
            const themeData = data[selectedTheme] ? data[selectedTheme] : data;
            
            // Duplica os cartões para formar os pares
            cards = [...themeData, ...themeData];
            shuffleCards();
            generateCards();
        });
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

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        disableCards();
        score++;
        document.querySelector('.score').textContent = score;
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
    startGame();
}

function backToMenu() {
    navigateTo('theme-screen');
}