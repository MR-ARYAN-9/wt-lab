<?php
require_once 'config.php';
include 'includes/header.php';
?>
<section class="hero">
  <div class="hero-inner">
    <h1>Student Project Management System</h1>
    <p>Manage and share capstone projects. Register, upload, and browse projects.</p>
    <?php if (!is_logged_in()): ?>
      <p><a class="btn" href="register.php">Get Started</a> <a class="btn btn-outline" href="login.php">Login</a></p>
    <?php else: ?>
      <p><a class="btn" href="dashboard.php">Go to Dashboard</a></p>
    <?php endif; ?>
  </div>
</section>

<section class="features container">
  <h2>Features</h2>
  <div class="grid">
    <div class="card">
      <h3>User Authentication</h3>
      <p>Register and login securely with hashed passwords.</p>
    </div>
    <div class="card">
      <h3>Project Uploads</h3>
      <p>Upload PDF/ZIP files and store project details.</p>
    </div>
    <div class="card">
      <h3>Contact</h3>
      <p>Contact form stored in the database.</p>
    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>
