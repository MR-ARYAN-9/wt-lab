-- Product Details Management (MySQL)
-- Import this in phpMyAdmin / MySQL CLI.

CREATE DATABASE IF NOT EXISTS studentverse_market
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studentverse_market;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2) NULL,
  badge VARCHAR(20) NULL,
  icon VARCHAR(16) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_category (category),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB;

-- Seed data (optional)
INSERT INTO products (category, name, description, price, mrp, badge, icon)
VALUES
  ('AI Tools', 'AI Study Assistant Pro', 'Smart notes, summaries & question-answer generation powered by AI.', 499.00, 999.00, 'NEW', '🤖'),
  ('Coding', 'Full Stack Dev Bundle', 'HTML, CSS, JS, React & Node.js project templates with guides.', 799.00, 1499.00, 'HOT', '💻'),
  ('Study', 'Smart Study Kit 2026', 'Planner, flashcard deck, revision tracker & Pomodoro timer.', 299.00, 599.00, NULL, '📚'),
  ('Security', 'Cybersec Crash Course', 'Ethical hacking basics, CTF challenges & security labs.', 649.00, 1299.00, 'PRO', '🔒');
