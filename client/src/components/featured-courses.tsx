import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Course } from "@shared/schema";
import { LoadingPage } from "@/components/ui/loading";
import { apiRequest } from "@/lib/queryClient";
import { Clock, Video, ArrowRight } from "lucide-react";

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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Featured Knowledge Paths</h2>
            <p className="text-neutral-600 mt-2">Explore our most popular learning journeys</p>
          </div>
          <Link href="/explore" className="text-primary hover:text-primary-700 font-medium flex items-center">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative pb-[56.25%]">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="absolute inset-0 h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                  <h3 className="text-white text-lg font-semibold mt-2">{course.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-100 text-primary rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">{course.instructorId}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Instructor #{course.instructorId}</p>
                    <p className="text-xs text-neutral-500">Master Craftsman</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-neutral-500">
                    <Video className="h-4 w-4 mr-1.5" /> {course.lessonCount} lessons
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1.5" /> {course.duration}
                  </div>
                  <p className="text-primary font-semibold">${Number(course.price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
