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
    <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/20 bg-primary/5 text-primary">
            <Star className="h-3.5 w-3.5 mr-1 text-yellow-500 fill-yellow-500" />
            Premium Knowledge Paths
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">Featured Learning Journeys</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Learn rare and traditional crafts directly from masters who have perfected their skills through decades of practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="modern-card card-hover group relative bg-white rounded-xl overflow-hidden border border-neutral-200"
            >
              {/* Ribbon for popular courses */}
              {course.id === 3 && (
                <div className="absolute -right-12 top-6 bg-yellow-500 text-white font-bold py-1 px-12 text-sm shadow-md transform rotate-45 z-10">
                  Popular
                </div>
              )}

              <div className="relative overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-8 w-8 text-primary fill-primary ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary text-white border-0">
                      {course.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <span className="text-white text-xs ml-1">(27)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <Link href={`/course/${course.id}`}>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-4 pb-4 border-b border-neutral-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 text-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <span className="font-bold">{course.instructorId}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Instructor #{course.instructorId}</p>
                    <p className="text-xs text-neutral-500 flex items-center">
                      <Award className="h-3 w-3 mr-1 text-yellow-500" /> Master Craftsman
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Video className="h-4 w-4 mr-1.5 text-primary/70" /> 
                    <span>{course.lessonCount} lessons</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Clock className="h-4 w-4 mr-1.5 text-primary/70" /> 
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Users className="h-4 w-4 mr-1.5 text-primary/70" /> 
                    <span>125 students</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <span className="text-green-500 font-medium">Beginner friendly</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-primary">${Number(course.price)}</p>
                  <Button size="sm" className="group">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/explore" className="font-medium inline-flex items-center">
              View All Learning Paths
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
