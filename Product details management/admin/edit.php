<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';

function e(string $v): string {
    return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}

$id = $_GET['id'] ?? '';
if (!is_string($id) || !preg_match('/^\d+$/', $id)) {
    http_response_code(400);
    echo 'Missing/invalid id';
    exit;
}
$id = (int)$id;

$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
$product = $stmt->fetch();
if (!$product) {
    http_response_code(404);
    echo 'Product not found';
    exit;
}

$errors = [];
$values = [
    'category' => (string)$product['category'],
    'name' => (string)$product['name'],
    'description' => (string)$product['description'],
    'price' => (string)$product['price'],
    'mrp' => $product['mrp'] === null ? '' : (string)$product['mrp'],
    'badge' => $product['badge'] === null ? '' : (string)$product['badge'],
    'icon' => $product['icon'] === null ? '📦' : (string)$product['icon'],
];

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    foreach ($values as $k => $_) {
        $values[$k] = trim((string)($_POST[$k] ?? ''));
    }

    if ($values['category'] === '') $errors[] = 'Category is required.';
    if ($values['name'] === '') $errors[] = 'Name is required.';
    if ($values['description'] === '') $errors[] = 'Description is required.';
    if ($values['price'] === '' || !is_numeric($values['price']) || (float)$values['price'] < 0) $errors[] = 'Price must be a non-negative number.';
    if ($values['mrp'] !== '' && (!is_numeric($values['mrp']) || (float)$values['mrp'] < 0)) $errors[] = 'MRP must be a non-negative number.';

    if (!$errors) {
        $stmt = $pdo->prepare('UPDATE products SET category=?, name=?, description=?, price=?, mrp=?, badge=?, icon=? WHERE id=?');
        $stmt->execute([
            $values['category'],
            $values['name'],
            $values['description'],
            (float)$values['price'],
            $values['mrp'] === '' ? null : (float)$values['mrp'],
            $values['badge'] === '' ? null : $values['badge'],
            $values['icon'] === '' ? null : $values['icon'],
            $id,
        ]);

        header('Location: index.php');
        exit;
    }
}

?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Edit Product</title>
</head>
<body style="font-family:Segoe UI, Tahoma, sans-serif; background:#f0f2f5; margin:0; padding:24px; color:#1a1a2e;">

  <div style="max-width:800px; margin:0 auto;">
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
      <h1 style="margin:0; font-size:26px;">Edit Product #<?php echo $id; ?></h1>
      <a href="index.php" style="text-decoration:none; color:#16213e; font-weight:800;">← Back</a>
    </div>

    <?php if ($errors): ?>
      <div style="margin-top:14px; background:#fff; border:1px solid rgba(233,69,96,0.25); border-radius:12px; padding:14px 16px;">
        <div style="font-weight:800; color:#e94560; margin-bottom:6px;">Fix these:</div>
        <ul style="margin:0; padding-left:18px; color:#556677;">
          <?php foreach ($errors as $err): ?>
            <li><?php echo e($err); ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <form method="post" style="margin-top:14px; background:#fff; border-radius:14px; padding:18px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
        <label style="display:block;">
          <div style="font-size:12px; color:#667788; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">Category</div>
          <input name="category" value="<?php echo e($values['category']); ?>" style="width:100%; padding:12px; border:1px solid #e6eaf2; border-radius:10px;" />
        </label>

        <label style="display:block;">
          <div style="font-size:12px; color:#667788; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">Icon (emoji)</div>
          <input name="icon" value="<?php echo e($values['icon']); ?>" style="width:100%; padding:12px; border:1px solid #e6eaf2; border-radius:10px;" />
        </label>
      </div>

      <label style="display:block; margin-top:14px;">
        <div style="font-size:12px; color:#667788; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">Name</div>
        <input name="name" value="<?php echo e($values['name']); ?>" style="width:100%; padding:12px; border:1px solid #e6eaf2; border-radius:10px;" />
      </label>

      <label style="display:block; margin-top:14px;">
        <div style="font-size:12px; color:#667788; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">Description</div>
        <textarea name="description" rows="4" style="width:100%; padding:12px; border:1px solid #e6eaf2; border-radius:10px; resize:vertical;"><?php echo e($values['description']); ?></textarea>
      </label>

      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-top:14px;">
        <label style="display:block;">
          <div style="font-size:12px; color:#667788; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">Price</div>
          <input name="price" value="<?php echo e($values['price']); ?>" inputmode="decimal" style="width:100%; padding:12px; border:1px solid #e6eaf2; border-radius:10px;" />
        </label>

        <label style="display:block;">
          <div style="font-size:12px; color:#667788; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">MRP (optional)</div>
          <input name="mrp" value="<?php echo e($values['mrp']); ?>" inputmode="decimal" style="width:100%; padding:12px; border:1px solid #e6eaf2; border-radius:10px;" />
        </label>

        <label style="display:block;">
          <div style="font-size:12px; color:#667788; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">Badge (optional)</div>
          <input name="badge" value="<?php echo e($values['badge']); ?>" placeholder="NEW / HOT / PRO" style="width:100%; padding:12px; border:1px solid #e6eaf2; border-radius:10px;" />
        </label>
      </div>

      <div style="display:flex; gap:12px; margin-top:18px; align-items:center;">
        <button type="submit" style="background:#16213e; color:#fff; border:none; padding:12px 18px; border-radius:12px; font-weight:800; cursor:pointer;">Save Changes</button>
        <a href="index.php" style="color:#667788; text-decoration:none; font-weight:700;">Cancel</a>
      </div>

    </form>
  </div>

</body>
</html>
