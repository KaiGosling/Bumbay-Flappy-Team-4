<?php
header("Content-Type: application/json");

require_once "db.php";

// Same as get_scores but returns all entries for a full leaderboard page
$sql = "
    SELECT name, MAX(score) AS score
    FROM scores
    GROUP BY name
    ORDER BY score DESC
    LIMIT 10
";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "name"  => $row["name"],
        "score" => (int) $row["score"]
    ];
}

echo json_encode($data);
$conn->close();
?>