
import { useState, useEffect, FormEvent } from 'react';
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export default function KnowledgeAIPage() {
  const [prompt, setPrompt] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    function populateVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }
    
    window.speechSynthesis.onvoiceschanged = populateVoices;
    populateVoices();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ai/chat', {
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
      setStatus("Error: " + event.error);
    };
  };

  const speakText = () => {
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
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 py-4 leading-tight tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
            AI Assistant
          </h1>
          <p className="text-neutral-600">Ask anything using voice or text</p>
        </header>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
          <form onSubmit={handleSubmit}>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your question or click 'Speak' to use voice..."
              className="min-h-[120px] mb-4"
            />
            
            <div className="flex flex-wrap gap-4">
              <Button type="button" variant="outline" onClick={startListening}>
                🎤 Speak
              </Button>
              <Button type="submit">
                ✨ Ask AI
              </Button>
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
              <div className="mt-4 p-2 bg-neutral-100 rounded-lg text-center">
                {status}
              </div>
            )}
          </form>
        </div>

        {gptResponse && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">AI Response</h2>
            <div className="bg-neutral-50 p-7 rounded-xl mb-6 whitespace-pre-wrap border border-neutral-200">
              {gptResponse}
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={speakText}>
                🔊 Listen
              </Button>
              <Button variant="outline" onClick={stopSpeaking}>
                ⏹️ Stop
              </Button>
            </div>
          </div>
        )}

        {videoIds.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Related Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoIds.map((vid, index) => (
                <div key={index} className="relative w-full pt-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${vid}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
