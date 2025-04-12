
import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, Play } from 'lucide-react';

export default function KnowledgeAIPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<string[]>([]);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
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
                  
                  <div className="flex gap-4 flex-wrap">
                    <Button type="button" variant="outline">
                      <Mic className="w-4 h-4 mr-2" />
                      Speak
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Ask AI'}
                    </Button>
                  </div>
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
                    <Button variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                    <Button variant="outline">
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
