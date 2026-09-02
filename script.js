// Game variables
let cards = [];
let flipped = [];
let matched = [];
let moves = 0;
let score = 0;
let gameStarted = false;
let gameBoard = document.getElementById('gameBoard');
let startBtn = document.getElementById('startBtn');
let resetBtn = document.getElementById('resetBtn');
let easyBtn = document.getElementById('easyBtn');
let hardBtn = document.getElementById('hardBtn');
let modal = document.getElementById('modal');
let playAgainBtn = document.getElementById('playAgainBtn');
let timerInterval = null;
let secondsElapsed = 0;
let difficulty = 'easy'; // easy, normal, hard

// Emoji pairs for the game
const emojiPairs = [
    '🎮', '🎮',
    '🎨', '🎨',
    '🎭', '🎭',
    '🎪', '🎪',
    '🎸', '🎸',
    '🎹', '🎹',
    '🎺', '🎺',
    '🎻', '🎻',
    '⚽', '⚽',
    '🏀', '🏀',
    '🎾', '🎾',
    '🏐', '🏐',
    '🍕', '🍕',
    '🍔', '🍔',
    '🍟', '🍟',
    '🌭', '🌭',
    '🍎', '🍎',
    '🍌', '🍌',
    '⭐', '⭐',
    '🌟', '🌟',
    '❤️', '❤️',
    '💎', '💎',
    '👑', '👑',
    '🦄', '🦄',
    '🐉', '🐉',
    '🦋', '🦋',
    '🐢', '🐢',
    '🦅', '🦅',
    '🦁', '🦁',
    '🐸', '🐸'
];

// Difficulty configurations
const difficulties = {
    easy: { rows: 4, cols: 4, cards: 16 },
    normal: { rows: 4, cols: 6, cards: 24 },
    hard: { rows: 6, cols: 6, cards: 36 }
};

// Initialize the game
function initGame() {
    cards = [];
    flipped = [];
    matched = [];
    moves = 0;
    score = 0;
    gameStarted = false;
    secondsElapsed = 0;
    
    // Clear timer
    if (timerInterval) clearInterval(timerInterval);
    
    // Update UI
    updateStats();
    
    // Get required number of emoji pairs
    const config = difficulties[difficulty];
    const pairsNeeded = config.cards / 2;
    const selectedEmojis = emojiPairs.slice(0, pairsNeeded * 2);
    
    // Shuffle the cards
    cards = shuffle(selectedEmojis);
    
    // Render the game board
    renderGameBoard();
    
    // Close modal if open
    modal.classList.remove('show');
}

// Shuffle array using Fisher-Yates algorithm
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render game board
function renderGameBoard() {
    gameBoard.innerHTML = '';
    const config = difficulties[difficulty];
    
    // Set grid columns
    gameBoard.classList.remove('easy', 'normal', 'hard');
    gameBoard.classList.add(difficulty);
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.innerText = '❓';
        card.addEventListener('click', () => flipCard(index, card));
        gameBoard.appendChild(card);
    });
}

// Flip a card
function flipCard(index, cardElement) {
    // Check if card is already flipped, matched, or game hasn't started
    if (flipped.includes(index) || matched.includes(index) || !gameStarted) {
        return;
    }
    
    // Flip the card
    flipped.push(index);
    cardElement.classList.add('flipped');
    cardElement.setAttribute('data-emoji', cards[index]);
    cardElement.innerText = cards[index];
    
    // If two cards are flipped, check if they match
    if (flipped.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    const [first, second] = flipped;
    const firstCard = document.querySelector(`[data-index="${first}"]`);
    const secondCard = document.querySelector(`[data-index="${second}"]`);
    
    setTimeout(() => {
        if (cards[first] === cards[second]) {
            // Match found
            matched.push(first, second);
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            score += 10;
            
            flipped = [];
            updateStats();
            
            // Check if game is won
            if (matched.length === cards.length) {
                endGame();
            }
        } else {
            // No match
            flipped = [];
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerText = '❓';
            secondCard.innerText = '❓';
            firstCard.removeAttribute('data-emoji');
            secondCard.removeAttribute('data-emoji');
        }
    }, 600);
}

// Start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startBtn.innerText = '⏸️ Pause';
        startTimer();
    }
}

// Start timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        secondsElapsed++;
        document.getElementById('timer').innerText = secondsElapsed + 's';
    }, 1000);
}

// Update stats display
function updateStats() {
    document.getElementById('score').innerText = score;
    document.getElementById('moves').innerText = moves;
}

// End game
function endGame() {
    gameStarted = false;
    clearInterval(timerInterval);
    startBtn.innerText = '🎯 Start Game';
    
    // Show congratulations modal
    setTimeout(() => {
        document.getElementById('finalScore').innerText = score;
        document.getElementById('finalMoves').innerText = moves;
        document.getElementById('finalTime').innerText = secondsElapsed;
        modal.classList.add('show');
    }, 500);
}

// Event listeners
startBtn.addEventListener('click', startGame);

resetBtn.addEventListener('click', initGame);

easyBtn.addEventListener('click', () => {
    difficulty = 'easy';
    updateDifficultyButtons();
    initGame();
});

hardBtn.addEventListener('click', () => {
    difficulty = 'hard';
    updateDifficultyButtons();
    initGame();
});

playAgainBtn.addEventListener('click', initGame);

// Difficulty selector buttons
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        difficulty = e.target.dataset.difficulty;
        initGame();
    });
});

function updateDifficultyButtons() {
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
}

// Initialize the game when page loads
window.addEventListener('load', () => {
    initGame();
});

// Keyboard controls (optional)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startGame();
    if (e.key === 'r' || e.key === 'R') initGame();
});
