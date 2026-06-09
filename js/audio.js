// =====================
// AUDIO SYSTEM
// =====================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

// =====================
// BACKGROUND MUSIC
// =====================
const bgMusic = new Audio("assets/sounds/musicbg1.mp3");
bgMusic.loop   = true;
bgMusic.volume = 0.4;

let musicPlaying = false;

// Unlock WebAudio context (needed for SFX beeps)
function unlockAudioCtx() {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

// startBgMusic is called from startGame() / restartGame() which are
// triggered directly by a button click — that click IS a user gesture,
// so the browser allows audio to play immediately.
function startBgMusic() {
    if (musicPlaying) return;
    unlockAudioCtx();
    bgMusic.currentTime = 0;
    bgMusic.play().then(() => {
        musicPlaying = true;
    }).catch((e) => {
        console.warn("Music play blocked:", e);
    });
}

function stopBgMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    musicPlaying = false;
}

function pauseBgMusic() {
    bgMusic.pause();
}

function resumeBgMusic() {
    unlockAudioCtx();
    bgMusic.play().then(() => {
        musicPlaying = true;
    }).catch(() => {});
}

// Also unlock on any interaction as a fallback
document.addEventListener("keydown",    unlockAudioCtx);
document.addEventListener("mousedown",  unlockAudioCtx);
document.addEventListener("touchstart", unlockAudioCtx);

// =====================
// SOUND EFFECTS
// =====================
function playJump() {
    if (audioCtx.state === "suspended") return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "square";
    o.frequency.value = 600;
    g.gain.value = 0.1;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.08);
}

function playHit() {
    if (audioCtx.state === "suspended") return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sawtooth";
    o.frequency.value = 150;
    g.gain.value = 0.15;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.2);
}

function playScore() {
    if (audioCtx.state === "suspended") return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "triangle";
    o.frequency.value = 900;
    g.gain.value = 0.12;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.1);
}