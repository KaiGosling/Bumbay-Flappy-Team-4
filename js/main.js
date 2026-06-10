// =====================
// RESPONSIVE SCALER
// =====================
function scaleGame() {
    const root  = document.getElementById("game-root");
    if (!root) return;

    const isMob  = document.body.classList.contains("mobile-mode");
    const BASE_W = isMob ? 360 : 400;
    const BASE_H = isMob ? 640 : 600;

    const vw = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    const PADDING = 16;
    const scale   = Math.min((vw - PADDING * 2) / BASE_W, (vh - PADDING * 2) / BASE_H);

    root.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", scaleGame);
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scaleGame);
}
scaleGame();

// =====================
// MODE (desktop / mobile)
// =====================
let isMobile = false;

function toggleMode() {
    isMobile = !isMobile;

    const toggle         = document.getElementById("modeToggle");
    const name           = document.getElementById("modeName");
    const mobileControls = document.getElementById("mobileControls");

    if (isMobile) {
        toggle.classList.add("mobile-mode");
        document.body.classList.add("mobile-mode");
        name.textContent = "MOBILE";

        canvas.width  = 360;
        canvas.height = 640;
        ctx.imageSmoothingEnabled = false;

        if (gameState === "playing") {
            mobileControls.classList.remove("hidden");
        }
    } else {
        toggle.classList.remove("mobile-mode");
        document.body.classList.remove("mobile-mode");
        name.textContent = "DESKTOP";

        canvas.width  = 400;
        canvas.height = 600;
        ctx.imageSmoothingEnabled = false;

        mobileControls.classList.add("hidden");
    }

    scaleGame(); // recalculate for new base resolution
}

// =====================
// DIFFICULTY
// =====================
let currentDifficulty = "easy";

const DIFFICULTIES = {
    easy: {
        gravity:      0.22,
        jump:        -7.0,
        pipeSpeed:    1.8,
        pipeGap:      220,
        pipeSpacing:  340,
        label: "😊 EASY"
    },
    medium: {
        gravity:      0.32,
        jump:        -7.8,
        pipeSpeed:    2.2,
        pipeGap:      185,
        pipeSpacing:  300,
        label: "😤 MEDIUM"
    },
    filipino: {
        gravity:      0.46,
        jump:        -8.8,
        pipeSpeed:    3.2,
        pipeGap:      145,
        pipeSpacing:  250,
        label: "🇵🇭 FILIPINO"
    }
};

function setDifficulty(mode) {
    currentDifficulty = mode;
    ["easy", "medium", "filipino"].forEach(d => {
        document.getElementById("diff-" + d).classList.toggle("active", d === mode);
    });
}

function applyDifficulty() {
    const d      = DIFFICULTIES[currentDifficulty];
    gravity      = d.gravity;
    jump         = d.jump;
    PIPE_SPEED   = d.pipeSpeed;
    PIPE_GAP     = d.pipeGap;
    PIPE_SPACING = d.pipeSpacing;
}

function mobileTap() {
    if (gameState === "playing") {
        velocity = jump;
        playJump();
    }
}

