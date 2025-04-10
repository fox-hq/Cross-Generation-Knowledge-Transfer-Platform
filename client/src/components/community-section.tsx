import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Discussion, Showcase } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";
import { Eye, MessageSquare, Heart } from "lucide-react";

export function CommunitySection() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const [discussionsRes, showcasesRes] = await Promise.all([
          apiRequest("GET", "/api/discussions"),
          apiRequest("GET", "/api/showcases")
        ]);
        
        const discussionsData = await discussionsRes.json();
        const showcasesData = await showcasesRes.json();
        
        setDiscussions(discussionsData);
        setShowcases(showcasesData);
      } catch (error) {
        setError("Failed to load community data");
        console.error("Error fetching community data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  // Function to format date
  const formatTimeSince = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return '1d ago';
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 text-center">Join Our Community</h2>
          <p className="mt-4 text-lg text-neutral-600 text-center">
            Connect with fellow learners, share your progress, and get advice from practitioners around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Recent Discussions</h3>
            
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="bg-white border border-neutral-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-4">
                      <span className="font-bold">{discussion.userId}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-neutral-900">{discussion.title}</h4>
                        <span className="text-sm text-neutral-500">{formatTimeSince(discussion.createdAt)}</span>
                      </div>
                      <p className="text-neutral-600 text-sm mb-3">{discussion.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          <span className="flex items-center">
                            <MessageSquare className="mr-1.5 h-4 w-4" /> {Math.floor(Math.random() * 15)} replies
                          </span>
                          <span className="flex items-center">
                            <Eye className="mr-1.5 h-4 w-4" /> {discussion.views} views
                          </span>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-0.5 bg-primary-100 text-primary-800 rounded-full">
                          {discussion.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/community" className="text-primary hover:text-primary-700 font-medium">
                View all discussions
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Learner Showcases</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showcases.map((showcase) => (
                <div key={showcase.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                  <img 
                    src={showcase.imageUrl}
                    alt={showcase.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-neutral-900 mb-1">{showcase.title}</h4>
                    <p className="text-sm text-neutral-600 mb-3">{showcase.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-2">
                          <span className="text-xs font-bold">{showcase.userId}</span>
                        </div>
                        <span className="text-xs text-neutral-500">User #{showcase.userId}</span>
                      </div>
                      <div className="flex items-center text-neutral-500">
                        <Heart className="mr-1 h-4 w-4" />
                        <span className="text-xs">{showcase.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/community" className="text-primary hover:text-primary-700 font-medium">
                View all showcases
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
