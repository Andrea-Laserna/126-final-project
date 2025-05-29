<?php
session_start();
if (!isset($_SESSION['u_id'])) {
    header("Location: account.html"); 
    exit;
}

session_unset(); 
session_destroy(); 

header("Location: account.html"); 
exit;
?>
