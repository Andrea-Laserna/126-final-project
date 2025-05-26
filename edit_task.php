<?php
session_start();
include 'DBConnector.php';

header("Content-Type: application/json");

if (!isset($_SESSION['u_id'])) {
  echo json_encode(["success" => false, "message" => "Unauthorized"]);
  exit;
}

$uid = $_SESSION['u_id'];

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data || !isset($data['t_id']) || !isset($data['title'])) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Invalid input"]);
  exit;
}

$t_id = intval($data['t_id']);
$title = $data['title'];
$deadline = isset($data['deadline']) ? $data['deadline'] : null;

if ($deadline === "") $deadline = null;

$stmt = $conn->prepare("UPDATE task SET title = ?, deadline = ? WHERE t_id = ? AND u_id = ?");
$stmt->bind_param("ssii", $title, $deadline, $t_id, $uid);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Task updated!"]);
} else {
  echo json_encode(["success" => false, "message" => "Error updating task: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
