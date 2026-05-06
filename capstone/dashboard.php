<?php
require_once 'config.php';
require_login();
include 'includes/header.php';
?>
<section class="page">
  <h1>Dashboard</h1>
  <p>Welcome, <strong><?php echo htmlspecialchars($_SESSION['user_name']); ?></strong></p>
  <div class="dash-actions">
    <a class="btn" href="upload.php">Upload Project</a>
    <a class="btn btn-outline" href="projects.php">View All Projects</a>
  </div>

  <h2>Your Projects</h2>
  <?php
  $stmt = $conn->prepare("SELECT id,title,description,created_at,file_path FROM projects WHERE user_id = ? ORDER BY created_at DESC");
  $stmt->bind_param('i', $_SESSION['user_id']);
  $stmt->execute();
  $res = $stmt->get_result();
  if ($res->num_rows === 0) {
      echo '<p>No projects yet. Upload one now.</p>';
  } else {
      echo '<table class="projects-table"><thead><tr><th>Title</th><th>Uploaded</th><th>Actions</th></tr></thead><tbody>';
      while ($p = $res->fetch_assoc()) {
          echo '<tr>';
          echo '<td>' . htmlspecialchars($p['title']) . '</td>';
          echo '<td>' . $p['created_at'] . '</td>';
          echo '<td><a href="' . htmlspecialchars($p['file_path']) . '" target="_blank">Download</a> | <a href="projects.php?action=delete&id=' . $p['id'] . '" onclick="return confirm(\'Delete this?\')">Delete</a></td>';
          echo '</tr>';
      }
      echo '</tbody></table>';
  }
  ?>
</section>

<?php include 'includes/footer.php'; ?>
