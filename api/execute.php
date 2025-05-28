<?php
/**
 * K2 Code Execution API
 */

// === CORS HEADERS ===
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// === Handle Preflight ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === Validate Method ===
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// === Get Payload ===
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['code']) || trim($data['code']) === '') {
    http_response_code(400);
    echo json_encode(['error' => 'No code provided']);
    exit();
}

// === Prepare Temp File ===
$code = $data['code'];
$tempFileK2 = tempnam(sys_get_temp_dir(), 'k2_') . '.k2';
file_put_contents($tempFileK2, $code);

// === Binary Path ===
$k2Binary = __DIR__ . '/../bin/k2_x86_64';
if (!is_executable($k2Binary)) {
    chmod($k2Binary, 0755);
}

// === Execute ===
$start = microtime(true);
$output = [];
exec("$k2Binary $tempFileK2 2>&1", $output, $exitCode);
$end = microtime(true);

// === Clean Up ===
unlink($tempFileK2);

// === Respond ===
echo json_encode([
    'success' => $exitCode === 0,
    'output' => implode("\n", $output),
    'executionTime' => round(($end - $start) * 1000, 2), // ms
    'memoryUsage' => memory_get_peak_usage(true),
    'errorCode' => $exitCode !== 0 ? $exitCode : null
]);
