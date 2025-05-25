-- K2 Account System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS k2_accounts;
USE k2_accounts;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tier ENUM('free', 'basic', 'pro') NOT NULL DEFAULT 'free',
    join_date DATETIME NOT NULL,
    last_login DATETIME,
    INDEX (username),
    INDEX (email)
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code MEDIUMTEXT NOT NULL,
    created DATETIME NOT NULL,
    last_modified DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id)
);

-- Forum categories table
CREATE TABLE IF NOT EXISTS forum_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_read_only BOOLEAN NOT NULL DEFAULT FALSE,
    requires_pro BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    INDEX (display_order)
);

-- Forum threads table
CREATE TABLE IF NOT EXISTS forum_threads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created DATETIME NOT NULL,
    last_reply DATETIME,
    views INT NOT NULL DEFAULT 0,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (category_id),
    INDEX (user_id),
    INDEX (created)
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created DATETIME NOT NULL,
    FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (thread_id),
    INDEX (user_id),
    INDEX (created)
);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, is_read_only, requires_pro, display_order)
VALUES 
('Announcements', 'Official announcements about K2 language and platform', TRUE, FALSE, 1),
('General Discussion', 'General discussion about K2 programming language', FALSE, FALSE, 2),
('Help & Support', 'Get help with K2 programming problems', FALSE, FALSE, 3),
('Project Showcase', 'Share your K2 projects and get feedback', FALSE, FALSE, 4),
('Tutorials & Resources', 'Tutorials, guides, and learning resources', FALSE, FALSE, 5),
('Advanced Techniques', 'Advanced programming techniques and optimizations', FALSE, TRUE, 6);

-- Create user for the application
CREATE USER IF NOT EXISTS 'k2_user'@'localhost' IDENTIFIED BY 'k2_password';
GRANT ALL PRIVILEGES ON k2_accounts.* TO 'k2_user'@'localhost';
FLUSH PRIVILEGES;