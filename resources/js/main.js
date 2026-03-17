
let allCards = [];
let deck = [];
let currentCard = null;
let timerInterval = null;
let timeLeft = 180; // 3 minutes in seconds
let isTimerRunning = false;

async function loadCards() {
    try {
        const response = await fetch('data/cards.json');
        allCards = await response.json();
        resetDeck();
    } catch (err) {
        console.error("Failed to load cards:", err);
    }
}

function resetDeck() {
    deck = [...allCards];
    shuffleDeck(deck);
    updateDeckCount();
    document.getElementById('card-verse').textContent = "Pull a card to begin your sermon.";
    document.getElementById('card-reference').textContent = "";
    document.getElementById('card-topic-front').textContent = "Topic";
    resetTimer();
}

function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateDeckCount() {
    document.getElementById('deck-count').textContent = `Cards remaining: ${deck.length}`;
}

function drawCard() {
    if (deck.length === 0) {
        alert("Deck is empty! Resetting...");
        resetDeck();
        return;
    }

    // Reset flip state if needed
    const cardEl = document.getElementById('main-card');
    cardEl.classList.remove('flipped');

    currentCard = deck.pop();
    updateDeckCount();

    // Small delay to allow flip animation to reset before changing content
    setTimeout(() => {
        document.getElementById('card-verse').textContent = `"${currentCard.verse}"`;
        document.getElementById('card-reference').textContent = currentCard.reference;
        document.getElementById('card-topic-front').textContent = currentCard.topic;

        const promptsList = document.getElementById('card-prompts');
        promptsList.innerHTML = '';
        currentCard.prompts.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            promptsList.appendChild(li);
        });

        resetTimer();
    }, 200);
}

function toggleFlip() {
    if (!currentCard) return;
    const cardEl = document.getElementById('main-card');
    cardEl.classList.toggle('flipped');
}

function toggleTimer() {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        document.getElementById('timer-btn').textContent = "Pause Timer";
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                document.getElementById('timer-btn').textContent = "Time's Up!";
                // Optional: Play a sound or notification
            }
        }, 1000);
    }
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('timer-btn').textContent = "Resume Timer";
}

function resetTimer() {
    pauseTimer();
    timeLeft = 180;
    updateTimerDisplay();
    document.getElementById('timer-btn').textContent = "Start Timer";
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerEl = document.getElementById('timer');
    timerEl.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Color feedback
    timerEl.classList.remove('warning', 'danger');
    if (timeLeft <= 30) {
        timerEl.classList.add('danger');
    } else if (timeLeft <= 60) {
        timerEl.classList.add('warning');
    }

    const progress = (timeLeft / 180) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Event Listeners
document.getElementById('draw-btn').addEventListener('click', drawCard);
document.getElementById('main-card').addEventListener('click', toggleFlip);
document.getElementById('timer-btn').addEventListener('click', toggleTimer);
document.getElementById('reset-btn').addEventListener('click', resetDeck);

// Form Handling
document.getElementById('notes-form').addEventListener('submit', async function(e) {
    const isTauri = !!window.__TAURI_INTERNALS__;
    
    if (isTauri) {
        e.preventDefault();
        const notes = document.getElementById('notes-area').value;
        if (!notes.trim()) {
            alert("Please type some notes before submitting.");
            return;
        }

        try {
            await navigator.clipboard.writeText(notes);
            alert("Desktop version: Your notes have been copied to the clipboard!\n\nYou can now paste them into an email to: 3minute@sermonminute.com");
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert("Desktop version: Could not copy to clipboard manually. Please copy your notes manually and email them to: 3minute@sermonminute.com");
        }
    } else {
        // In the web version on Cloudflare, we use the mailto: action by default
        // but we can also copy to clipboard as a backup to make it easier for the user
        const notes = document.getElementById('notes-area').value;
        try {
            await navigator.clipboard.writeText(notes);
            console.log("Notes copied to clipboard as backup");
        } catch (err) {
            // silent fail for copy backup in web
        }
    }
});

// Rules toggle
document.getElementById('rules-toggle').addEventListener('click', function() {
    const content = document.getElementById('rules-content');
    const icon = document.getElementById('toggle-icon');
    content.classList.toggle('visible');
    icon.classList.toggle('open');
});

// Load everything
loadCards();
updateTimerDisplay();
