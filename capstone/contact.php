<?php
require_once 'config.php';
$success = '';
$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = esc($_POST['name'] ?? '');
    $email = esc($_POST['email'] ?? '');
    $message = esc($_POST['message'] ?? '');
    if (!$name) $errors[] = 'Name required.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email required.';
    if (!$message) $errors[] = 'Message cannot be empty.';

    if (empty($errors)) {
        $ins = $conn->prepare("INSERT INTO contacts (name,email,message) VALUES (?,?,?)");
        $ins->bind_param('sss', $name, $email, $message);
        if ($ins->execute()) {
            $success = 'Thank you! Your message has been received.';
        } else {
            $errors[] = 'Failed to save message.';
        }
    }
}

include 'includes/header.php';
?>
<section class="page form-page">
  <h1>Contact</h1>
  <?php if ($success): ?>
    <div class="alert alert-success"><?php echo $success; ?></div>
  <?php endif; ?>
  <?php if (!empty($errors)): ?>
    <div class="alert alert-error"><ul><?php foreach ($errors as $e) echo '<li>' . $e . '</li>'; ?></ul></div>
  <?php endif; ?>
  <form id="contactForm" method="post" action="contact.php" onsubmit="return validateContact()">
    <label>Name</label>
    <input type="text" name="name" required>
    <label>Email</label>
    <input type="email" name="email" required>
    <label>Message</label>
    <textarea name="message" rows="6" required></textarea>
    <button class="btn" type="submit">Send Message</button>
  </form>
</section>

<?php include 'includes/footer.php'; ?>
