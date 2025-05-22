<?php
session_start();
include 'DBConnector.php'; 

$email = trim($_POST["email"] ?? '');
$pwd   = trim($_POST["pwd"] ?? '');

if(empty($email) || empty($pwd)) {
    echo "Please enter both email and password";
    exit;
}

$stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute(); 

$result = $stmt->get_result(); 

if($result->num_rows === 0){
    echo "invalid credentials";
    exit; 
}

$user = $result->fetch_assoc(); 

if ($pwd !== $user['pwd']) {
    echo "Invalid email or password.";
    exit;
}

// store user id in the session
$_SESSION['u_id'] = $user['u_id'];
$_SESSION['name'] = $user['name'];

// redirect to homepage
// echo "<script>
//     localStorage.setItem('reg_name', " . json_encode($user['name']) . ");
//     window.location.href = 'homepage.html';
// </script>";
header("Location: homepage.php");

$stmt->close();
$conn->close();
?>




