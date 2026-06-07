// =====================
// AUDIO SYSTEM
// =====================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

// unlock audio (mobile fix)
document.addEventListener("keydown", () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
});

document.addEventListener("touchstart", () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
});

// =====================
// SOUND EFFECTS
// =====================

function playJump() {
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