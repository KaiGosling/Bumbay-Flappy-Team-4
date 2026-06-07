// =====================
// PIXEL BIRD DRAWING
// =====================
function drawBird(x, y) {
    const px = 4;
    x = Math.floor(x);
    y = Math.floor(y);

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
        1: "#FFD700",
        2: "#2c1810",
        3: "#FF6600",
        4: "#ffffff",
        5: "#000000",
        6: "#FFA500",
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

function update() {

    if (gameState !== "playing") return;

    // =====================
    // PHYSICS
    // =====================
    velocity += gravity;
    if (velocity > 7.5) velocity = 7.5;
    birdY += velocity;

    const birdW = 40;
    const birdH = 40;
    const pipeW = 50;

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
            }
        }

        if (!pipe.passed && pipe.x + pipeW < birdX) {
            pipe.passed = true;
            score++;
            playScore();
        }
    }

    pipes = pipes.filter(p => p.x > -60);

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
    // PIPES
    // =====================
    if (gameState === "playing" || gameState === "gameover") {
        for (let pipe of pipes) {

            ctx.fillStyle = "#2ecc71";
            ctx.fillRect(pipe.x, 0, 50, pipe.top);
            ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height);

            ctx.fillStyle = "#27ae60";
            ctx.fillRect(pipe.x + 5, 0, 8, pipe.top);
            ctx.fillRect(pipe.x + 5, pipe.bottom, 8, canvas.height);

            ctx.fillStyle = "#145a32";
            ctx.fillRect(pipe.x, 0, 2, pipe.top);
            ctx.fillRect(pipe.x, pipe.bottom, 2, canvas.height);
        }
    }

    // =====================
    // BIRD
    // =====================
    ctx.imageSmoothingEnabled = false;
    drawBird(birdX, birdY);

    // =====================
    // SCORE
    // =====================
    if (gameState === "playing") {
        ctx.fillStyle = "black";
        ctx.font = "bold 16px monospace";
        ctx.fillText("SCORE: " + score, 10, 25);
    }
}