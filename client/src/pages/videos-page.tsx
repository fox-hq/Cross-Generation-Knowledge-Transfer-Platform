
import MainLayout from "@/components/layout/main-layout";
import { useState, useEffect } from "react";
import { VideoCategories } from "@/lib/types";

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

export default function VideosPage() {
  const [videoTitles, setVideoTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchVideoTitles = async () => {
      const allVideoIds = Object.values(videos).flat();
      const idsString = allVideoIds.join(',');
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

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

  return (
    <MainLayout>
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16 pt-16">
            <h1 className="text-4xl md:text-6xl font-black mb-12 py-4 leading-tight tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Video Learning Library
            </h1>
          </header>

          {Object.entries(videos).map(([category, videoIds]) => (
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
        </div>
      </div>
    </MainLayout>
  );
}
