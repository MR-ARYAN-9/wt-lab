<?php
require_once 'config.php';
$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = esc($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email required.';
    if (!$password) $errors[] = 'Password required.';

    if (empty($errors)) {
        $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ? LIMIT 1");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            if (password_verify($password, $row['password'])) {
                // login success
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_name'] = $row['name'];
                header('Location: dashboard.php');
                exit;
            } else {
                $errors[] = 'Incorrect credentials.';
            }
        } else {
            $errors[] = 'No account found with that email.';
        }
    }
}

include 'includes/header.php';
?>
<section class="page form-page">
  <h1>Login</h1>
  <?php if (isset($_GET['registered'])): ?>
    <div class="alert alert-success">Registration successful. Please login.</div>
  <?php endif; ?>
  <?php if (!empty($errors)): ?>
    <div class="alert alert-error">
      <ul><?php foreach ($errors as $e) echo '<li>' . $e . '</li>'; ?></ul>
    </div>
  <?php endif; ?>
  <form id="loginForm" method="post" action="login.php" onsubmit="return validateLogin()">
    <label>Email</label>
    <input type="email" name="email" required>
    <label>Password</label>
    <input type="password" name="password" required>
    <button class="btn" type="submit">Login</button>
  </form>
  <p>No account? <a href="register.php">Register here</a>.</p>
</section>

<?php include 'includes/footer.php'; ?>
