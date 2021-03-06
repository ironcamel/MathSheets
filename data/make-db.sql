CREATE TABLE IF NOT EXISTS "sheet" (
    id INT,
    student VARCHAR(100) NOT NULL,
    finished DATE, math_skill VARCHAR(200), difficulty INT default 1,
    PRIMARY KEY (id, student),
    FOREIGN KEY (student) REFERENCES student (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "problem" (
    id        INT NOT NULL,
    sheet     INT NOT NULL,
    student   VARCHAR(100)  NOT NULL,
    question  VARCHAR(1000) NOT NULL,
    answer    VARCHAR(100)  NOT NULL,
    guess     VARCHAR(100),
    is_solved INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id, sheet, student),
    FOREIGN KEY (sheet, student) REFERENCES sheet (id, student)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "teacher" (
    id      VARCHAR(100) PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    email   VARCHAR(100) NOT NULL UNIQUE,
    pw_hash TEXT
, rewards_email VARCHAR(200), created TIMESTAMP, updated TIMESTAMP);
CREATE TABLE IF NOT EXISTS "student" (
    id         VARCHAR(100) PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    last_sheet INT NOT NULL DEFAULT 0,
    teacher_id VARCHAR(100) NOT NULL,
    math_skill VARCHAR(200) NOT NULL,
    difficulty INT NOT NULL DEFAULT 1,
    problems_per_sheet INT NOT NULL DEFAULT 10, password VARCHAR(100), created TIMESTAMP, updated TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teacher (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE reward (
    id         VARCHAR(100) PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    reward     TEXT NOT NULL,
    is_given INT NOT NULL DEFAULT 0,
    sheet_id   INT,
    week_goal INT,
    month_goal INT,
    FOREIGN KEY (student_id) REFERENCES student (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE password_reset_token (
    id VARCHAR(100) PRIMARY KEY,
    teacher_id VARCHAR(100) NOT NULL,
    is_deleted INT NOT NULL DEFAULT 0,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE auth_token (
    id VARCHAR(100) PRIMARY KEY,
    teacher_id VARCHAR(100) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    is_deleted INT NOT NULL DEFAULT 0,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "powerup" (
    id      INT NOT NULL,
    student VARCHAR(100) NOT NULL,
    cnt     INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id, student),
    FOREIGN KEY (student) REFERENCES student (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
