import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Course } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Video, Search, Filter } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [videoTitles, setVideoTitles] = useState<Record<string, string>>({});

  const categories = [
    "all",
    "Woodworking",
    "Leatherwork",
    "Blacksmithing",
    "Culinary",
    "Textile Arts",
    "Ceramics",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest("GET", "/api/courses");
        const data = await res.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        setError("Failed to load courses");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category === categoryFilter);
    }

    setFilteredCourses(filtered);
  }, [searchQuery, categoryFilter, courses]);

  useEffect(() => {
    const fetchVideoTitles = async () => {
      const allVideoIds = Object.values(videos).flat();
      const idsString = allVideoIds.join(',');
      const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBhVNCopqLEDj4NrOY06qzEWhHSKsBzWsA';

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idsString}&key=${apiKey}`
        );
        const data = await response.json();

        const titles: Record<string, string> = {};
        data.items?.forEach((item: any) => {
          titles[item.id] = item.snippet.title;
        });

        setVideoTitles(titles);
      } catch (error) {
        console.error('Error fetching video titles:', error);
      }
    };

    fetchVideoTitles();
  }, []);

  return (
    <MainLayout>
      <div className="pt-20 bg-neutral-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Explore Knowledge Paths
            </h1>
            <p className="text-neutral-600 max-w-2xl">
              Discover timeless courses crafted by master artisans and craftspeople from generations past.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <div className="lg:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading or Error */}
          {loading && <LoadingPage />}
          {error && <div className="text-center text-red-500 py-10">{error}</div>}

          <div className="bg-neutral-50 min-h-screen py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-24 py-12">
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text relative inline-block">
                  Preserving Knowledge Across Generations
                </h1>
              </header>

              {Object.entries(videos).map(([category, videoIds]) => (
                <section key={category} className="mb-24">
                  <h2 className="text-2xl font-serif mb-12 pb-4 border-b-2 border-purple-500/20 text-neutral-900">
                    {categoryTitles[category as keyof typeof categoryTitles]}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videoIds.map((videoId) => (
                      <div key={videoId} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border border-white/70 relative">
                        <div className="relative pb-[56.25%] bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={videoTitles[videoId] || 'YouTube Video'}
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
        </div>
      </div>
    </MainLayout>
  );
}