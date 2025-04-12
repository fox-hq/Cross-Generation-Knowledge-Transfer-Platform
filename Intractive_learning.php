<!-- point 2 -->

<?php
$apiKey = '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';
$youtubeApiKey = 'AIzaSyBhVNCopqLEDj4NrOY06qzEWhHSKsBzWsA';

$gptResponse = '';
$videoIds = [];

function getYouTubeVideos($searchQuery, $apiKey, $maxResults = 1) {
    $query = urlencode($searchQuery);
    $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=$maxResults&q={$query}&key={$apiKey}";

    $response = file_get_contents($url);
    $result = json_decode($response, true);

    $videoIds = [];
    if (!empty($result['items'])) {
        foreach ($result['items'] as $item) {
            if (!empty($item['id']['videoId'])) {
                $videoIds[] = $item['id']['videoId'];
            }
        }
    }
    return $videoIds;
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST['prompt'])) {
    $userPrompt = trim($_POST['prompt']);

    // GPT API request
    $data = [
        "model" => "mistralai/mistral-7b-instruct",
        "messages" => [
            ["role" => "user", "content" => $userPrompt]
        ],
        "max_tokens" => 300,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://openrouter.ai/api/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
        'HTTP-Referer: your-site.com',
        'X-Title: MyGPTApp'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);

    if (!curl_errno($ch)) {
        $result = json_decode($response, true);
        $gptResponse = $result['choices'][0]['message']['content'] ?? '';

        // Ask GPT to give keywords for videos based on its response
        $videoQuery = "Give me 3 short but specific keyword phrases (comma separated) I can use to search for YouTube videos related to this content: $gptResponse";
        $keywordData = [
            "model" => "mistralai/mistral-7b-instruct",
            "messages" => [["role" => "user", "content" => $videoQuery]],
            "max_tokens" => 20,
        ];

        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($keywordData));
        $keywordsResp = curl_exec($ch);
        $keywordsResult = json_decode($keywordsResp, true);
        $ytKeywordsText = $keywordsResult['choices'][0]['message']['content'] ?? $userPrompt;

        $ytKeywords = array_map('trim', explode(',', $ytKeywordsText));
        foreach ($ytKeywords as $kw) {
            $results = getYouTubeVideos($kw, $youtubeApiKey, 1);
            if (!empty($results)) {
                $videoIds = array_merge($videoIds, $results);
            }
        }

        $videoIds = array_slice(array_unique($videoIds), 0, 3); // Up to 3 videos
    }
    curl_close($ch);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Talking AI Assistant + YouTube</title>
</head>
<body>
    <h2>Ask Anything (Voice or Text)</h2>
    <form method="POST" action="" id="gpt-form">
        <textarea id="prompt" name="prompt" rows="4" cols="60" placeholder="Speak or type..."><?php echo htmlspecialchars($_POST['prompt'] ?? '') ?></textarea><br><br>
        <button type="button" onclick="startListening()">🎙️ Speak</button>
        <button type="submit">Ask</button><br><br>

        <label for="voiceSelect">Voice:</label>
        <select id="voiceSelect">English (US)</select>

        <label for="langSelect">Language:</label>
        <select id="langSelect">
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="hi-IN">Hindi</option>
            <option value="fr-FR">French</option>
        </select>

        <p id="status"></p>
    </form>

    <?php if (!empty($gptResponse)): ?>
        <h3>AI Response:</h3>
        <div id="response" style="white-space: pre-wrap; background-color: #f0f0f0; padding: 10px;">
            <?php echo htmlspecialchars($gptResponse); ?>
        </div>

        <button onclick="speakText()" style="margin-top: 10px;">🔊 Listen</button>
        <button onclick="stopSpeaking()">🛑 Stop</button>

        <script>
            const responseText = <?php echo json_encode($gptResponse); ?>;
            let utterance = null;
            let selectedVoice = null;

            const speakText = () => {
                stopSpeaking();
                utterance = new SpeechSynthesisUtterance(responseText);
                utterance.lang = document.getElementById("langSelect").value;
                if (selectedVoice) utterance.voice = selectedVoice;
                speechSynthesis.speak(utterance);
            };

            const stopSpeaking = () => {
                speechSynthesis.cancel();
            };

            const populateVoices = () => {
                const voices = speechSynthesis.getVoices();
                const voiceSelect = document.getElementById("voiceSelect");
                voiceSelect.innerHTML = '';
                voices.forEach((voice, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                });
                voiceSelect.onchange = () => {
                    selectedVoice = voices[voiceSelect.value];
                };
            };

            speechSynthesis.onvoiceschanged = populateVoices;
            window.onload = populateVoices;
        </script>

        <!-- YouTube Section -->
        <?php if (!empty($videoIds)): ?>
            <h3>Related YouTube Videos:</h3>
            <?php foreach ($videoIds as $vid): ?>
                <iframe width="560" height="315"
                        src="https://www.youtube.com/embed/<?php echo $vid; ?>"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen style="margin-bottom: 20px;">
                </iframe>
            <?php endforeach; ?>
        <?php else: ?>
            <p><strong>No related videos found.</strong></p>
        <?php endif; ?>
    <?php endif; ?>

    <!-- Voice Recognition -->
    <script>
        function startListening() {
            const status = document.getElementById('status');
            const textarea = document.getElementById('prompt');

            if (!('webkitSpeechRecognition' in window)) {
                alert("Voice recognition not supported.");
                return;
            }

            const recognition = new webkitSpeechRecognition();
            recognition.lang = document.getElementById("langSelect").value;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.start();
            status.innerText = "Listening... 🎧";

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                textarea.value = transcript;
                status.innerText = "Submitting...";
                document.getElementById('gpt-form').submit();
            };

            recognition.onerror = function(event) {
                status.innerText = "Error: " + event.error;
            };
        }
    </script>

    <!-- Optional D-ID Avatar -->
    <script src="https://unpkg.com/@d-id/viewer@latest/dist/viewer.js"></script>
    <d-id-viewer
        style="width: 320px; height: 320px;"
        id="talking-avatar"
        script="Hello! I'm your AI assistant. Ask me anything!"
        autoplay
    ></d-id-viewer>
</body>
</html>
