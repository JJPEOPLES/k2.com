<?php
/**
 * K2 Code Execution API
 * 
 * This script executes K2 code using the precompiled x86_64 binary
 * and returns the output, execution time, and memory usage.
 */

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Validate the request
if (!isset($data['code']) || empty($data['code'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No code provided']);
    exit();
}

// Get the code
$code = $data['code'];

// Create a temporary file
$tempDir = sys_get_temp_dir();
$tempFile = tempnam($tempDir, 'k2_');
$tempFileK2 = $tempFile . '.k2';
rename($tempFile, $tempFileK2);

// Write the code to the temporary file
file_put_contents($tempFileK2, $code);

// Path to the K2 binary
$k2Binary = __DIR__ . '/../bin/k2_x86_64';

// Make sure the binary is executable
if (!is_executable($k2Binary)) {
    chmod($k2Binary, 0755);
}

// Execute the K2 binary
$startTime = microtime(true);
$output = [];
$returnCode = 0;

exec("$k2Binary $tempFileK2 2>&1", $output, $returnCode);

$endTime = microtime(true);
$executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

// Get memory usage (this is an approximation)
$memoryUsage = memory_get_peak_usage(true);

// Clean up the temporary file
unlink($tempFileK2);

// Prepare the response
$response = [
    'success' => $returnCode === 0,
    'output' => implode("\n", $output),
    'executionTime' => $executionTime,
    'memoryUsage' => $memoryUsage
];

// If there was an error, add the error code
if ($returnCode !== 0) {
    $response['errorCode'] = $returnCode;
}

// Return the response
echo json_encode($response);