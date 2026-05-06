<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// InfinityFree database details
define('DB_HOST', 'sql104.infinityfree.com');
define('DB_USER', 'if0_41837815');
define('DB_PASS', 'dYOIbF8LUvw'); // your password
define('DB_NAME', 'if0_41837815_spms'); // your DB name

// Upload directory
define('UPLOAD_DIR', __DIR__ . '/uploads/');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Error handling
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Helpers
function esc($str) {
    global $conn;
    return htmlspecialchars($conn->real_escape_string(trim($str)));
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function require_login() {
    if (!is_logged_in()) {
        header("Location: login.php");
        exit;
    }
}
?>