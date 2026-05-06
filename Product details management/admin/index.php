<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';

$pdo = db();
$products = $pdo->query('SELECT * FROM products ORDER BY created_at DESC')->fetchAll();

function e(string $v): string {
    return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}

?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Product Admin</title>
</head>
<body style="font-family:Segoe UI, Tahoma, sans-serif; background:#f0f2f5; margin:0; padding:24px; color:#1a1a2e;">

  <div style="max-width:1100px; margin:0 auto;">
    <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;">
      <h1 style="margin:0; font-size:28px;">Product Details Management</h1>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <a href="create.php" style="background:#e94560; color:#fff; text-decoration:none; padding:10px 14px; border-radius:10px; font-weight:700;">+ Add Product</a>
        <a href="../api/products.php" target="_blank" style="background:#16213e; color:#fff; text-decoration:none; padding:10px 14px; border-radius:10px; font-weight:700;">View API JSON</a>
      </div>
    </div>

    <div style="margin-top:18px; background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <table style="width:100%; border-collapse:collapse;">
        <thead style="background:#f8f9ff;">
          <tr>
            <th style="text-align:left; padding:12px 14px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#667788;">ID</th>
            <th style="text-align:left; padding:12px 14px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#667788;">Product</th>
            <th style="text-align:left; padding:12px 14px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#667788;">Category</th>
            <th style="text-align:left; padding:12px 14px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#667788;">Price</th>
            <th style="text-align:left; padding:12px 14px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#667788;">MRP</th>
            <th style="text-align:left; padding:12px 14px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#667788;">Badge</th>
            <th style="text-align:left; padding:12px 14px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#667788;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <?php if (!$products): ?>
            <tr>
              <td colspan="7" style="padding:18px 14px; color:#667788;">No products yet. Click “Add Product”.</td>
            </tr>
          <?php else: ?>
            <?php foreach ($products as $p): ?>
              <tr style="border-top:1px solid #eef1f6;">
                <td style="padding:12px 14px; color:#667788;">#<?php echo (int)$p['id']; ?></td>
                <td style="padding:12px 14px;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:#f0f2f5; font-size:18px;">
                      <?php echo e((string)($p['icon'] ?? '📦')); ?>
                    </div>
                    <div>
                      <div style="font-weight:700;"><?php echo e($p['name']); ?></div>
                      <div style="font-size:12px; color:#8899aa; max-width:520px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        <?php echo e($p['description']); ?>
                      </div>
                    </div>
                  </div>
                </td>
                <td style="padding:12px 14px; color:#667788;"><?php echo e($p['category']); ?></td>
                <td style="padding:12px 14px; font-weight:800; color:#e94560;">₹<?php echo number_format((float)$p['price'], 2); ?></td>
                <td style="padding:12px 14px; color:#667788;">
                  <?php if ($p['mrp'] !== null): ?>₹<?php echo number_format((float)$p['mrp'], 2); ?><?php else: ?>—<?php endif; ?>
                </td>
                <td style="padding:12px 14px; color:#667788;"><?php echo e((string)($p['badge'] ?? '')); ?></td>
                <td style="padding:12px 14px;">
                  <a href="edit.php?id=<?php echo (int)$p['id']; ?>" style="text-decoration:none; color:#16213e; font-weight:700; margin-right:12px;">Edit</a>
                  <form action="delete.php" method="post" style="display:inline;" onsubmit="return confirm('Delete this product?');">
                    <input type="hidden" name="id" value="<?php echo (int)$p['id']; ?>" />
                    <button type="submit" style="background:transparent; border:none; padding:0; color:#e74c3c; font-weight:800; cursor:pointer;">Delete</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

    <div style="margin-top:14px; color:#667788; font-size:13px;">
      Tip: Open your storefront page and it will load products from MySQL via the API.
    </div>
  </div>

</body>
</html>
