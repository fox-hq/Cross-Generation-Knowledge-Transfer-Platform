
import { useState, FormEvent, useEffect } from 'react';
import MainLayout from "@/components/layout/main-layout";

export default function KnowledgeAIPage() {
  const [prompt, setPrompt] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    function populateVoices() {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    }

    window.speechSynthesis.onvoiceschanged = populateVoices;
    populateVoices();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      setGptResponse(data.response);
      setVideoIds(data.videoIds || []);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to get response');
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setStatus("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setStatus("🎤 Listening...");
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setStatus("Processing...");
    };

    recognition.onerror = (event: any) => {
      setStatus(`Error: ${event.error}`);
    };
  };

  const speakText = () => {
    if (!gptResponse) return;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(gptResponse);
    utterance.lang = selectedLanguage;
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <MainLayout>
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16 pt-16">
            <h1 className="text-4xl md:text-6xl font-black mb-4 py-4 leading-tight tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              AI Assistant
            </h1>
            <p className="text-neutral-600">Ask anything using voice or text</p>
          </header>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
            <form onSubmit={handleSubmit}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your question or click 'Speak' to use voice..."
                className="w-full p-4 min-h-[120px] mb-4 border-2 border-neutral-200 rounded-lg"
              />
              
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={startListening}
                  className="px-6 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 font-semibold hover:bg-neutral-50"
                >
                  🎤 Speak
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                >
                  ✨ Ask AI
                </button>
                <select
                  className="px-3 py-2 border border-neutral-200 rounded-lg"
                  onChange={(e) => setSelectedVoice(voices[parseInt(e.target.value)])}
                >
                  {voices.map((voice, index) => (
                    <option key={index} value={index}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-neutral-200 rounded-lg"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="fr-FR">French</option>
                </select>
              </div>
              {status && (
                <div className="mt-4 p-2 bg-neutral-100 text-neutral-700 rounded-lg text-center">
                  {status}
                </div>
              )}
            </form>
          </div>

          {gptResponse && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">AI Response</h2>
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 mb-6 whitespace-pre-wrap">
                {gptResponse}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={speakText}
                  className="px-6 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 font-semibold hover:bg-neutral-50"
                >
                  🔊 Listen
                </button>
                <button
                  onClick={stopSpeaking}
                  className="px-6 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 font-semibold hover:bg-neutral-50"
                >
                  ⏹️ Stop
                </button>
              </div>
            </div>
          )}

          {videoIds.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Related Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoIds.map((videoId, index) => (
                  <div key={index} className="relative w-full pt-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-xl"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
