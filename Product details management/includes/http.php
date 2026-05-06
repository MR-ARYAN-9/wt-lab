<?php

declare(strict_types=1);

function json_response(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_int_query(string $key): int
{
    $value = $_GET[$key] ?? null;
    if (!is_string($value) || !preg_match('/^\d+$/', $value)) {
        json_response(['ok' => false, 'error' => "Missing/invalid '$key'"], 400);
    }
    return (int)$value;
}