// =====================
// SCREEN HELPERS
// =====================
function showScreen(id) {
    document.querySelectorAll(".screen, #gameScreen").forEach(el => {
        el.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

// =====================
// COUNTDOWN
// =====================
let countdownValue  = 0;
let countdownActive = false;
let showingGo       = false;
let _cdTimers       = [];

function clearCountdownTimers() {
    _cdTimers.forEach(t => clearTimeout(t));
    _cdTimers = [];
    countdownActive = false;
}

function startCountdown(callback) {
    clearCountdownTimers();

    countdownValue  = 3;
    countdownActive = true;
    showingGo       = false;
    gameState       = "countdown";

    document.getElementById("pauseBtn").classList.add("hidden");

    _cdTimers.push(setTimeout(() => { if (gameState === "countdown") countdownValue = 2; }, 1000));
    _cdTimers.push(setTimeout(() => { if (gameState === "countdown") countdownValue = 1; }, 2000));
    _cdTimers.push(setTimeout(() => { if (gameState === "countdown") { countdownValue = 0; showingGo = true; } }, 3000));
    _cdTimers.push(setTimeout(() => {
        _cdTimers = [];
        if (gameState !== "countdown") return; // died during countdown — abort
        showingGo       = false;
        countdownActive = false;
        document.getElementById("pauseBtn").classList.remove("hidden");
        if (callback) callback();
    }, 4000));
}

function tickCountdown() {} // no longer used

// =====================
// PAUSE
// =====================
function togglePause() {
    if (gameState === "playing") {
        gameState = "paused";
        pauseBgMusic();
        document.getElementById("pauseBtn").textContent = "▶ RESUME";
        document.getElementById("pauseOverlay").classList.remove("hidden");
    } else if (gameState === "paused") {
        resumeGame();
    }
}

function resumeGame() {
    document.getElementById("pauseOverlay").classList.add("hidden");
    document.getElementById("pauseBtn").textContent = "⏸ PAUSE";

    startCountdown(() => {
        gameState = "playing";
        resumeBgMusic();
    });
}

// =====================
// GAME FUNCTIONS
// =====================
function startGame() {
    playerName = document.getElementById("playerName").value.trim() || "Player";

    applyDifficulty();

    birdY    = 150;
    velocity = 0;
    score    = 0;
    pipes    = [];
    gameTimer   = 0;
    timerFrames = 0;

    document.getElementById("gameOverOverlay").classList.add("hidden");
    document.getElementById("pauseOverlay").classList.add("hidden");
    document.getElementById("pauseBtn").textContent = "⏸ PAUSE";

    if (isMobile) {
        { const mc = document.getElementById("mobileControls"); if (mc) mc.classList.remove("hidden"); };
    }

    showScreen("gameScreen");
    startBgMusic();
    startCountdown(() => {
        gameState = "playing";
    });
}

function restartGame() {
    applyDifficulty();

    birdY    = 150;
    velocity = 0;
    score    = 0;
    pipes    = [];
    gameTimer   = 0;
    timerFrames = 0;

    document.getElementById("gameOverOverlay").classList.add("hidden");
    document.getElementById("pauseOverlay").classList.add("hidden");
    document.getElementById("pauseBtn").textContent = "⏸ PAUSE";

    // Make sure the game screen is visible (it may have been hidden)
    showScreen("gameScreen");

    if (isMobile) {
        { const mc = document.getElementById("mobileControls"); if (mc) mc.classList.remove("hidden"); };
    }

    startBgMusic();
    startCountdown(() => {
        gameState = "playing";
    });
}

function gameOver() {
    if (gameState === "gameover") return;
    clearCountdownTimers();
    gameState = "gameover";
    playHit();
    stopBgMusic();
    saveScoreToDB();

    { const mc = document.getElementById("mobileControls"); if (mc) mc.classList.add("hidden"); };
    document.getElementById("pauseBtn").classList.add("hidden");
    document.getElementById("pauseOverlay").classList.add("hidden");
    document.getElementById("gameOverScore").textContent = "SCORE: " + score;
    const mins = String(Math.floor(gameTimer / 60)).padStart(2, "0");
    const secs = String(gameTimer % 60).padStart(2, "0");
    document.getElementById("gameOverTime").textContent  = "TIME: " + mins + ":" + secs;
    document.getElementById("gameOverOverlay").classList.remove("hidden");
}

function goToMenu() {
    clearCountdownTimers();
    gameState = "menu";
    stopBgMusic();
    document.getElementById("gameOverOverlay").classList.add("hidden");
    document.getElementById("pauseOverlay").classList.add("hidden");
    { const mc = document.getElementById("mobileControls"); if (mc) mc.classList.add("hidden"); };
    document.getElementById("pauseBtn").classList.add("hidden");
    showScreen("menu");
}

function backToMenu() {
    clearCountdownTimers();
    gameState = "menu";
    stopBgMusic();
    document.getElementById("pauseBtn").classList.add("hidden");
    document.getElementById("pauseOverlay").classList.add("hidden");
    showScreen("menu");
}

// =====================
// GAME LOOP
// =====================
function game() {
    update();
    draw();
    requestAnimationFrame(game);
}

// =====================
// INPUT — keyboard & canvas
// =====================
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (gameState === "playing") {
            velocity = jump;
            playJump();
        }
    }
    if (e.code === "KeyP") {
        if (gameState === "playing" || gameState === "paused") {
            togglePause();
        }
    }
});

canvas.addEventListener("click", () => {
    if (gameState === "playing") {
        velocity = jump;
        playJump();
    }
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (gameState === "playing") {
        velocity = jump;
        playJump();
    }
}, { passive: false });

// =====================
// ASSET PRELOADER
// =====================
birdImg.onerror = () => console.warn("bird.png not found, using fallback.");
pipeImg.onerror = () => console.warn("pipe.png not found, using fallback.");
logoImg.onerror = () => console.warn("logo.png not found, using fallback.");

birdImg.src = "assets/images/bird.png";
pipeImg.src = "assets/images/pipe.png";
logoImg.src = "assets/images/logo.png";

// Start loop immediately — canvas drawing has pixel-art fallbacks
requestAnimationFrame(game);