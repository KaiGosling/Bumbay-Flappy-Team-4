<?php
// leaderboards.php — same as get_scores.php, kept for compatibility
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "Db.php";

$sql = "
    SELECT name, MAX(score) AS score
    FROM scores
    WHERE score > 0
    GROUP BY name
    ORDER BY score DESC
    LIMIT 10
";

$result = $conn->query($sql);

$data = [];
$rank = 1;
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "rank"  => $rank++,
        "name"  => $row["name"],
        "score" => (int) $row["score"]
    ];
}

echo json_encode($data);
$conn->close();
?>