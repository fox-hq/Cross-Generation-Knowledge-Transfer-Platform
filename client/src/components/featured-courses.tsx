import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Course } from "@shared/schema";
import { LoadingPage } from "@/components/ui/loading";
import { apiRequest } from "@/lib/queryClient";
import { Clock, Video, ArrowRight, Award, Star, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest("GET", "/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        setError("Failed to load courses");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <section className="py-16 bg-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/40 bg-primary/10 text-primary">
            <Star className="h-3.5 w-3.5 mr-1 text-yellow-500 fill-yellow-500" />
            Premium Knowledge Paths
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">Featured Learning Journeys</h2>
          <p className="text-neutral-300 max-w-2xl mx-auto">
            Learn rare and traditional crafts directly from masters who have perfected their skills through decades of practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-6">
          {courses.map((course) => (
            <div key={course.id} className="card">
              {/* Course image as background */}
              <img 
                src={course.imageUrl || 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5'} 
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Content overlay that grows on hover */}
              <div className="content">
                <p className="heading">{course.title}</p>
                <p className="para">
                  {course.description.length > 150 
                    ? `${course.description.substring(0, 150)}...` 
                    : course.description}
                </p>
                
                <div className="flex items-center space-x-1 text-yellow-400 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <span className="text-white text-xs ml-1">(27)</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary/80 text-white border-0">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 border-white/20 text-white">
                    <Clock className="h-3 w-3 mr-1" /> {course.duration}
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 border-white/20 text-white">
                    <Video className="h-3 w-3 mr-1" /> {course.lessonCount} lessons
                  </Badge>
                </div>
                
                <div className="price-tag mb-4 text-xl">${Number(course.price)}</div>
                
                <Link href={`/course/${course.id}`}>
                  <button className="btn">Enroll Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            variant="outline" 
            asChild 
            className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
          >
            <Link href="/explore" className="font-medium inline-flex items-center">
              View All Learning Paths
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
