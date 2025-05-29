<?php
session_start();
include "DBConnector.php";
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
      <h1 id="mssg">Hello, <?php echo htmlspecialchars($name); ?>!</h1>
    </div>
  </header>

  <div class="container">
    <p id="quote"></p>
    <div class="card-section">
      <a class="navigation" href="timer.html">
        <span class="text">Timer</span>
        <img src="timer.png" class="icon" alt="Timer Icon">
      </a>
      <a class="navigation" href="tasks_management.html">
        <span class="text">Tasks</span>
        <img src="task.png" class="icon" alt="Timer Icon">
      </a>
      <a class="navigation" href="calendar.php">
        <span class="text">Statistics</span>
        <img src="statistics.png" class="icon" alt="Timer Icon">
      </a>
    </div>
    
    <div class="tasks-container">
      <h2 class="summary-title">Task Summary</h2>
      <div class="task-summary">
        <h3>🎉 Don't be lazy and JUST DO IT!!</h3>
        <hr>
        <!-- for tasks in ongoing, echo php -->
        <?php
          $sql = "SELECT * FROM task WHERE u_id = ? AND status = 'ongoing'";
          $result = $conn->prepare($sql);
          $result->bind_param("i", $_SESSION['u_id']);
          if ($result->execute()) {
            $result = $result->get_result();
            if ($result->num_rows > 0) {
              while ($row = $result->fetch_assoc()) {
                echo "<div class='task-card ongoing'>" . htmlspecialchars($row['title']) . "</div>";
              }
            } else {
              echo "<div class='task-card no-tasks'>No ongoing tasks</div>";
            }
          } else {
            echo "<div class='task-card error'>Error fetching tasks</div>";
          }
        ?>
      </div>
    </div>
  </div>
  <script src="fetch.js"></script>
</body>
</html>