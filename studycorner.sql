-- Create User table
CREATE TABLE User (
    u_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    pwd VARCHAR(100)
);

-- Create Task table
CREATE TABLE Task (
    t_id INT PRIMARY KEY,
    title VARCHAR(100),
    status VARCHAR(50),
    deadline DATE,
    u_id INT,
    FOREIGN KEY (u_id) REFERENCES User(u_id)
);

-- Create Timer table
CREATE TABLE Timer (
    time_id INT PRIMARY KEY,
    start_time DATETIME,
    end_time DATETIME,
    session_type VARCHAR(50),
    completed BOOLEAN,
    interrupted BOOLEAN,
    u_id INT,
    FOREIGN KEY (u_id) REFERENCES User(u_id)
);

-- Create creates relationship table (User creates Task)
CREATE TABLE creates (
    u_id INT,
    t_id INT,
    PRIMARY KEY (u_id, t_id),
    FOREIGN KEY (u_id) REFERENCES User(u_id),
    FOREIGN KEY (t_id) REFERENCES Task(t_id)
);

-- Create runs_for relationship table (Timer runs for Task)
CREATE TABLE runs_for (
    time_id INT,
    t_id INT,
    PRIMARY KEY (time_id, t_id),
    FOREIGN KEY (time_id) REFERENCES Timer(time_id),
    FOREIGN KEY (t_id) REFERENCES Task(t_id)
);

-- Create records relationship table (User records Timer)
CREATE TABLE records (
    u_id INT,
    time_id INT,
    PRIMARY KEY (u_id, time_id),
    FOREIGN KEY (u_id) REFERENCES User(u_id),
    FOREIGN KEY (time_id) REFERENCES Timer(time_id)
);

-- Insert dummy users
INSERT INTO User VALUES
(1, 'Alice', 'alice@example.com', 'alice123'),
(2, 'Bob', 'bob@example.com', 'bob123');

-- Insert dummy tasks
INSERT INTO Task VALUES
(101, 'Write report', 'in progress', '2025-05-20', 1),
(102, 'Read paper', 'completed', '2025-05-15', 2);

-- Insert dummy timers
INSERT INTO Timer VALUES
(1001, '2025-05-16 08:00:00', '2025-05-16 08:25:00', 'Pomodoro', TRUE, FALSE, 1),
(1002, '2025-05-16 09:00:00', '2025-05-16 09:30:00', 'Break', FALSE, TRUE, 2);

-- Insert into creates relationship
INSERT INTO creates VALUES
(1, 101),
(2, 102);

-- Insert into runs_for relationship
INSERT INTO runs_for VALUES
(1001, 101),
(1002, 102);

-- Insert into records relationship
INSERT INTO records VALUES
(1, 1001),
(2, 1002);
