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

if (!$data || !isset($data['title']) || !isset($data['deadline']) || !isset($data['status'])) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Invalid input"]);
  exit;
}

$title = $data['title'];
$deadline = $data['deadline'];
$status = $data['status'];

$stmt = $conn->prepare("INSERT INTO task (title, status, deadline, u_id) VALUES (?, ?, ?, ?)");

if (empty($deadline)) {
    $null = null;
    $stmt->bind_param("sssi", $title, $status, $null, $uid);
} else {
    $stmt->bind_param("sssi", $title, $status, $deadline, $uid);
}

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Task added!", "t_id" => $stmt->insert_id]);
} else {

  echo json_encode(["success" => false, "message" => "Error adding task." . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
