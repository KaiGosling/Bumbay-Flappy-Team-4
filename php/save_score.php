<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "Db.php";

$name       = trim($_POST["name"]       ?? "");
$score      = intval($_POST["score"]      ?? -1);
$time       = intval($_POST["time"]       ?? 0);
$difficulty = trim($_POST["difficulty"]   ?? "easy");

// Validate difficulty
$allowed = ["easy", "medium", "filipino"];
if (!in_array($difficulty, $allowed)) $difficulty = "easy";

if ($name === "" || strtolower($name) === "player" || $score <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$name = substr($name, 0, 50);
if ($time < 0) $time = 0;

// Only save if it's a new personal best FOR THIS DIFFICULTY
$checkStmt = $conn->prepare("SELECT MAX(score) AS best FROM scores WHERE name = ? AND difficulty = ?");
$checkStmt->bind_param("ss", $name, $difficulty);
$checkStmt->execute();
$checkResult = $checkStmt->get_result()->fetch_assoc();
$checkStmt->close();

$currentBest = (int)($checkResult["best"] ?? 0);

if ($score <= $currentBest) {
    echo json_encode(["success" => true, "saved" => false, "reason" => "Not a new personal best"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO scores (name, score, time, difficulty) VALUES (?, ?, ?, ?)");
$stmt->bind_param("siis", $name, $score, $time, $difficulty);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "saved" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save score"]);
}

$stmt->close();
$conn->close();
?>