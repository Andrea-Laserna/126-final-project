<?php
session_start();
include 'DBConnector.php';

if (isset($_SESSION['u_id'])) {
    $u_id = $_SESSION['u_id'];

    $sql = "
        SELECT 
            session_type,
            ROUND(SUM(TIMESTAMPDIFF(SECOND, start_time, end_time)) / 60, 2) AS total_minutes
        FROM timer 
        WHERE u_id = ?
          AND start_time IS NOT NULL
          AND end_time IS NOT NULL
        GROUP BY session_type
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $u_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $_SESSION['pomodoro_minutes'] = 0;
    $_SESSION['break_minutes'] = 0;

    while ($row = $result->fetch_assoc()) {
        if ($row['session_type'] === 'Pomodoro') {
            $_SESSION['Pomodoro'] = $row['total_minutes'];
        } elseif ($row['session_type'] === 'Break') {
            $_SESSION['Break'] = $row['total_minutes'];
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport"
		content="width=device-width, 
				initial-scale=1.0">
	<link rel="stylesheet" href="style.css">
	<title>Study Calendar</title>
</head>

<body>
	<header>
    <div class="header-left">
      <h1 id="title">Study Corner</h1>
      <h2 id="authors">by: Webbers</h2>
    </div>
    <div class="navBar">
		<a class="navigation" id="homepage" href="homepage.php">Home</a>
		<a class="navigation" href="timer.html" id="timer">Timer</a>
	    <a class="navigation" href="tasks_management.html" id="tasks">Tasks</a>
      	<a class="navigation" href="calendar.php" id="stats">Calendar & Statistics</a>
	</div>
  	</header>
	<!-- Main wrapper for the calendar application -->
	<div class="wrapper">
		<div class="container-calendar">
			<div id="left">
				<h1>Study Calendar</h1>
				<div id="event-section">
					<h3>Add Event</h3>
					<form action="reminder.php" method="POST">
						<input type="date" name= "date" id="eventDate">
						<input type="text" name="event"
							id="eventTitle"
							placeholder="Event Title">
						<input type="text" name="eventDescription"
							id="eventDescription"
							placeholder="Event Description">
						<button type="submit"> Add </button>
					</form>
				</div>
			</div>
		
			<div id="right">
				<h3 id="monthAndYear"></h3>
				<div class="button-container-calendar">
					<button id="previous"
							onclick="previous()">
						‹
					</button>
					<button id="next"
							onclick="next()">
						›
					</button>
				</div>
				<table class="table-calendar"
					id="calendar"
					data-lang="en">
					<thead id="thead-month"></thead>
					<!-- Table body for displaying the calendar -->
					<tbody id="calendar-body"></tbody>
				</table>
				<div class="footer-container-calendar">
					<label for="month">Jump To: </label>
					<!-- Dropdowns to select a specific month and year -->
					<select id="month" onchange="jump()">
						<option value=0>Jan</option>
						<option value=1>Feb</option>
						<option value=2>Mar</option>
						<option value=3>Apr</option>
						<option value=4>May</option>
						<option value=5>Jun</option>
						<option value=6>Jul</option>
						<option value=7>Aug</option>
						<option value=8>Sep</option>
						<option value=9>Oct</option>
						<option value=10>Nov</option>
						<option value=11>Dec</option>
					</select>
					<!-- Dropdown to select a specific year -->
					<select id="year" onchange="jump()"></select>
				</div>
			</div>
			<div id="reminder-section">
				<h3>Reminders</h3>
					<!-- List to display reminders -->
					<ul id="phpReminderList">
					<?php
					include 'DBConnector.php';

					if (isset($_SESSION['u_id'])) {
						$u_id = $_SESSION['u_id'];

						$stmt = $conn->prepare("SELECT id, date, reminder_title, reminder FROM calendar WHERE u_id = ?");
						$stmt->bind_param("i", $u_id);
						$stmt->execute();
						$result = $stmt->get_result();
						
						if($result->num_rows > 0){
							while ($row = $result->fetch_assoc()) {
								echo "<li data-event-id='{$row['id']}'>
									<strong>" . htmlspecialchars($row['reminder_title']) . "</strong>
									- " . htmlspecialchars($row['reminder']) . " on " . htmlspecialchars($row['date']) . 
									"<form action='deleteReminder.php' method='post' onsubmit=\"return confirm('Are you sure you want to delete this reminder?');\" style='display:inline;'>
										<input type='hidden' name='id' value='" . $row["id"] . "'>
										<input type='submit' value='Delete'>
									</form>
								</li>";
							}
						} else {
							echo "<li>No reminders yet.</li>";
						}
					} else {
						echo "<li>Please log in to see your reminders.</li>";
					}
					?>
					</ul>
					</div>
				</div>
			<div class="stats-container">
				<h2>Study Stats</h2>
				<?php
				if(isset($_SESSION['u_id'])){
					$pomodoro_decimal = $_SESSION['Pomodoro'] ?? 0;
					$break_decimal = $_SESSION['Break'] ?? 0; 

					// Optionally convert to hours/minutes
					$pomodoro_minutes = floor($pomodoro_decimal);
					$pomodoro_seconds = round(($pomodoro_decimal- $pomodoro_minutes) * 60);

					$break_minutes = floor($break_decimal);
					$break_seconds = round(($break_decimal- $break_minutes) * 60);

					echo "<p><strong>Pomodoro Time:</strong> {$pomodoro_minutes} minutes {$pomodoro_seconds} seconds</p>";
					echo "<p><strong>Break Time:</strong> {$break_minutes} minutes {$break_seconds} seconds</p>";
				} else {
					echo "<p>Please log in to see your study statistics.</p>";
				}
				?>	
			</div>
		</div>
	</div>
	<!-- Include the JavaScript file for the calendar functionality -->
	<script src="./script.js"></script>
</body>
</html> 