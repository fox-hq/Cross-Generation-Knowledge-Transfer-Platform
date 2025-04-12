import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Course } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Volume2, StopCircle } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
}

interface VideoCategories {
  trades: string[];
  crafts: string[];
  culture: string[];
}

const videos: VideoCategories = {
  trades: [
    'tfGYR07Tgr4',
    'BorBwJD1_xI',
    'Hpqmcp-nKhk',
  ],
  crafts: [
    'ozMXZORhBJk',
    '23UIklqkc-Y',
    'zHR5_jYxHNg',
  ],
  culture: [
    'n2v42MAA6FY',
    'O030fzDUAOw',
    'EZjb5N0vkDE',
  ],
};

const categoryTitles = {
  trades: '🛠️ Disappearing Trades',
  crafts: '🎨 Traditional Crafts',
  culture: '🌍 Cultural Practices & Mentorship'
};

export default function ExplorePage() {
  const [location] = useLocation();
  const type = new URLSearchParams(location.split('?')[1]).get('type');
  
  // Knowledge AI states
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [aiVideos, setAiVideos] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Video explorer states
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoTitles, setVideoTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        const res = await apiRequest("GET", "/api/courses");
        const data = await res.json();
        if (mounted) {
          setCourses(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load courses");
          console.error("Error fetching courses:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchVideoTitles = async () => {
      const allVideoIds = Object.values(videos).flat();
      const idsString = allVideoIds.join(',');
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyBhVNCopqLEDj4NrOY06qzEWhHSKsBzWsA';

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idsString}&key=${apiKey}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Failed to fetch video titles');
        const data = await response.json();

        if (mounted) {
          const titles: Record<string, string> = {};
          data.items?.forEach((item: any) => {
            titles[item.id] = item.snippet.title;
          });
          setVideoTitles(titles);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Error fetching video titles:', error);
      }
    };

    fetchVideoTitles();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  // Knowledge AI handlers
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
    setAiLoading(true);
    
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await res.json();
      setResponse(data.response);
      setAiVideos(data.videos || []);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to get response');
    } finally {
      setAiLoading(false);
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
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16 pt-16">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-black mb-12 py-4 leading-tight tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                {type === 'ai' ? 'Knowledge AI Assistant' : 'Preserving Knowledge Across Generations'}
              </h1>
            </div>
          </header>

          {type === 'ai' ? (
            <div className="max-w-4xl mx-auto">
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
                      <Button type="submit" disabled={aiLoading}>
                        {aiLoading ? 'Processing...' : 'Ask AI'}
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

              {aiVideos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {aiVideos.map((videoId, index) => (
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
          ) : (
            Object.entries(videos).map(([category, videoIds]) => (
            <section key={category} className="mb-20">
              <h2 className="text-2xl font-serif mb-12 pb-4 border-b-2 border-purple-500/20 text-neutral-900">
                {categoryTitles[category as keyof typeof categoryTitles]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoIds.map((videoId) => (
                  <div key={videoId} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border border-white/70 relative">
                    <div className="relative pb-[56.25%] bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={videoTitles[videoId] || 'Loading...'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    <div className="p-8 bg-gradient-to-b from-white/90 to-white backdrop-blur-sm">
                      <h3 className="text-lg font-medium text-neutral-900 leading-relaxed">
                        {videoTitles[videoId] || 'Loading...'}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          )}
        </div>
      </div>
    </MainLayout>
  );
}