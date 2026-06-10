// =====================
// DAY / NIGHT CYCLE
// =====================
// 0=day, 1000=night, 5000=day, 10000=night, 15000=day ... (repeats every 5000 after first)

function getDayNightFactor() {
    // Returns 0.0 = full day, 1.0 = full night
    // Smooth transition over 200pt range

    const TRANSITION = 200;

    // Build milestone list dynamically
    const milestones = [[0, 0], [1000, 1]];
    let s = 5000;
    let isDay = true;
    while (s <= score + 20000) {
        milestones.push([s, isDay ? 0 : 1]);
        s += 5000;
        isDay = !isDay;
    }

    for (let i = milestones.length - 1; i >= 0; i--) {
        if (score >= milestones[i][0]) {
            const fromScore  = milestones[i][0];
            const fromFactor = milestones[i][1];
            const nextMile   = milestones[i + 1];
            if (!nextMile) return fromFactor;
            const toFactor = nextMile[1];
            const progress = Math.min((score - fromScore) / TRANSITION, 1.0);
            return fromFactor + (toFactor - fromFactor) * progress;
        }
    }
    return 0;
}

function lerpColor(c1, c2, t) {
    return [
        Math.round(c1[0] + (c2[0] - c1[0]) * t),
        Math.round(c1[1] + (c2[1] - c1[1]) * t),
        Math.round(c1[2] + (c2[2] - c1[2]) * t),
    ];
}

