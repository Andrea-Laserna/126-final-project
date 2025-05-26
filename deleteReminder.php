<?php
include 'DBConnector.php';         

$id = $_POST["id"];

$sql = "DELETE FROM calendar WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    header("Location: calendar.php");
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

?>
    