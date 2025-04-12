<?php
// Your YouTube Data API v3 key
$apiKey = 'AIzaSyBhVNCopqLEDj4NrOY06qzEWhHSKsBzWsA';
$apiKey = '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';//opensource.ai
// Arrays of YouTube video IDs categorized
$videos = [
    'trades' => [
        'tfGYR07Tgr4',
        'BorBwJD1_xI',
        'Hpqmcp-nKhk',
    ],
    'crafts' => [
        'ozMXZORhBJk',
        '23UIklqkc-Y',
        'zHR5_jYxHNg',
    ],
    'culture' => [
        'n2v42MAA6FY',
        'O030fzDUAOw',
        'EZjb5N0vkDE',
    ],
];

// Function to fetch video titles using YouTube Data API
function fetchVideoTitles($videoIds, $apiKey) {
    $titles = [];
    $ids = implode(',', $videoIds);
    $apiUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={$ids}&key={$apiKey}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $apiResponse = curl_exec($ch);
    curl_close($ch);

    if ($apiResponse) {
        $data = json_decode($apiResponse, true);
        if (isset($data['items'])) {
            foreach ($data['items'] as $item) {
                $videoId = $item['id'];
                $title = $item['snippet']['title'];
                $titles[$videoId] = $title;
            }
        }
    }

    return $titles;
}

// Fetch all video titles
$allVideoIds = array_merge(...array_values($videos));
$videoTitles = fetchVideoTitles($allVideoIds, $apiKey);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Preserving Cultural Knowledge</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        h2 {
            text-align: center;
            margin-bottom: 40px;
        }
        h4 {
            margin-top: 40px;
            font-size: 1.3em;
        }
        .video-group {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 30px;
        }
        .video-container {
            width: 360px;
        }
        iframe {
            width: 100%;
            height: 215px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .video-title {
            margin-top: 8px;
            font-weight: bold;
            font-size: 1em;
            text-align: center;
        }
    </style>
</head>
<body>

<h2>🎥 Preserving Knowledge Across Generations</h2>

<?php foreach ($videos as $category => $videoIds): ?>
    <h4>
        <?php
        if ($category === 'trades') echo '🛠️ Disappearing Trades';
        elseif ($category === 'crafts') echo '🎨 Traditional Crafts';
        elseif ($category === 'culture') echo '🌍 Cultural Practices & Mentorship';
        ?>
    </h4>

    <div class="video-group">
        <?php foreach ($videoIds as $vid): ?>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/<?php echo $vid; ?>" frameborder="0" allowfullscreen></iframe>
                <div class="video-title"><?php echo htmlspecialchars($videoTitles[$vid] ?? 'Video Title'); ?></div>
            </div>
        <?php endforeach; ?>
    </div>
<?php endforeach; ?>

</body>
</html>
