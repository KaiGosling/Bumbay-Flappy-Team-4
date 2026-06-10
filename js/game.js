// =====================
// BIRD DRAWING
// =====================
function drawBird(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    if (birdImg.complete && birdImg.naturalWidth !== 0) {
        ctx.drawImage(birdImg, x, y, 40, 40);
    } else {
        const px = 4;
        const map = [
            [0,0,2,2,2,2,0,0,0,0],
            [0,2,1,1,1,1,2,2,0,0],
            [2,1,1,1,1,1,1,1,2,0],
            [2,1,4,5,1,1,1,1,2,3],
            [2,1,4,1,1,1,1,1,2,3],
            [2,1,1,1,6,6,1,1,2,0],
            [2,1,1,6,6,1,1,1,2,0],
            [0,2,1,1,1,1,1,2,0,0],
            [0,0,2,1,1,1,2,0,0,0],
            [0,0,0,2,2,2,0,0,0,0],
        ];
        const colors = {
            1: "#FFD700", 2: "#2c1810", 3: "#FF6600",
            4: "#ffffff", 5: "#000000", 6: "#FFA500",
        };
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const val = map[row][col];
                if (val === 0) continue;
                ctx.fillStyle = colors[val];
                ctx.fillRect(x + col * px, y + row * px, px, px);
            }
        }
    }
}

function update() {
    if (gameState !== "playing") return;

    // =====================
    // TIMER
    // =====================
    timerFrames++;
    if (timerFrames >= 60) {
        timerFrames = 0;
        gameTimer++;
    }

    // =====================
    // PHYSICS
    // =====================
    velocity += gravity;
    if (velocity > 7.5) velocity = 7.5;
    birdY += velocity;

    const birdW = 40;
    const birdH = 40;
    const pipeW = 52;

    // =====================
    // PIPE UPDATE + COLLISION
    // =====================
    for (let pipe of pipes) {

        pipe.x -= PIPE_SPEED;

        const birdLeft   = birdX + 4;
        const birdRight  = birdX + birdW - 4;
        const birdTop    = birdY + 4;
        const birdBottom = birdY + birdH - 4;

        const pipeLeft  = pipe.x;
        const pipeRight = pipe.x + pipeW;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.top || birdBottom > pipe.bottom) {
                gameOver();
                return; // stop processing after game over
            }
        }

        if (!pipe.passed && pipe.x + pipeW < birdX) {
            pipe.passed = true;
            score++;
            playScore();
        }
    }

    pipes = pipes.filter(p => p.x > -80);

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - PIPE_SPACING) {
        createPipe();
    }

    if (birdY > canvas.height - 50 || birdY < 0) {
        gameOver();
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPixelBackground();
    drawGround();

    // =====================
    // BUILDINGS (obstacle pipes)
    // =====================
    if (gameState === "playing" || gameState === "gameover" || gameState === "paused" || gameState === "countdown") {
        for (let pipe of pipes) {
            const bw = 52;

            if (pipe.top > 0) {
                drawBuilding(pipe.x, 0, bw, pipe.top, true);
            }

            if (pipe.bottom < canvas.height - 50) {
                drawBuilding(pipe.x, pipe.bottom, bw, canvas.height - 50 - pipe.bottom, false);
            }
        }
    }

    // =====================
    // BIRD
    // =====================
    ctx.imageSmoothingEnabled = false;
    drawBird(birdX, birdY);

    // =====================
    // SCORE (shown during play, pause, countdown, and gameover)
    // =====================
    if (gameState === "playing" || gameState === "paused" || gameState === "countdown" || gameState === "gameover") {
        ctx.fillStyle = "#FFD700";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.font = "bold 16px monospace";
        ctx.strokeText("SCORE: " + score, 10, 25);
        ctx.fillText("SCORE: " + score, 10, 25);

        // Timer display — shown below score
        const mins = String(Math.floor(gameTimer / 60)).padStart(2, "0");
        const secs = String(gameTimer % 60).padStart(2, "0");
        const timeStr = "TIME: " + mins + ":" + secs;
        ctx.font = "bold 13px monospace";
        ctx.strokeText(timeStr, 10, 44);
        ctx.fillText(timeStr, 10, 44);
    }

    // =====================
    // COUNTDOWN OVERLAY
    // =====================
    if (gameState === "countdown") {
        drawCountdown();
    }

    // =====================
    // GAME OVER — draw dark overlay on canvas too so the screen
    // doesn't look "frozen/alive" while the HTML overlay loads
    // =====================
    if (gameState === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}