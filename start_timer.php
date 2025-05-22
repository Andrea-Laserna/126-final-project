<?php
session_start();
require_once "DBConnector.php";
// send json response
header('Content-Type: application/json');

// make sure user is logged in
if (!isset($_SESSION['u_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$u_id = $_SESSION['u_id'];

// get json data sent from js
$input = json_decode(file_get_contents("php://input"), true); // read raw post data, true to return assoc
$session_type = $input['session_type'] ?? "unknown"; // ?? to check if session type is set, by default unknown

// sql to insert a new timer record
$sql = "INSERT INTO timer (start_time, session_type, u_id)
        VALUES (NOW(), ?, ?)"; // ? as placeholders for session_type and u_id

$stmt = $conn->prepare($sql); // passing sql template
$stmt->bind_param("si", $session_type, $u_id); // first and second placeholders are string and int

if ($stmt->execute()) {
    // get id of newly inserted row
    echo json_encode(["time_id" => $stmt->insert_id]); // send back to js
} else {
    echo json_encode(["error" => "Failed to insert timer", "details" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

