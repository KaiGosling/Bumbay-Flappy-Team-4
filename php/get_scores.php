<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "Db.php";

$difficulty = trim($_GET["difficulty"] ?? "easy");
$allowed    = ["easy", "medium", "filipino"];
if (!in_array($difficulty, $allowed)) $difficulty = "easy";

$sql = "
    SELECT s.name, s.score, s.time, s.difficulty
    FROM scores s
    INNER JOIN (
        SELECT name, MAX(score) AS best
        FROM scores
        WHERE score > 0 AND difficulty = ?
        GROUP BY name
    ) best ON s.name = best.name AND s.score = best.best AND s.difficulty = ?
    GROUP BY s.name
    ORDER BY s.score DESC
    LIMIT 10
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $difficulty, $difficulty);
$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed"]);
    exit;
}

$data = [];
$rank = 1;
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "rank"       => $rank++,
        "name"       => $row["name"],
        "score"      => (int) $row["score"],
        "time"       => isset($row["time"]) ? (int) $row["time"] : null,
        "difficulty" => $row["difficulty"]
    ];
}

echo json_encode($data);
$stmt->close();
$conn->close();
?>