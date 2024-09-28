let guessedWord = [];
let currentRow = 0;
let correctWord = '';
let maxAttempts = 6;
let wordLength = 5;
let remainingGuesses;
let score = 0;


let wordDictionary = {}; // JSON word dictionary will be loaded here

function loadWordDictionary() {
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            wordDictionary = data;
            setDifficulty(); // Once loaded, initialize the game
        })
        .catch(error => console.error('Error loading word dictionary:', error));
}


const wordLists = {
    easy: [
        "WIND", "BOOK", "TREE", "MOON", "STAR", "LAKE", "BIRD", "CAMP", "FIRE", "ROAD", 
        "FORK", "BELL", "SHIP", "SNOW", "FISH", "WOLF", "RING", "CORN", "LION", "LAMP"
      ],
    medium: [
        "CHIPS", "GHOST", "BRAVE", "MOUSE", "CLOUD", "HOUSE", "TRAIN", "PLANE", "STORM", 
        "SWORD", "CHAIR", "SHORE", "APPLE", "WATER", "LIGHT", "STONE", "CROWD", "RIVER", 
        "SHARK", "WORLD"
      ],
    hard: [
        "CANDLE", "ORANGE", "PLANTS", "PLANET", "BOTTLE", "MARKET", "FLOORS", "STREAM", 
        "FOREST", "BASKET", "FURNIT", "GUITAR", "CARPET", "STUDIO", "CASTLE", "CIRCLE", 
        "PENCIL", "FAMILY", "SILVER", "ROCKET"
      ],
};

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '&#x232B;']
];

const keyboardContainer = document.getElementById('keyboard');
const wordGrid = document.getElementById('word-grid');
const remainingGuessesDisplay = document.getElementById('remaining-guesses');
const scoreDisplay = document.getElementById('score');

function setDifficulty() {
    let difficulty = document.getElementById('difficulty').value;

    if (difficulty === 'easy') {
        wordLength = 4;
        maxAttempts = 6;
        correctWord = wordLists.easy[Math.floor(Math.random() * wordLists.easy.length)];
        remainingHints = 1; // 1 hint for easy
    } else if (difficulty === 'medium') {
        wordLength = 5;
        maxAttempts = 6;
        correctWord = wordLists.medium[Math.floor(Math.random() * wordLists.medium.length)];
        remainingHints = 2; // 2 hints for medium
    } else if (difficulty === 'hard') {
        wordLength = 6;
        maxAttempts = 6;
        correctWord = wordLists.hard[Math.floor(Math.random() * wordLists.hard.length)];
        remainingHints = 3; // 3 hints for hard
    }

    guessedWord = Array(wordLength).fill('');
    remainingGuesses = maxAttempts;
    updateRemainingGuesses();
    createGrid();
    updateHintDisplay(); // Update hint display
}
function getHint() {
    if (remainingHints > 0) {
        let hintIndices = [];

        // Generate unique random indices based on remaining hints
        while (hintIndices.length < remainingHints) {
            let index = Math.floor(Math.random() * wordLength);
            if (!hintIndices.includes(index)) {
                hintIndices.push(index);
            }
        }

        // Prepare the hint message
        let hintMessage = `Hint: The letters at positions ${hintIndices.map(i => i + 1).join(', ')} are `;
        hintMessage += hintIndices.map(i => `"${correctWord[i]}"`).join(', ');

        alert(hintMessage);
        
        // Update the grid with hint letters
        hintIndices.forEach(index => {
            let box = document.getElementById(`box-${currentRow * wordLength + index}`);
            box.innerText = correctWord[index]; // Show the hint letter in the grid
            box.classList.add('hint'); // Add a hint class for styling (optional)
            guessedWord[index] = correctWord[index]; // Update guessedWord to include the hint letter
        });

        remainingHints--; // Decrease the remaining hints count
        updateHintDisplay(); // Update UI to show remaining hints
    } else {
        alert("No more hints available!");
    }
}

function updateHintDisplay() {
    document.getElementById('remaining-hints').innerText = remainingHints;
}

function createGrid() {
    wordGrid.innerHTML = '';
    wordGrid.style.gridTemplateColumns = `repeat(${wordLength}, 60px)`;

    for (let i = 0; i < maxAttempts * wordLength; i++) {
        const div = document.createElement('div');
        div.id = `box-${i}`;
        wordGrid.appendChild(div);
    }
}

function createKeyboard() {
    keyboardContainer.innerHTML = '';
    keyboardLayout.forEach(row => {
        row.forEach(key => {
            const button = document.createElement('button');
            button.innerHTML = key;
            button.id = `key-${key}`;
            button.onclick = () => handleKeyClick(key);
            keyboardContainer.appendChild(button);
        });
        const br = document.createElement('br');
        keyboardContainer.appendChild(br);
    });
}

function updateRemainingGuesses() {
    remainingGuessesDisplay.innerText = remainingGuesses;
}

function handleKeyClick(key) {
    if (key === '&#x232B;') {
        removeLastLetter();
    } else {
        if (guessedWord.includes('')) {
            const emptyIndex = guessedWord.indexOf('');
            guessedWord[emptyIndex] = key;
            document.getElementById(`box-${currentRow * wordLength + emptyIndex}`).innerText = key;
        }
    }
}

function removeLastLetter() {
    // Loop backward through guessedWord array to find the last non-empty character
    for (let i = guessedWord.length - 1; i >= 0; i--) {
        if (guessedWord[i] !== '') {
            guessedWord[i] = ''; // Remove the character
            document.getElementById(`box-${currentRow * wordLength + i}`).innerText = ''; // Clear the box in the grid
            break; // Exit the loop after removing the last character
        }
    }
}


function resetGuess() {
    guessedWord = Array(wordLength).fill('');
}

function submitGuess() {
    if (!guessedWord.includes('')) {
        let correctGuesses = 0;

        guessedWord.forEach((letter, index) => {
            let box = document.getElementById(`box-${currentRow * wordLength + index}`);
            let key = document.getElementById(`key-${letter}`);

            if (letter === correctWord[index]) {
                box.classList.add('green');
                key.classList.add('green');
                correctGuesses++;
            } else if (correctWord.includes(letter)) {
                box.classList.add('yellow');
                key.classList.add('yellow');
            } else {
                box.classList.add('gray');
                key.classList.add('gray');
            }
        });

        if (correctGuesses === wordLength) {
            score += 10;
            updateScore();
            alert(`Great! You guessed the word: ${correctWord}.`);
            // Move to the next row without clearing the current row
            currentRow++;
            remainingGuesses--;
            updateRemainingGuesses();
            resetGuess(); // Prepare for the next guess in the new row
        } else {
            // User has not guessed correctly, so prepare for the next attempt
            currentRow++;
            remainingGuesses--;
            updateRemainingGuesses();
            resetGuess(); // Reset the guessedWord for the next row

            if (remainingGuesses === 0) {
                alert(`Out of guesses! The word was: ${correctWord}`);
                resetGame();
            }
        }
    }
}


function updateScore() {
    scoreDisplay.innerText = score;
}

function resetGame() {
    currentRow = 0;
    setDifficulty();
}

setDifficulty();
createKeyboard();