function rgb(c) {
    return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// =====================
// BACKGROUND BUILDINGS
// =====================
const bgBuildings = [
    { x: 0,   w: 28, h: 110 },
    { x: 22,  w: 20, h: 80  },
    { x: 38,  w: 35, h: 140 },
    { x: 68,  w: 18, h: 90  },
    { x: 82,  w: 30, h: 160 },
    { x: 108, w: 22, h: 100 },
    { x: 126, w: 40, h: 130 },
    { x: 162, w: 16, h: 75  },
    { x: 174, w: 32, h: 150 },
    { x: 202, w: 24, h: 95  },
    { x: 222, w: 38, h: 170 },
    { x: 256, w: 20, h: 85  },
    { x: 272, w: 28, h: 120 },
    { x: 296, w: 36, h: 145 },
    { x: 328, w: 18, h: 80  },
    { x: 342, w: 30, h: 135 },
    { x: 368, w: 22, h: 95  },
    { x: 386, w: 40, h: 160 },
    { x: 420, w: 24, h: 110 },
];

const bgWindows = [];
function initBgWindows() {
    if (bgWindows.length > 0) return;
    for (let b of bgBuildings) {
        const groundY = 550;
        const bTop = groundY - b.h;
        for (let wy = bTop + 6; wy < groundY - 6; wy += 12) {
            for (let wx = b.x + 4; wx < b.x + b.w - 6; wx += 10) {
                bgWindows.push({
                    x: wx, y: wy,
                    lit: Math.random() < 0.55,
                    color: Math.random() < 0.4 ? "#FFD700" : "#87CEEB"
                });
            }
        }
    }
}

// =====================
// MAIN BACKGROUND DRAW
// =====================
function drawPixelBackground() {
    initBgWindows();

    const groundY = canvas.height - 50;
    const night = getDayNightFactor();
    const day   = 1 - night;

    // Sky color bands
    const skyTopDay   = [135, 206, 250];
    const skyTopNight = [10,  10,  26 ];
    const skyMidDay   = [180, 230, 255];
    const skyMidNight = [13,  18,  48 ];
    const skyBotDay   = [255, 220, 160];
    const skyBotNight = [21,  24,  56 ];

    const bandH = Math.floor(canvas.height / 3);
    ctx.fillStyle = rgb(lerpColor(skyTopDay, skyTopNight, night));
    ctx.fillRect(0, 0, canvas.width, bandH);
    ctx.fillStyle = rgb(lerpColor(skyMidDay, skyMidNight, night));
    ctx.fillRect(0, bandH, canvas.width, bandH);
    ctx.fillStyle = rgb(lerpColor(skyBotDay, skyBotNight, night));
    ctx.fillRect(0, bandH * 2, canvas.width, canvas.height - bandH * 2);

    // Pixel stripe depth
    ctx.fillStyle = `rgba(143,216,255,${(0.08 + day * 0.08).toFixed(2)})`;
    for (let y = 0; y < canvas.height; y += 16) {
        ctx.fillRect(0, y, canvas.width, 8);
    }

    // Stars (night only)
    if (night > 0.1) {
        ctx.fillStyle = `rgba(255,255,255,${night.toFixed(2)})`;
        const stars = [
            {x:15,y:18},{x:45,y:8},{x:80,y:22},{x:120,y:10},{x:155,y:30},
            {x:190,y:12},{x:230,y:25},{x:265,y:8},{x:310,y:20},{x:350,y:14},
            {x:385,y:28},{x:25,y:45},{x:70,y:38},{x:110,y:50},{x:180,y:42},
            {x:250,y:55},{x:320,y:40},{x:390,y:52},{x:55,y:60},{x:160,y:65},
            {x:290,y:70},{x:370,y:62},{x:100,y:75},{x:210,y:68},
        ];
        for (let s of stars) ctx.fillRect(s.x, s.y, 2, 2);
    }

    // Moon (night)
    if (night > 0.1) {
        ctx.fillStyle = `rgba(255,253,224,${night.toFixed(2)})`;
        ctx.fillRect(340, 18, 20, 20);
        ctx.fillStyle = `rgba(10,10,26,${night.toFixed(2)})`;
        ctx.fillRect(348, 18, 14, 14);
    }

    // Sun (day)
    if (day > 0.1) {
        ctx.fillStyle = `rgba(255,216,77,${day.toFixed(2)})`;
        ctx.fillRect(300, 40, 20, 20);
        ctx.fillRect(320, 60, 10, 10);
    }

    // Day clouds
    if (day > 0.1) {
        ctx.fillStyle = `rgba(255,255,255,${day.toFixed(2)})`;
        const clouds = [{x:30,y:60},{x:160,y:90},{x:280,y:50}];
        for (let c of clouds) {
            ctx.fillRect(c.x, c.y, 40, 10);
            ctx.fillRect(c.x + 10, c.y - 10, 25, 10);
            ctx.fillRect(c.x + 20, c.y + 10, 20, 10);
        }
    }

    // Background city silhouette
    const bldDay   = [160, 150, 140];
    const bldNight = [55,  55,  80 ];
    const roofDay  = [120, 110, 100];
    const roofNight= [30,  30,  45 ];

    for (let b of bgBuildings) {
        const bTop = groundY - b.h;
        ctx.fillStyle = rgb(lerpColor(bldDay, bldNight, night));
        ctx.fillRect(b.x, bTop, b.w, b.h);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(b.x + b.w - 4, bTop, 4, b.h);
        ctx.fillStyle = rgb(lerpColor(roofDay, roofNight, night));
        ctx.fillRect(b.x - 2, bTop, b.w + 4, 4);
    }

    // Windows on bg buildings
    for (let w of bgWindows) {
        if (w.y > groundY - 6) continue;
        if (night > 0.1 && w.lit) {
            ctx.fillStyle = w.color;
            ctx.globalAlpha = night;
            ctx.fillRect(w.x, w.y, 6, 8);
            ctx.globalAlpha = 1;
        } else if (day > 0.3) {
            ctx.fillStyle = `rgba(0,0,0,${(day * 0.2).toFixed(2)})`;
            ctx.fillRect(w.x, w.y, 6, 8);
        }
    }

    // Horizon glow
    if (night > 0.1) {
        ctx.fillStyle = `rgba(255,140,60,${(night * 0.08).toFixed(2)})`;
        ctx.fillRect(0, groundY - 80, canvas.width, 80);
    }
    if (day > 0.1) {
        ctx.fillStyle = `rgba(255,200,100,${(day * 0.1).toFixed(2)})`;
        ctx.fillRect(0, groundY - 60, canvas.width, 60);
    }

    // HUD: cycle indicator
    drawCycleHUD(night);
}

// =====================
// CYCLE HUD (small tag top-right)
// =====================
function drawCycleHUD(night) {
    const isNight = night > 0.5;
    const label   = isNight ? "🌙 NIGHT" : "☀️ DAY";

    // Next milestone
    const milestones = [1000, 5000, 10000, 15000, 20000, 25000, 30000];
    let nextAt = null;
    for (let m of milestones) {
        if (score < m) { nextAt = m; break; }
    }
    if (!nextAt) {
        // Generate next milestone dynamically
        let base = 5000;
        while (base <= score) base += 5000;
        nextAt = 1000 + Math.ceil((score - 1000) / 5000) * 5000;
        while (nextAt <= score) nextAt += 5000;
    }

    // Positioned bottom-right so it never overlaps the pause button (top-right)
    const x = canvas.width - 4;
    const y = canvas.height - 90;   // sits just above the ground strip

    ctx.fillStyle = isNight ? "rgba(20,20,50,0.75)" : "rgba(255,240,180,0.75)";
    ctx.fillRect(x - 90, y, 90, 32);
    ctx.fillStyle = isNight ? "#aaccff" : "#8B6914";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "right";
    ctx.fillText(label, x - 4, y + 12);
    ctx.font = "7px monospace";
    ctx.fillText("next: " + nextAt + " pts", x - 4, y + 26);
    ctx.textAlign = "left";
}

function drawGround() {
    const night = getDayNightFactor();
    const day   = 1 - night;

    if (night > 0.5) {
        // Night road
        ctx.fillStyle = "#1a1a2a";
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        // Sidewalk
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.fillStyle = (Math.floor(x / 20) % 2 === 0) ? "#323245" : "#2a2a3a";
            ctx.fillRect(x, canvas.height - 50, 20, 12);
        }
        ctx.fillStyle = "#2a2a3a";
        ctx.fillRect(0, canvas.height - 50, canvas.width, 4);

        // Lane dashes
        ctx.fillStyle = `rgba(255,215,0,${night.toFixed(2)})`;
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.fillRect(x, canvas.height - 28, 18, 4);
        }
    } else {
        // Day ground
        ctx.fillStyle = "#c2a26b";
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        for (let x = 0; x < canvas.width; x += 10) {
            ctx.fillStyle = (x % 20 === 0) ? "#3fa34d" : "#2f7d32";
            ctx.fillRect(x, canvas.height - 50, 6, 10);
        }
        ctx.fillStyle = "#1f5f23";
        ctx.fillRect(0, canvas.height - 50, canvas.width, 4);
    }
}

