<!-- this is code for the purchase details of last poin of problem statement -->
<!-- database sql code CREATE TABLE purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_email VARCHAR(100) NOT NULL,
    project_id INT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);  -->
<?php
// --- DB CONNECTION ---
require_once('database.php');
    $projects = $conn->query("SELECT id, title FROM projects");


// --- FORM HANDLING ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $buyer_email = $_POST['buyer_email'];
    $project_id = $_POST['project_id'];

    $insert = $conn->prepare("INSERT INTO purchases (buyer_email, project_id) VALUES (?, ?)");
    $insert->execute([$buyer_email, $project_id]);

    echo "<p style='color:green;'>✅ Purchase recorded successfully!</p>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Purchase Project</title>
</head>
<body>
<h2>Purchase a Project</h2>

<form method="POST">
    <label>Your Email:</label><br>
    <input type="email" name="buyer_email" required><br><br>

    <label>Select Project:</label><br>
    <select name="project_id" required>
        <option value="">-- Choose a Project --</option>
        <?php foreach ($projects as $proj): ?>
            <option value="<?= $proj['id'] ?>"><?= htmlspecialchars($proj['title']) ?></option>
        <?php endforeach; ?>
    </select><br><br>

    <button type="submit">Purchase</button>
</form>

<a href="view_marketplace.php">⬅️ Back to Project List</a>
</body>
</html>
