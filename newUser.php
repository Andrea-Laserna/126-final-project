<?php
include 'DBConnector.php';  

$name = trim($_POST["name"] ?? '');
$email = trim($_POST["email"] ?? '');
$pwd = trim($_POST["pwd"] ?? '');

if (empty($name) || empty($email) || empty($pwd)) {
    echo "Error: All fields are required.";
    exit; 
}

//$hashed_pwd = password_hash($pwd, PASSWORD_DEFAULT);
$hashed_pwd = $pwd;

$sql = "INSERT INTO `user` (`name`, `email`, `pwd`) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if(!$stmt){
    echo "Prepare failed: (" . $conn->errno .") ". $conn->error;
    exit;
}

$stmt->bind_param("sss", $name, $email, $hashed_pwd);

if ($stmt->execute()) {
    header("Location: homepage.html");
    exit; 
} else {
    echo "Error: " . $stmt->error; 
}

$stmt->close();
$conn->close();

?>