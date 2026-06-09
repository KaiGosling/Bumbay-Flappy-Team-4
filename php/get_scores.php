<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

// Fetch top 10 highest scores, one entry per player (best score only)
$sql = "
    SELECT name, MAX(score) AS score
    FROM scores
    GROUP BY name
    ORDER BY score DESC
    LIMIT 10
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed"]);
    exit;
}

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