// =====================
// TWIN TOWER STYLE BUILDING
// =====================
function drawBuilding(x, y, width, height, isTop) {
    const night = getDayNightFactor();
    const day   = 1 - night;

    const facadeDay   = [200, 184, 154];
    const facadeNight = [140, 130, 110];
    const facade = lerpColor(facadeDay, facadeNight, night);
    ctx.fillStyle = rgb(facade);
    ctx.fillRect(x, y, width, height);

    // Right shadow
    ctx.fillStyle = rgb(lerpColor([180,164,134],[110,102,88], night));
    ctx.fillRect(x + width - 8, y, 8, height);

    // Vertical structural strips
    ctx.fillStyle = rgb(lerpColor([232,221,208],[200,190,175], night));
    ctx.fillRect(x + 6, y, 4, height);
    ctx.fillRect(x + Math.floor(width / 2) - 2, y, 4, height);
    ctx.fillRect(x + width - 14, y, 4, height);

    // Horizontal band
    const bandY = isTop
        ? y + Math.floor(height * 0.55)
        : y + Math.floor(height * 0.35);
    ctx.fillStyle = rgb(lerpColor([168,152,120],[120,110,90], night));
    ctx.fillRect(x, bandY, width, 8);
    ctx.fillStyle = rgb(lerpColor([232,221,208],[200,190,175], night));
    ctx.fillRect(x, bandY + 2, width, 3);

    // Windows
    const colPositions = [
        x + 2,
        x + 10,
        x + Math.floor(width / 2) + 2,
        x + width - 12,
    ];
    for (let col of colPositions) {
        for (let wy = y + 4; wy + 7 < y + height - 4; wy += 11) {
            if (wy + 7 > bandY - 2 && wy < bandY + 10) continue;
            const lit = Math.random() < 0.6;
            if (night > 0.3 && lit) {
                ctx.fillStyle = Math.random() < 0.5 ? "#87CEEB" : "#FFD700";
                ctx.globalAlpha = night * 0.9 + 0.1;
            } else {
                ctx.fillStyle = `rgba(80,120,160,${(day * 0.7 + 0.1).toFixed(2)})`;
                ctx.globalAlpha = 1;
            }
            ctx.fillRect(col, wy, 5, 7);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = rgb(lerpColor([160,148,130],[100,94,80], night));
            ctx.lineWidth = 0.5;
            ctx.strokeRect(col, wy, 5, 7);
        }
    }

    // Rooftop cap
    ctx.fillStyle = rgb(lerpColor([160,144,112],[100,92,76], night));
    if (isTop) {
        ctx.fillRect(x - 4, y + height - 10, width + 8, 10);
        ctx.fillStyle = rgb(facade);
        ctx.fillRect(x - 2, y + height - 14, width + 4, 6);
        ctx.fillStyle = "#888888";
        ctx.fillRect(x + Math.floor(width / 2) - 1, y - 20, 2, 20);
        ctx.fillStyle = night > 0.4 ? "#ff4444" : "#cc3333";
        ctx.fillRect(x + Math.floor(width / 2) - 2, y - 22, 4, 4);
    } else {
        ctx.fillRect(x - 4, y, width + 8, 10);
        ctx.fillStyle = rgb(facade);
        ctx.fillRect(x - 2, y + 8, width + 4, 6);
    }
}

// =====================
// MENU / GAMEOVER / COUNTDOWN
// =====================
function drawMenu() {
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (logoImg.complete && logoImg.naturalWidth !== 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(logoImg, canvas.width / 2 - 100, 200, 200, 80);
    } else {
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY BIRD", canvas.width / 2, 250);
        ctx.textAlign = "left";
    }
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.fillText("PRESS SPACE TO START", 95, 310);
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (logoImg.complete && logoImg.naturalWidth !== 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(logoImg, canvas.width / 2 - 80, 180, 160, 64);
    }
    ctx.fillStyle = "red";
    ctx.font = "22px monospace";
    ctx.fillText("GAME OVER", 120, 260);
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.fillText("PRESS SPACE TO RESTART", 85, 295);
    ctx.fillText("SCORE: " + score, 150, 315);
}

function drawCountdown() {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 52px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(showingGo ? "GO!" : countdownValue, cx, cy);
    ctx.fillStyle = "white";
    ctx.font = "bold 13px monospace";
    ctx.fillText("GET READY", cx, cy - 80);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
}