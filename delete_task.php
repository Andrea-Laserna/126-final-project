<?php
session_start();
include 'DBConnector.php';

header("Content-Type: application/json");

if (!isset($_SESSION['u_id'])) {
  echo json_encode(["success" => false, "message" => "Unauthorized"]);
  exit;
}

$uid = $_SESSION['u_id'];

// Read and decode JSON input
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data || !isset($data['t_id'])) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Invalid input"]);
  exit;
}

$t_id = intval($data['t_id']);

// Prepare and execute the delete statement
$stmt = $conn->prepare("DELETE FROM task WHERE t_id = ? AND u_id = ?");
$stmt->bind_param("ii", $t_id, $uid);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Task deleted"]);
  } else {
    echo json_encode(["success" => false, "message" => "Task not found or not yours"]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Error deleting task: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
