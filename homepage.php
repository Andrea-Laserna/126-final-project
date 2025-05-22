<?php
session_start();
if (!isset($_SESSION['u_id'])) {
  header("Location: login.html");
  exit;
}
$name = $_SESSION['name'] ?? "user";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Study Corner</title>
  <link rel="stylesheet" href="homepageStyle.css">
</head>
<body>
  <header>
    <div class="header-left">
      <h1 id="title">Study Corner</h1>
      <h2 id="authors">by: Webbers</h2>
    </div>
    <div class="header-right">
      <h1 id="mssg">Hello, [username]!</h1>
    </div>
  </header>

  <div class="container">
    <p id="quote"></p>
    <div class="card-section">
      <a class="navigation" href="timer.html"><div id="nav-timer">Timer</div></a>
      <a class="navigation" href="tasks_management.html"><div id="nav-tasks">Tasks</div></a>
      <a class="navigation" href="statistics.html"><div id="nav-stats">Statistics</div></a>
    </div>
    
    <div class="tasks-container">
      <h2 class="summary-title">Task Summary</h2>
      <div class="task-summary">
        <h3>🎉 Don't be lazy and JUST DO IT!!</h3>
        <hr>
        <div class="task-card due-soon">[Tasks Due Soon/OnGoing]</div>
        <div class="task-card due-soon">[Tasks Due Soon/OnGoing]</div>
        <div class="task-card due-soon">[Tasks Due Soon/OnGoing]</div>
      </div>
      <div class="insert-timer-float">
        <h2>Insert timer here</h2>
      </div>
    </div>
  </div>
  <script src="fetch.js"></script>
</body>
</html>