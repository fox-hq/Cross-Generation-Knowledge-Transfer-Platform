<!-- point1 code -->
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
$apiKey = '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';

$answer = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $context = $_POST['context'] ?? '';
    $question = $_POST['question'] ?? '';
    $fileText = file_get_contents($_FILES['doc']['tmp_name']);

    // Combine uploaded text and additional context
    $fullContext = "Craft Document:\n" . $fileText . "\n\nAdditional Background Info:\n" . $context;

    // Create the full prompt
    $prompt = "You are an expert craftsperson helping to document and explain specialized techniques. Based on the following context, answer the question.\n\n" .
              "=== CONTEXT START ===\n" . $fullContext . "\n=== CONTEXT END ===\n\n" .
              "Question: " . $question;

    // Chat completion payload
    $data = [
        "model" => "mistralai/mistral-7b-instruct",        // You can change this to any other free model from OpenRouter
        'messages' => [
            ['role' => 'system', 'content' => 'You are a helpful assistant with deep knowledge of crafts and cultural techniques.'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.7
    ];

    // cURL request to OpenRouter API
    $ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
        'HTTP-Referer: http://localhost',  // Required - change to your actual domain if online
        'X-Title: Craft Assistant'         // Optional title for logging
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
    }

    curl_close($ch);

    $responseData = json_decode($response, true);

    if (isset($error_msg)) {
        $answer = "Curl error: " . $error_msg;
    } elseif (isset($responseData['error'])) {
        $answer = "API Error: " . $responseData['error']['message'];
    } else {
        $answer = $responseData['choices'][0]['message']['content'] ?? 'No response from AI.';
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>AI Craft Assistant</title>
</head>
<body>
    <h2>AI Craft Knowledge Assistant</h2>
    <form method="POST" enctype="multipart/form-data">
        <label>Upload Craft Document (TXT only):</label><br>
        <input type="file" name="doc" required><br><br>

        <label>Additional Context (e.g. "40 years pottery experience in Rajasthan"):</label><br>
        <textarea name="context" rows="4" cols="60" placeholder="Enter craft context..."></textarea><br><br>

        <label>Ask your question:</label><br>
        <input type="text" name="question" size="60" placeholder="Ask me anything about this document / pottery" required><br><br>

        <button type="submit">Submit</button>
    </form>

    <?php if ($answer): ?>
        <h3>AI Response:</h3>
        <pre><?php echo htmlspecialchars($answer); ?></pre>
    <?php endif; ?>
</body>
</html>
