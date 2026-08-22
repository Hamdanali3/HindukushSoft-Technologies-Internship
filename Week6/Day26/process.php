<?php
require __DIR__.'/includes/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: index.php'); exit; }
validate_csrf();
$name = trim((string)($_POST['name'] ?? '')); $email = trim((string)($_POST['email'] ?? '')); $subject = trim((string)($_POST['subject'] ?? '')); $priority = (string)($_POST['priority'] ?? 'normal'); $message = trim((string)($_POST['message'] ?? ''));
$errors = [];
if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 80) $errors[] = 'Please provide a name between 2 and 80 characters.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Please provide a valid email address.';
if ($subject === '' || mb_strlen($subject) > 120) $errors[] = 'Please provide a subject up to 120 characters.';
if (!in_array($priority, ['normal','high','urgent'], true)) $errors[] = 'Please choose a valid priority.';
if ($message === '' || mb_strlen($message) < 20 || mb_strlen($message) > 1200) $errors[] = 'Please provide a message between 20 and 1200 characters.';
if ($errors) { $_SESSION['success'] = implode(' ', $errors); header('Location: index.php'); exit; }
$_SESSION['success'] = "Thanks, {$name}. Your {$priority}-priority request has been received for review.";
header('Location: index.php'); exit;
