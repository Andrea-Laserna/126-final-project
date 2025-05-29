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
    <div class="logout">
      <a href="logout.php">
        <img src="images/log-out-04-svgrepo-com.svg">
      </a>
    </div>
  </header>

  <div class="container">
    <div class="quote-container">
      <p id="quote"></p>
    </div>
    <div class="card-section">
      <a class="navigation" href="timer.html">
        <div class="nav-content">
          <span class="text">Timer</span>
          <img src="timer.png" class="icon" alt="Timer Icon">
        </div>
      </a>
      <a class="navigation" href="tasks_management.html">
        <div class="nav-content">
          <span class="text">Tasks</span>
          <img src="task.png" class="icon" alt="Timer Icon">
        </div>
      </a>
      <a class="navigation" href="calendar.php">
        <div class="nav-content">
          <span class="text">Statistics</span>
          <img src="statistics.png" class="icon" alt="Timer Icon">
        </div>
      </a>
    </div>
    
    <div class="tasks-container">
      <div class="task-summary">
        <h3>Continue where you left off...</h3>
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
  <div class="spotify">
    <iframe
      src="https://open.spotify.com/embed/playlist/1iCIhy3fqqSBrTUcIxI804?utm_source=generator"
      frameborder="0" 
      allowfullscreen 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy">
  </iframe>
</div>

  <script src="fetch.js"></script>
</body>
</html>