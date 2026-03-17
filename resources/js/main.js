
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

        // Populate hidden fields for form submission
        document.getElementById('hidden-verse').value = currentCard.verse;
        document.getElementById('hidden-reference').value = currentCard.reference;

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

function downloadBackup(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Form Handling
document.getElementById('notes-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const isTauri = !!window.__TAURI_INTERNALS__;
    const notes = document.getElementById('notes-area').value;
    const button = document.getElementById('submit-notes-btn');
    const status = document.getElementById('form-status');

    if (!notes.trim()) {
        alert("Please type some notes before submitting.");
        return;
    }

    if (isTauri) {
        const verse = document.getElementById('hidden-verse').value;
        const ref = document.getElementById('hidden-reference').value;
        const fullContent = `Verse: ${verse} (${ref})\n\nNotes:\n${notes}`;

        try {
            await navigator.clipboard.writeText(fullContent);
            alert("Desktop version: Your verse and notes have been copied to the clipboard!\n\nYou can now paste them into an email to: 3minute@sermonminute.com");
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert("Desktop version: Could not copy to clipboard manually. Please copy everything manually and email it to: 3minute@sermonminute.com");
        }
    } else {
        // Web version: AJAX submission to Formspree
        console.log("Submitting to:", this.action);
        button.disabled = true;
        button.textContent = "Sending...";
        status.textContent = "Connecting to server...";
        status.style.color = "#8a7f86";

        const formData = new FormData(this);
        console.log("Form data entries:");
        for (let [key, value] of formData.entries()) {
            console.log(key, ":", value);
        }

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                status.textContent = "Notes sent! Backup downloaded.";
                status.style.color = "#4CAF50";
                
                // Trigger Backup Download
                const date = new Date().toLocaleDateString().replace(/\//g, '-');
                const filename = `SermonNotes_${date}.txt`;
                const verse = document.getElementById('hidden-verse').value;
                const ref = document.getElementById('hidden-reference').value;
                const email = document.getElementById('submitter-email').value;
                const backupContent = `Sermon Notes Record\nDate: ${new Date().toLocaleString()}\nFrom: ${email}\n\nVerse: ${verse} (${ref})\n\nNotes:\n${notes}`;
                
                downloadBackup(backupContent, filename);

                this.reset();
                // Reset hidden fields and email field too (reset() does email, but hidden fields manually)
                document.getElementById('hidden-verse').value = "";
                document.getElementById('hidden-reference').value = "";
                
                // Copy to clipboard as backup too
                try { await navigator.clipboard.writeText(notes); } catch(e) {}
            } else {
                const data = await response.json();
                console.error("Formspree error data:", data);
                if (data.errors) {
                    status.textContent = "Error: " + data.errors.map(error => error.message).join(", ");
                } else {
                    status.textContent = "Oops! Submission failed (Status " + response.status + ")";
                }
                status.style.color = "#d9534f";
            }
        } catch (error) {
            console.error("Fetch error:", error);
            status.textContent = "Connection error. If you have an ad-blocker, please try disabling it for this site.";
            status.style.color = "#d9534f";
        } finally {
            button.disabled = false;
            button.textContent = "Submit Notes";
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
