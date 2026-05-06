<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

// Simple dev CORS to support Live Server (5500) or PHP built-in server.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        $pdo = db();

        if (isset($_GET['id'])) {
            $id = require_int_query('id');
            $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if (!$product) {
                json_response(['ok' => false, 'error' => 'Product not found'], 404);
            }
            json_response(['ok' => true, 'data' => $product]);
        }

        $stmt = $pdo->query('SELECT * FROM products ORDER BY created_at DESC');
        $products = $stmt->fetchAll();
        json_response(['ok' => true, 'data' => $products]);
    }

    if ($method === 'POST') {
        $body = request_json_body();
        $data = array_merge($_POST, $body);

        $category = trim((string)($data['category'] ?? 'General'));
        $name = trim((string)($data['name'] ?? ''));
        $description = trim((string)($data['description'] ?? ''));
        $price = $data['price'] ?? null;
        $mrp = $data['mrp'] ?? null;
        $badge = trim((string)($data['badge'] ?? ''));
        $icon = trim((string)($data['icon'] ?? ''));

        if ($name === '' || $description === '') {
            json_response(['ok' => false, 'error' => 'name and description are required'], 400);
        }
        if (!is_numeric($price) || (float)$price < 0) {
            json_response(['ok' => false, 'error' => 'price must be a non-negative number'], 400);
        }
        if ($mrp !== null && $mrp !== '' && (!is_numeric($mrp) || (float)$mrp < 0)) {
            json_response(['ok' => false, 'error' => 'mrp must be a non-negative number'], 400);
        }

        $pdo = db();
        $stmt = $pdo->prepare('INSERT INTO products (category, name, description, price, mrp, badge, icon) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $category,
            $name,
            $description,
            (float)$price,
            ($mrp === null || $mrp === '') ? null : (float)$mrp,
            ($badge === '') ? null : $badge,
            ($icon === '') ? null : $icon,
        ]);

        $id = (int)$pdo->lastInsertId();
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        json_response(['ok' => true, 'data' => $product], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $id = require_int_query('id');
        $data = request_json_body();

        $allowed = ['category', 'name', 'description', 'price', 'mrp', 'badge', 'icon'];
        $setParts = [];
        $params = [];

        foreach ($allowed as $key) {
            if (!array_key_exists($key, $data)) {
                continue;
            }

            if (in_array($key, ['name', 'category'], true)) {
                $value = trim((string)$data[$key]);
                if ($value === '') {
                    json_response(['ok' => false, 'error' => "$key cannot be empty"], 400);
                }
                $setParts[] = "$key = ?";
                $params[] = $value;
                continue;
            }

            if ($key === 'description') {
                $value = trim((string)$data[$key]);
                if ($value === '') {
                    json_response(['ok' => false, 'error' => 'description cannot be empty'], 400);
                }
                $setParts[] = 'description = ?';
                $params[] = $value;
                continue;
            }

            if ($key === 'price') {
                if (!is_numeric($data[$key]) || (float)$data[$key] < 0) {
                    json_response(['ok' => false, 'error' => 'price must be a non-negative number'], 400);
                }
                $setParts[] = 'price = ?';
                $params[] = (float)$data[$key];
                continue;
            }

            if ($key === 'mrp') {
                $value = $data[$key];
                if ($value === null || $value === '') {
                    $setParts[] = 'mrp = NULL';
                    continue;
                }
                if (!is_numeric($value) || (float)$value < 0) {
                    json_response(['ok' => false, 'error' => 'mrp must be a non-negative number'], 400);
                }
                $setParts[] = 'mrp = ?';
                $params[] = (float)$value;
                continue;
            }

            if ($key === 'badge' || $key === 'icon') {
                $value = trim((string)$data[$key]);
                if ($value === '') {
                    $setParts[] = "$key = NULL";
                } else {
                    $setParts[] = "$key = ?";
                    $params[] = $value;
                }
                continue;
            }
        }

        if (count($setParts) === 0) {
            json_response(['ok' => false, 'error' => 'No valid fields to update'], 400);
        }

        $pdo = db();
        $sql = 'UPDATE products SET ' . implode(', ', $setParts) . ' WHERE id = ?';
        $params[] = $id;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if (!$product) {
            json_response(['ok' => false, 'error' => 'Product not found'], 404);
        }

        json_response(['ok' => true, 'data' => $product]);
    }

    if ($method === 'DELETE') {
        $id = require_int_query('id');
        $pdo = db();

        $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            json_response(['ok' => false, 'error' => 'Product not found'], 404);
        }

        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Server error'], 500);
}
