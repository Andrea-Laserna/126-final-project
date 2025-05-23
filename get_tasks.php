<?php
session_start();
include 'DBConnector.php';

if (!isset($_SESSION['u_id'])) {
  http_response_code(401);
  echo json_encode(["error" => "Unauthorized"]);
  exit;
}

$uid = $_SESSION['u_id'];

$stmt = $conn->prepare("SELECT t_id, title, deadline, status FROM task WHERE u_id = ?");
$stmt->bind_param("i", $uid);
$stmt->execute();

$result = $stmt->get_result();
$tasks = [];

while ($row = $result->fetch_assoc()) {
  $tasks[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($tasks);
?>
