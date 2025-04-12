
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
        $videoIds = array_slice(array_unique($videoIds), 0, 3);
    }
    curl_close($ch);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Assistant | Your Intelligent Companion</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #6366f1;
            --bg-color: #f8fafc;
            --text-color: #334155;
            --border-color: #e2e8f0;
            --accent-color: #818cf8;
            --shadow-color: rgba(99, 102, 241, 0.1);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: var(--bg-color);
            padding: 1.5rem 1rem;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            animation: fadeIn 0.6s ease-out;
        }

        .header h1 {
            font-size: 2.75rem;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }

        .input-section {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 30px var(--shadow-color);
            margin-bottom: 2rem;
            border: 1px solid var(--border-color);
            animation: fadeIn 0.6s ease-out 0.2s backwards;
        }

        .controls {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin: 1rem 0;
        }

        textarea {
            width: 100%;
            padding: 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            resize: vertical;
            min-height: 120px;
            margin-bottom: 1rem;
        }

        button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 12px;
            background: var(--primary-color);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        button::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(255,255,255,0.2), transparent);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        button:hover::after {
            opacity: 1;
        }

        button:active {
            transform: scale(0.98);
        }

        .secondary-button {
            background: #f8fafc;
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }

        button:focus {
            outline: none;
            box-shadow: 0 0 0 3px var(--shadow-color);
        }

        select {
            padding: 0.75rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            background: white;
        }

        .response-section {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 30px var(--shadow-color);
            margin-bottom: 2rem;
            border: 1px solid var(--border-color);
            animation: fadeIn 0.6s ease-out 0.4s backwards;
        }

        .response-text {
            background: #f8fafc;
            padding: 1.75rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            white-space: pre-wrap;
            border: 1px solid var(--border-color);
            line-height: 1.8;
        }

        h2 {
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            letter-spacing: -0.01em;
        }

        .videos-section {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .video-container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
            height: 0;
            overflow: hidden;
        }

        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 8px;
        }

        .status {
            margin-top: 1rem;
            padding: 0.5rem;
            border-radius: 6px;
            background: #f3f4f6;
            text-align: center;
        }

        @media (max-width: 768px) {
            .controls {
                flex-direction: column;
            }
            
            button, select {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>AI Assistant</h1>
            <p>Ask anything using voice or text</p>
        </header>

        <div class="input-section">
            <form method="POST" action="" id="gpt-form">
                <textarea 
                    id="prompt" 
                    name="prompt" 
                    placeholder="Type your question or click 'Speak' to use voice..."
                ><?php echo htmlspecialchars($_POST['prompt'] ?? '') ?></textarea>
                
                <div class="controls">
                    <button type="button" onclick="startListening()" class="secondary-button">
                        🎤 Speak
                    </button>
                    <button type="submit">
                        ✨ Ask AI
                    </button>
                    <select id="voiceSelect" aria-label="Voice selection">
                        <option>English (US)</option>
                    </select>
                    <select id="langSelect" aria-label="Language selection">
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="fr-FR">French</option>
                    </select>
                </div>
                <div id="status" class="status"></div>
            </form>
        </div>

        <?php if (!empty($gptResponse)): ?>
            <div class="response-section">
                <h2>AI Response</h2>
                <div class="response-text">
                    <?php echo htmlspecialchars($gptResponse); ?>
                </div>
                <div class="controls">
                    <button onclick="speakText()" class="secondary-button">
                        🔊 Listen
                    </button>
                    <button onclick="stopSpeaking()" class="secondary-button">
                        ⏹️ Stop
                    </button>
                </div>
            </div>

            <?php if (!empty($videoIds)): ?>
                <div class="response-section">
                    <h2>Related Videos</h2>
                    <div class="videos-section">
                        <?php foreach ($videoIds as $vid): ?>
                            <div class="video-container">
                                <iframe
                                    src="https://www.youtube.com/embed/<?php echo htmlspecialchars($vid); ?>"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen>
                                </iframe>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>

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

        function startListening() {
            const status = document.getElementById('status');
            const textarea = document.getElementById('prompt');
            
            if (!('webkitSpeechRecognition' in window)) {
                status.textContent = "Voice recognition not supported in this browser";
                return;
            }

            const recognition = new webkitSpeechRecognition();
            recognition.lang = document.getElementById("langSelect").value;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.start();
            status.textContent = "🎤 Listening...";
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                textarea.value = transcript;
                status.textContent = "Processing...";
                document.getElementById('gpt-form').submit();
            };

            recognition.onerror = function(event) {
                status.textContent = "Error: " + event.error;
            };
        }

        speechSynthesis.onvoiceschanged = populateVoices;
        window.onload = populateVoices;
    </script>
</body>
</html>
