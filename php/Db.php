<?php
$host   = "localhost";
$user   = "root";       // change if needed
$pass   = "";           // change if needed
$dbname = "flappybird"; // change if needed

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>