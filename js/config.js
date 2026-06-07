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

// =====================
// PIPES
// =====================
let pipes = [];

const PIPE_SPEED = 2.2;
const PIPE_SPACING = 300;
const PIPE_GAP = 200;