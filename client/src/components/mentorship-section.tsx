import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Mentorship } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";

export function MentorshipSection() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const res = await apiRequest("GET", "/api/mentorships");
        const data = await res.json();
        setMentorships(data);
      } catch (error) {
        setError("Failed to load mentorships");
        console.error("Error fetching mentorships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorships();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900">Connect with Master Craftspeople</h2>
          <p className="mt-4 text-lg text-neutral-600">Get personalized guidance from experts who have decades of experience in their crafts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentorships.map((mentorship) => (
            <div key={mentorship.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={mentorship.imageUrl}
                  alt={mentorship.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm bg-primary-100 text-primary flex items-center justify-center mr-4 -mt-12">
                    <span className="font-bold">{mentorship.mentorId}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900">Mentor #{mentorship.mentorId}</h3>
                    <p className="text-neutral-600 text-sm">{mentorship.title}</p>
                  </div>
                </div>
                
                <p className="text-neutral-600 mb-5">{mentorship.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">${Number(mentorship.price)} / {mentorship.duration}</span>
                  <Button asChild size="sm">
                    <Link href="/mentorship">Book Session</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/mentorship" className="inline-flex items-center text-primary hover:text-primary-700 font-medium">
            View all mentors <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
