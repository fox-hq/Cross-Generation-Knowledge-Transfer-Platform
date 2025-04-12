<!-- point number 6 get marketplace data -->

<?php

require_once('database.php');
    // Fetch all projects
    $stmt= "SELECT * FROM projects ";
    $projects = $conn->query($stmt);


?>

<!DOCTYPE html>
<html>
<head>
    <title>View Projects</title>
</head>
<body>
<h2>All Projects</h2>

<?php foreach ($projects as $p): ?>
    <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
        <h3><?= htmlspecialchars($p['title']) ?> - $<?= number_format($p['price'], 2) ?></h3>
        <p><strong>By:</strong> <?= htmlspecialchars($p['uploader_name']) ?> (<?= htmlspecialchars($p['uploader_email']) ?>)</p>
        <p><?= nl2br(htmlspecialchars($p['description'])) ?></p>
        <p><strong>Category:</strong> <?= htmlspecialchars($p['category']) ?></p>
        <?php if ($p['file_path']): ?>
            <p><a href="<?= htmlspecialchars($p['file_path']) ?>" target="_blank">📁 Download File</a></p>
        <?php endif; ?>
    </div>
<?php endforeach; ?>

<a href="insert_marketplace.php">⬅️ Upload Another Project</a>
</body>
</html>
