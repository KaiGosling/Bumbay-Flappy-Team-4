// =====================
// MODE (desktop / mobile)
// =====================
let isMobile = false;

function toggleMode() {
    isMobile = !isMobile;

    const toggle  = document.getElementById("modeToggle");
    const name    = document.getElementById("modeName");
    const mobileControls = document.getElementById("mobileControls");

    if (isMobile) {
        toggle.classList.add("mobile-mode");
        document.body.classList.add("mobile-mode");
        name.textContent = "MOBILE";

        // Resize canvas to mobile dimensions
        canvas.width  = 360;
        canvas.height = 640;
        ctx.imageSmoothingEnabled = false;

        // Show tap button during game
        if (gameState === "playing") {
            mobileControls.classList.remove("hidden");
        }
    } else {
        toggle.classList.remove("mobile-mode");
        document.body.classList.remove("mobile-mode");
        name.textContent = "DESKTOP";

        // Restore desktop canvas dimensions
        canvas.width  = 400;
        canvas.height = 600;
        ctx.imageSmoothingEnabled = false;

        mobileControls.classList.add("hidden");
    }
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
// GAME FUNCTIONS
// =====================
function startGame() {
    playerName = document.getElementById("playerName").value.trim() || "Player";

    birdY = 150;
    velocity = 0;
    score = 0;
    pipes = [];
    gameState = "playing";

    document.getElementById("gameOverOverlay").classList.add("hidden");

    // Show mobile tap button if in mobile mode
    if (isMobile) {
        document.getElementById("mobileControls").classList.remove("hidden");
    }

    showScreen("gameScreen");
}

function restartGame() {
    birdY = 150;
    velocity = 0;
    score = 0;
    pipes = [];
    gameState = "playing";

    document.getElementById("gameOverOverlay").classList.add("hidden");

    if (isMobile) {
        document.getElementById("mobileControls").classList.remove("hidden");
    }
}

function gameOver() {
    if (gameState === "gameover") return;
    gameState = "gameover";
    playHit();
    saveScoreToDB();

    document.getElementById("mobileControls").classList.add("hidden");
    document.getElementById("gameOverScore").textContent = "SCORE: " + score;
    document.getElementById("gameOverOverlay").classList.remove("hidden");
}

function goToMenu() {
    gameState = "menu";
    document.getElementById("gameOverOverlay").classList.add("hidden");
    document.getElementById("mobileControls").classList.add("hidden");
    showScreen("menu");
}

function backToMenu() {
    gameState = "menu";
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
// INPUT — keyboard (desktop) + canvas click (both modes)
// =====================
document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;
    if (gameState === "playing") {
        velocity = jump;
        playJump();
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
// START LOOP
// =====================
game();