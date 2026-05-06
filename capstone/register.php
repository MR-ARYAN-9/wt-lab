<?php
require_once 'config.php';
// Registration handler
$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = esc($_POST['name'] ?? '');
    $email = esc($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm'] ?? '';

    if (!$name) $errors[] = 'Name is required.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
    if (strlen($password) < 6) $errors[] = 'Password must be at least 6 characters.';
    if ($password !== $confirm) $errors[] = 'Passwords do not match.';

    if (empty($errors)) {
        // check if email exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $errors[] = 'Email already registered.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $ins = $conn->prepare("INSERT INTO users (name,email,password) VALUES (?,?,?)");
            $ins->bind_param('sss', $name, $email, $hash);
            if ($ins->execute()) {
                header('Location: login.php?registered=1');
                exit;
            } else {
                $errors[] = 'Registration failed. Try again.';
            }
        }
    }
}

include 'includes/header.php';
?>
<section class="page form-page">
  <h1>Register</h1>
  <?php if (!empty($errors)): ?>
    <div class="alert alert-error">
      <ul><?php foreach ($errors as $e) echo '<li>' . $e . '</li>'; ?></ul>
    </div>
  <?php endif; ?>
  <form id="registerForm" method="post" action="register.php" onsubmit="return validateRegister()">
    <label>Name</label>
    <input type="text" name="name" required>
    <label>Email</label>
    <input type="email" name="email" required>
    <label>Password</label>
    <input type="password" name="password" required>
    <label>Confirm Password</label>
    <input type="password" name="confirm" required>
    <button class="btn" type="submit">Register</button>
  </form>
  <p>Already have an account? <a href="login.php">Login here</a>.</p>
</section>

<?php include 'includes/footer.php'; ?>
