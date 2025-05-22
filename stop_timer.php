<?php
session_start();
require_once "DBConnector.php";
header('Content-Type: application/json');

if (!isset($_SESSION['u_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$u_id = $_SESSION['u_id'];
$input = json_decode(file_get_contents("php://input"), true);
$time_id = $input['time_id'] ?? null;

if (!$time_id) {
    echo json_encode(["error" => "Missing timer ID"]);
    exit;
}

$sql = "UPDATE timer SET end_time = NOW() WHERE time_id = ? and u_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $time_id, $u_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to update end_time", "details" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>