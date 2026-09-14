<?php
/**
 * BRIX contact form handler — for Hostinger (or any PHP host).
 * The static site POSTs JSON here from components/form/ContactForm.tsx.
 * Validation mirrors lib/form/schema.ts.
 *
 * SETUP: set $TO below. For best deliverability, create a mailbox on your own
 * domain in hPanel (e.g. noreply@yourdomain.com) and set $FROM to it — mail
 * "from" a gmail.com address sent by your server is often marked as spam.
 */

$TO   = 'brixmasonrycontact@gmail.com';
$FROM = 'noreply@' . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'localhost');

$PROJECT_TYPES = ['BRICK', 'BLOCK', 'STONE', 'CONCRETE', 'OUTDOOR', 'CUSTOM'];
$WINDOW = 60;   // seconds
$MAX    = 5;    // submissions per IP per window

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reply($status, $body) {
  http_response_code($status);
  echo json_encode($body);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  reply(405, ['ok' => false, 'reason' => 'method-not-allowed']);
}

// Rate limit per IP, tracked in the system temp dir.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/brix-contact-' . md5($ip);
$now = time();
$hits = [];
if (is_file($bucket)) {
  $hits = array_filter(
    array_map('intval', explode(',', (string) @file_get_contents($bucket))),
    function ($t) use ($now, $WINDOW) { return $t > $now - $WINDOW; }
  );
}
if (count($hits) >= $MAX) {
  reply(429, ['ok' => false, 'reason' => 'rate-limited']);
}
$hits[] = $now;
@file_put_contents($bucket, implode(',', $hits));

$data = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($data)) {
  reply(400, ['ok' => false, 'reason' => 'invalid-json']);
}

$clean = function ($key) use ($data) {
  $v = isset($data[$key]) && is_string($data[$key]) ? trim($data[$key]) : '';
  // Strip anything that could inject mail headers.
  return str_replace(["\r", "\0"], '', $v);
};

$name    = $clean('name');
$email   = $clean('email');
$phone   = $clean('phone');
$type    = $clean('projectType');
$job     = $clean('job');
$company = $clean('company');

// Honeypot: a filled "company" field is a bot. Answer 200 so it learns nothing.
if ($company !== '') {
  reply(200, ['ok' => true]);
}

$errors = [];
if ($name === '' || mb_strlen($name) > 200) $errors['name'] = 'Name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email.';
if ($phone !== '' && !preg_match('/^[+()\d][\d\s\-().]{6,}$/', $phone)) $errors['phone'] = 'Enter a valid phone number.';
if (!in_array($type, $PROJECT_TYPES, true)) $errors['projectType'] = 'Select a project type.';
if (mb_strlen($job) < 20 || mb_strlen($job) > 5000) $errors['job'] = 'Tell us a little more about the job.';
if ($errors) {
  reply(422, ['ok' => false, 'errors' => $errors]);
}

$name = str_replace("\n", ' ', $name);
$subject = 'New estimate request: ' . $type . ' - ' . $name;
$body = "New estimate request from the website\n\n"
  . "Name:         $name\n"
  . "Email:        $email\n"
  . "Phone:        " . ($phone !== '' ? $phone : '-') . "\n"
  . "Project type: $type\n\n"
  . "The job:\n$job\n\n"
  . "--\nSent " . date('Y-m-d H:i') . " from " . ($_SERVER['HTTP_HOST'] ?? 'the website') . "\n";

$headers = [
  'From: BRIX Website <' . $FROM . '>',
  'Reply-To: ' . $name . ' <' . $email . '>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f' . $FROM);

if (!$sent) {
  reply(502, ['ok' => false, 'reason' => 'mail-failed']);
}
reply(200, ['ok' => true]);
