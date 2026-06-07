function drawPixelBackground() {

    // SKY BASE
    ctx.fillStyle = "#6ec6ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // SKY STRIP PIXEL DEPTH
    ctx.fillStyle = "#8fd8ff";
    for (let y = 0; y < canvas.height; y += 16) {
        ctx.fillRect(0, y, canvas.width, 8);
    }

    // CLOUDS (pixel style)
    ctx.fillStyle = "#ffffff";
    const clouds = [
        { x: 30, y: 60 },
        { x: 160, y: 90 },
        { x: 280, y: 50 }
    ];
    for (let c of clouds) {
        ctx.fillRect(c.x, c.y, 40, 10);
        ctx.fillRect(c.x + 10, c.y - 10, 25, 10);
        ctx.fillRect(c.x + 20, c.y + 10, 20, 10);
    }

    // PIXEL SUN
    ctx.fillStyle = "#ffd84d";
    ctx.fillRect(300, 40, 20, 20);
    ctx.fillRect(320, 60, 10, 10);
}

function drawGround() {

    ctx.fillStyle = "#c2a26b";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    for (let x = 0; x < canvas.width; x += 10) {
        ctx.fillStyle = (x % 20 === 0) ? "#3fa34d" : "#2f7d32";
        ctx.fillRect(x, canvas.height - 50, 6, 10);
    }

    ctx.fillStyle = "#1f5f23";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 4);
}

function drawMenu() {

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText("FLAPPY BIRD", 120, 250);

    ctx.font = "14px monospace";
    ctx.fillText("PRESS SPACE TO START", 95, 290);
}

function drawGameOver() {

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "22px monospace";
    ctx.fillText("GAME OVER", 120, 250);

    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.fillText("PRESS SPACE TO RESTART", 85, 290);

    ctx.fillText("SCORE: " + score, 150, 310);
}