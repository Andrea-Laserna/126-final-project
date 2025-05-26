<?php
session_start(); 
include 'DBConnector.php';

if (isset($_POST['date'], $_POST['event'], $_POST['eventDescription'])) {
    $date = $_POST['date'];
    $title = $_POST['event'];
    $reminder = $_POST['eventDescription']; 

    if (isset($_SESSION['u_id'])){
        $u_id = $_SESSION['u_id'];

        $stmt = $conn->prepare("INSERT INTO `calendar` (`u_id`, `date`, `reminder_title`, `reminder`) VALUES (?,?, ?, ?)");
        $stmt -> bind_param("isss", $u_id,$date,$title,$reminder); 

        if($stmt->execute()){
            header("Location: calendar.php");
            exit(); 
        }else{
            echo "Error: " . $stmt->error;
        } 
    } else {
        echo "User not logged in.";
    }
}else{
    echo "Missing required fields."; 
}
?>