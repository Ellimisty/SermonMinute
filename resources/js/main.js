
let allCards = [];
let deck = [];
let currentCard = null;
let timerInterval = null;
let timeLeft = 180;
let isTimerRunning = false;
let gameMode = 'classic'; // 'classic' or 'challenge'
let currentPhase = 'prep'; // 'prep' or 'preach'
let drawnCards = [];

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
    
    // Reset Card 1
    document.getElementById('card-verse-1').textContent = "Pull a card to begin your sermon.";
    document.getElementById('card-reference-1').textContent = "";
    document.getElementById('card-topic-front-1').textContent = "Topic";
    document.getElementById('card-prompts-1').innerHTML = "";
    document.getElementById('main-card-1').classList.remove('flipped');

    // Reset Card 2
    document.getElementById('card-verse-2').textContent = "";
    document.getElementById('card-reference-2').textContent = "";
    document.getElementById('card-topic-front-2').textContent = "Topic";
    document.getElementById('card-prompts-2').innerHTML = "";
    document.getElementById('main-card-2').classList.remove('flipped');
    
    drawnCards = [];
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
    const minNeeded = gameMode === 'classic' ? 1 : 2;
    if (deck.length < minNeeded) {
        alert("Not enough cards left! Resetting...");
        resetDeck();
        return;
    }

    // Reset flip states
    document.getElementById('main-card-1').classList.remove('flipped');
    document.getElementById('main-card-2').classList.remove('flipped');

    drawnCards = [];
    drawnCards.push(deck.pop());
    if (gameMode === 'challenge') {
        drawnCards.push(deck.pop());
    }

    updateDeckCount();

    // Small delay to allow flip animation to reset
    setTimeout(() => {
        // Populate Card 1
        const c1 = drawnCards[0];
        document.getElementById('card-verse-1').textContent = `"${c1.verse}"`;
        document.getElementById('card-reference-1').textContent = c1.reference;
        document.getElementById('card-topic-front-1').textContent = c1.topic;
        
        const L1 = document.getElementById('card-prompts-1');
        L1.innerHTML = '';
        c1.prompts.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            L1.appendChild(li);
        });

        // Set hidden fields
        document.getElementById('hidden-verse-1').value = c1.verse;
        document.getElementById('hidden-reference-1').value = c1.reference;

        if (gameMode === 'challenge') {
            const c2 = drawnCards[1];
            document.getElementById('card-verse-2').textContent = `"${c2.verse}"`;
            document.getElementById('card-reference-2').textContent = c2.reference;
            document.getElementById('card-topic-front-2').textContent = c2.topic;
            
            const L2 = document.getElementById('card-prompts-2');
            L2.innerHTML = '';
            c2.prompts.forEach(p => {
                const li = document.createElement('li');
                li.textContent = p;
                L2.appendChild(li);
            });

            document.getElementById('hidden-verse-2').value = c2.verse;
            document.getElementById('hidden-reference-2').value = c2.reference;
        }

        resetTimer();
    }, 200);
}

function toggleFlip(index) {
    if (drawnCards.length < index) return;
    const cardEl = document.getElementById(`main-card-${index}`);
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
            
            // Phase transition logic for Challenge Mode
            if (gameMode === 'challenge' && currentPhase === 'prep' && timeLeft <= 300) {
                currentPhase = 'preach';
                document.getElementById('phase-label').textContent = "PREACH PHASE";
                // Optional: add a sound here
            }

            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                document.getElementById('timer-btn').textContent = "Time's Up!";
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
    if (gameMode === 'classic') {
        timeLeft = 180;
        document.getElementById('phase-label').classList.remove('visible');
    } else {
        timeLeft = 330; // 5:30
        currentPhase = 'prep';
        const label = document.getElementById('phase-label');
        label.textContent = "PREP PHASE";
        label.classList.add('visible');
    }
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

    const progressTotal = gameMode === 'classic' ? 180 : 330;
    const progress = (timeLeft / progressTotal) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Event Listeners
document.getElementById('draw-btn').addEventListener('click', drawCard);
document.getElementById('main-card-1').addEventListener('click', () => toggleFlip(1));
document.getElementById('main-card-2').addEventListener('click', () => toggleFlip(2));
document.getElementById('timer-btn').addEventListener('click', toggleTimer);
document.getElementById('reset-btn').addEventListener('click', resetDeck);

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (isTimerRunning) {
            if (!confirm("A timer is running. Switch modes and reset?")) return;
        }
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        gameMode = this.dataset.mode;
        
        // Update UI for mode
        const card2 = document.getElementById('active-card-2');
        if (gameMode === 'challenge') {
            card2.classList.remove('hidden');
        } else {
            card2.classList.add('hidden');
        }
        
        resetDeck();
    });
});

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
                
                let verseInfo = "";
                if (gameMode === 'classic') {
                    verseInfo = `Verse: ${document.getElementById('hidden-verse-1').value} (${document.getElementById('hidden-reference-1').value})`;
                } else {
                    verseInfo = `Verse 1: ${document.getElementById('hidden-verse-1').value} (${document.getElementById('hidden-reference-1').value})\nVerse 2: ${document.getElementById('hidden-verse-2').value} (${document.getElementById('hidden-reference-2').value})`;
                }

                const email = document.getElementById('submitter-email').value;
                const backupContent = `Sermon Notes Record\nDate: ${new Date().toLocaleString()}\nFrom: ${email}\nMode: ${gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}\n\n${verseInfo}\n\nNotes:\n${notes}`;
                
                downloadBackup(backupContent, filename);

                this.reset();
                // Reset hidden fields
                document.getElementById('hidden-verse-1').value = "";
                document.getElementById('hidden-reference-1').value = "";
                document.getElementById('hidden-verse-2').value = "";
                document.getElementById('hidden-reference-2').value = "";
                
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
