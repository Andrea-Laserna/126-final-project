<?php
session_start();
include 'DBConnector.php'; 
header("Content-Type: application/json");

// Check session
if (!isset($_SESSION['u_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$uid = $_SESSION['u_id'];

// Read raw input
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Validate input and catch JSON errors
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit;
}

if (!$data || !isset($data['t_id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing parameters: t_id and status are required"]);
    exit;
}

$t_id = intval($data['t_id']);
$status = $data['status'];

$validStatuses = ['todo', 'in-progress', 'done']; // example statuses
if (!in_array($status, $validStatuses)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid status value"]);
    exit;
}

if (!isset($conn)) {
    echo json_encode(["success" => false, "message" => "Database connection not found"]);
    exit;
}

// Prepare statement
$stmt = $conn->prepare("UPDATE task SET status = ? WHERE t_id = ? AND u_id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

// Bind parameters: "sii" means string, int, int
if (!$stmt->bind_param("sii", $status, $t_id, $uid)) {
    echo json_encode(["success" => false, "message" => "Binding parameters failed: " . $stmt->error]);
    exit;
}

// Execute query
if ($stmt->execute()) {
    // Check affected rows to confirm update happened
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Task status updated!"]);
    } else {
        echo json_encode(["success" => false, "message" => "No task updated (check task ID and user ownership)"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Execution failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
