
import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Volume2, StopCircle } from 'lucide-react';

export default function KnowledgeAIPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [videos, setVideos] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await res.json();
      setResponse(data.response);
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setStatus('Voice recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = selectedLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setStatus('🎤 Listening...');
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setStatus('Processing...');
    };

    recognition.onerror = (event: any) => {
      setStatus(`Error: ${event.error}`);
    };
  };

  const speakText = () => {
    stopSpeaking();
    if (response) {
      utteranceRef.current = new SpeechSynthesisUtterance(response);
      utteranceRef.current.lang = selectedLang;
      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
      }
      speechSynthesis.speak(utteranceRef.current);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Knowledge AI Assistant
            </h1>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Ask Anything</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type your question or click 'Speak' to use voice..."
                    className="mb-4"
                  />
                  
                  <div className="flex flex-wrap gap-4">
                    <Button type="button" variant="outline" onClick={startListening}>
                      <Mic className="w-4 h-4 mr-2" />
                      Speak
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Ask AI'}
                    </Button>
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={voices.indexOf(selectedVoice!)}
                      onChange={(e) => setSelectedVoice(voices[parseInt(e.target.value)])}
                    >
                      {voices.map((voice, index) => (
                        <option key={index} value={index}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                    <select
                      className="px-3 py-2 border rounded-md"
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="hi-IN">Hindi</option>
                      <option value="fr-FR">French</option>
                    </select>
                  </div>
                  {status && (
                    <div className="mt-4 p-2 bg-neutral-100 rounded-md text-center">
                      {status}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {response && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>AI Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-neutral-100 p-6 rounded-lg mb-4 whitespace-pre-wrap">
                    {response}
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={speakText}>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                    <Button variant="outline" onClick={stopSpeaking}>
                      <StopCircle className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((videoId, index) => (
                      <div key={index} className="relative aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          className="absolute inset-0 w-full h-full rounded-lg"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
