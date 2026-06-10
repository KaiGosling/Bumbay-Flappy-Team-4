// =====================
// CANVAS
// =====================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// =====================
// GAME STATE
// =====================
let gameState = "menu";

// =====================
// PLAYER
// =====================
let birdX = 50;
let birdY = 150;
let velocity = 0;

let gravity = 0.32;
let jump = -7.8;

// =====================
// GAME DATA
// =====================
let score = 0;
let playerName = "";

// Timer (in seconds, tracked via elapsed frames)
let gameTimer     = 0;   // total seconds survived
let timerFrames   = 0;   // frame counter (60 frames = 1 second)

// =====================
// PIPES
// =====================
let pipes = [];

let PIPE_SPEED   = 2.2;
let PIPE_SPACING = 300;
let PIPE_GAP     = 200;

// =====================
// ASSETS
// =====================
const birdImg = new Image();

const pipeImg = new Image();

const logoImg = new Image();