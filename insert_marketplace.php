<!-- this is code for the insert the marketplace code point number 6 of problem statement -->
<?php
require_once('database.php');

// --- FORM HANDLING ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['uploader_name'];
    $email = $_POST['uploader_email'];
    $title = $_POST['title'];
    $desc = $_POST['description'];
    $price = $_POST['price'];
    $category = $_POST['category'];
    $filePath = "";

    if (!empty($_FILES['file']['name'])) {
        $uploadDir = 'uploads/';
        $fileName = basename($_FILES['file']['name']);
        $filePath = $uploadDir . $fileName;
        move_uploaded_file($_FILES['file']['tmp_name'], $filePath);
    }

    $stmt = $conn->prepare("INSERT INTO projects (uploader_name, uploader_email, title, description, file_path, price, category) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $title, $desc, $filePath, $price, $category]);

    echo "<p style='color:green;'>✅ Project uploaded!</p>";
}
?>

<!-- --- HTML FORM --- -->
<!DOCTYPE html>
<html>
<head><title>Upload Project</title></head>
<body>
<h2>Upload New Project</h2>
<form method="POST" enctype="multipart/form-data">
    <input type="text" name="uploader_name" placeholder="Your Name" required><br><br>
    <input type="email" name="uploader_email" placeholder="Your Email" required><br><br>
    <input type="text" name="title" placeholder="Project Title" required><br><br>
    <textarea name="description" placeholder="Description" required></textarea><br><br>
    <input type="text" name="category" placeholder="Category"><br><br>
    <input type="number" step="0.01" name="price" placeholder="Price" required><br><br>
    <input type="file" name="file" required><br><br>
    <button type="submit">Upload Project</button>
</form>

<a href="view_marketplace.php">➡️ View All Projects</a>
</body>
</html>
