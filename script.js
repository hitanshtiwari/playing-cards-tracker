const suits = ['♠', '♣', '♦', '♥'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suitColors = {
    '♠': 'black', 
    '♣': 'grey', 
    '♦': '#B22222',  // Fire Brick
    '♥': '#800808'   // Blood Red
};

// Track the state and history for UNDO functionality
let history = [];

// Create Cards in Play section
const cardsGrid = document.getElementById('cards-grid');

suits.forEach(suit => {
    ranks.forEach(rank => {
        const btn = document.createElement('button');
        btn.className = 'card-button';
        btn.classList.add(suitColors[suit]);
        btn.textContent = `${suit} ${rank}`;
        btn.dataset.suit = suit;
        btn.dataset.rank = rank;
        btn.addEventListener('click', () => cardClicked(suit, rank));
        cardsGrid.appendChild(btn);
    });
});

// Create Suit Ownership section
const ownershipGrid = document.getElementById('ownership-grid');

for (let player = 0; player < 4; player++) {
    const playerFrame = document.createElement('div');
    playerFrame.className = 'player-frame';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Player ${player + 1} Name`;
    playerFrame.appendChild(input);

    suits.forEach(suit => {
        const btn = document.createElement('button');
        btn.className = 'suit-button';
        btn.classList.add(suitColors[suit]);
        btn.textContent = suit;
        btn.dataset.suit = suit;
        btn.dataset.player = player;
        btn.addEventListener('click', () => suitClicked(suit, player));
        playerFrame.appendChild(btn);
    });

    ownershipGrid.appendChild(playerFrame);
}

// Initialize colors
function initializeColors() {
    document.querySelectorAll('.card-button, .suit-button').forEach(btn => {
        const suit = btn.dataset.suit;
        if (suit) {
            const color = suitColors[suit];
            btn.style.backgroundColor = color;
            btn.style.color = color === 'white' ? 'black' : 'white';
        } else {
            btn.style.backgroundColor = 'white';
            btn.style.color = 'black';
        }
    });
}

// Handle card button clicks
function cardClicked(suit, rank) {
    const btn = Array.from(cardsGrid.getElementsByClassName('card-button'))
        .find(b => b.dataset.suit === suit && b.dataset.rank === rank);

    const currentColor = btn.style.backgroundColor;
    const newColor = currentColor === 'white' ? suitColors[suit] : 'white';
    const newFg = currentColor === 'white' ? 'white' : 'black';

    history.push({ element: btn, oldColor: currentColor, oldFg: btn.style.color });
    btn.style.backgroundColor = newColor;
    btn.style.color = newFg;
}

// Handle suit button clicks
function suitClicked(suit, player) {
    console.log(`Suit clicked: ${suit}, Player: ${player}`); // Debugging output

    const btn = Array.from(ownershipGrid.getElementsByClassName('suit-button'))
        .find(b => b.dataset.suit === suit && b.dataset.player == player);

    if (!btn) {
        console.error('Button not found!');
        return;
    }

    console.log(`Button found: ${btn.textContent}`); // Debugging output

    const currentColor = btn.style.backgroundColor;
    const newColor = currentColor === 'white' ? suitColors[suit] : 'white';
    const newFg = currentColor === 'white' ? 'white' : 'black';

    history.push({ element: btn, oldColor: currentColor, oldFg: btn.style.color });
    btn.style.backgroundColor = newColor;
    btn.style.color = newFg;
}

// Handle undo action
function undo() {
    if (history.length > 0) {
        const { element, oldColor, oldFg } = history.pop();
        element.style.backgroundColor = oldColor;
        element.style.color = oldFg;
    }
}

// Handle reset action
function reset() {
    history = [];
    initializeColors();
}

// Initialize colors on page load
initializeColors();

// Add event listeners to control buttons
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('reset').addEventListener('click', reset);
