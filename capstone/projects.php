<?php
require_once 'config.php';
// Handle delete (optional)
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
    // only allow owner to delete
    $stmt = $conn->prepare("SELECT user_id, file_path FROM projects WHERE id = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($p = $res->fetch_assoc()) {
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $p['user_id']) {
            // delete file
            @unlink(__DIR__ . '/' . $p['file_path']);
            $del = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $del->bind_param('i', $id);
            $del->execute();
            header('Location: projects.php');
            exit;
        }
    }
}

include 'includes/header.php';
?>
<section class="page">
  <h1>All Projects</h1>
  <?php
  $res = $conn->query("SELECT p.id,p.title,p.description,p.file_path,p.created_at,u.name FROM projects p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC");
  if ($res->num_rows === 0) {
      echo '<p>No projects uploaded yet.</p>';
  } else {
      echo '<table class="projects-table"><thead><tr><th>Title</th><th>Author</th><th>Uploaded</th><th>Actions</th></tr></thead><tbody>';
      while ($row = $res->fetch_assoc()) {
          echo '<tr>';
          echo '<td>' . htmlspecialchars($row['title']) . '<div class="muted">' . htmlspecialchars(substr($row['description'], 0, 120)) . '</div></td>';
          echo '<td>' . htmlspecialchars($row['name']) . '</td>';
          echo '<td>' . $row['created_at'] . '</td>';
          echo '<td><a href="' . htmlspecialchars($row['file_path']) . '" target="_blank">Download</a>';
          if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $row['user_id']) {
              echo ' | <a href="projects.php?action=delete&id=' . $row['id'] . '" onclick="return confirm(\'Delete this?\')">Delete</a>';
          }
          echo '</td>';
          echo '</tr>';
      }
      echo '</tbody></table>';
  }
  ?>
</section>

<?php include 'includes/footer.php'; ?>
