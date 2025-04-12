
import { useState } from 'react';
import MainLayout from "@/components/layout/main-layout";

export default function KnowledgeAIPage() {
  const [prompt, setPrompt] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      setGptResponse(data.response);
      setVideoIds(data.videoIds || []);
      setStatus('');
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('Failed to get response. Please check server connection.');
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setStatus("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);
    setStatus("🎤 Listening...");
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
      setStatus("Processing...");
    };

    recognition.onerror = (event: any) => {
      setStatus("Error: " + event.error);
      setIsListening(false);
    };
  };

  return (
    <MainLayout>
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              AI Assistant
            </h1>
            <p className="text-neutral-600">Ask anything using voice or text</p>
          </header>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-neutral-200">
            <form onSubmit={handleSubmit}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your question or click 'Speak' to use voice..."
                className="w-full p-4 border-2 border-neutral-200 rounded-lg text-base min-h-[120px] mb-4 resize-y"
              />
              
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={startListening}
                  className="px-6 py-3 bg-neutral-100 text-neutral-800 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
                >
                  🎤 Speak
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                >
                  ✨ Ask AI
                </button>
              </div>
              
              {status && (
                <div className="mt-4 p-2 bg-neutral-100 text-center rounded-lg">
                  {status}
                </div>
              )}
            </form>
          </div>

          {gptResponse && (
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-neutral-200">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">AI Response</h2>
              <div className="bg-neutral-50 p-6 rounded-xl mb-6 whitespace-pre-wrap border border-neutral-200">
                {gptResponse}
              </div>
            </div>
          )}

          {videoIds.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Related Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoIds.map((videoId, index) => (
                  <div key={index} className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg w-full h-full"
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
