<?php
require_once 'config.php';
require_login();
$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = esc($_POST['title'] ?? '');
    $description = esc($_POST['description'] ?? '');
    if (!$title) $errors[] = 'Title is required.';

    if (!isset($_FILES['project_file']) || $_FILES['project_file']['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'File upload failed.';
    } else {
        $f = $_FILES['project_file'];
        $allowed = ['application/pdf', 'application/zip', 'application/x-zip-compressed'];
        if (!in_array($f['type'], $allowed)) {
            $errors[] = 'Only PDF or ZIP files allowed.';
        }
        if ($f['size'] > 10 * 1024 * 1024) { // 10MB limit
            $errors[] = 'File too large (max 10MB).';
        }
    }

    if (empty($errors)) {
        $ext = pathinfo($f['name'], PATHINFO_EXTENSION);
        $safeName = uniqid('proj_') . '.' . $ext;
        $dest = UPLOAD_DIR . $safeName;
        if (!move_uploaded_file($f['tmp_name'], $dest)) {
            $errors[] = 'Failed to move uploaded file.';
        } else {
            // store relative path for web access
            $relPath = 'uploads/' . $safeName;
            $ins = $conn->prepare("INSERT INTO projects (user_id,title,description,file_path) VALUES (?,?,?,?)");
            $ins->bind_param('isss', $_SESSION['user_id'], $title, $description, $relPath);
            if ($ins->execute()) {
                header('Location: dashboard.php');
                exit;
            } else {
                $errors[] = 'Database error: could not save project.';
            }
        }
    }
}

include 'includes/header.php';
?>
<section class="page form-page">
  <h1>Upload Project</h1>
  <?php if (!empty($errors)): ?>
    <div class="alert alert-error"><ul><?php foreach ($errors as $e) echo '<li>' . $e . '</li>'; ?></ul></div>
  <?php endif; ?>
  <form method="post" enctype="multipart/form-data" id="uploadForm" onsubmit="return validateUpload()">
    <label>Title</label>
    <input type="text" name="title" required>
    <label>Description</label>
    <textarea name="description" rows="6"></textarea>
    <label>Project File (PDF or ZIP)</label>
    <input type="file" name="project_file" accept=".pdf,.zip" required>
    <button class="btn" type="submit">Upload</button>
  </form>
</section>

<?php include 'includes/footer.php'; ?>
