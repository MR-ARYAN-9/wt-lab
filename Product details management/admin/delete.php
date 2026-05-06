<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
}

$id = $_POST['id'] ?? '';
if (!is_string($id) || !preg_match('/^\d+$/', $id)) {
    http_response_code(400);
    echo 'Missing/invalid id';
    exit;
}

$pdo = db();
$stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
$stmt->execute([(int)$id]);

header('Location: index.php');
exit;
