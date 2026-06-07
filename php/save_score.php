<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

$name  = trim($_POST["name"]  ?? "");
$score = intval($_POST["score"] ?? 0);

// Basic validation
if ($name === "" || $score < 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

// Limit name length
$name = substr($name, 0, 50);

$stmt = $conn->prepare("INSERT INTO scores (name, score) VALUES (?, ?)");
$stmt->bind_param("si", $name, $score);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save score"]);
}

$stmt->close();
$conn->close();
?>