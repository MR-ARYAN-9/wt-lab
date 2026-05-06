<?php
// session-examples.php
// Small PHP examples for session usage.

declare(strict_types=1);
// Start or resume session
session_start();

// Example: set a session value
if (isset($_GET['action']) && $_GET['action'] === 'set') {
    $_SESSION['user'] = ['id' => 42, 'name' => 'Aryan'];
    echo json_encode(['ok' => true, 'msg' => 'Session value set', 'session' => $_SESSION]);
    exit;
}

// Example: read a session value
if (isset($_GET['action']) && $_GET['action'] === 'get') {
    $user = $_SESSION['user'] ?? null;
    echo json_encode(['ok' => true, 'user' => $user]);
    exit;
}

// Example: destroy session (logout)
if (isset($_GET['action']) && $_GET['action'] === 'destroy') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'], $params['secure'], $params['httponly']
        );
    }
    session_destroy();
    echo json_encode(['ok' => true, 'msg' => 'Session destroyed']);
    exit;
}

// Default: show simple HTML instructions
header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>PHP Session Examples</title></head>
<body>
  <h1>PHP Session Examples</h1>
  <ul>
    <li><a href="?action=set">Set a session value</a></li>
    <li><a href="?action=get">Get session value</a></li>
    <li><a href="?action=destroy">Destroy session (logout)</a></li>
  </ul>
  <p>Use the links to test session behavior. Inspect cookies in the browser to see the PHPSESSID cookie.</p>
</body>
</html>
