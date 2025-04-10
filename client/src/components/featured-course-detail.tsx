import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Video, FileText, MessageSquare, Star, StarHalf } from "lucide-react";
import { Course } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";

export function FeaturedCourseDetail() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch a featured course (using course id 4 from our sample data)
        const res = await apiRequest("GET", "/api/courses/4");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        setError("Failed to load course details");
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!course) return null;

  const modules = [
    {
      title: "Module 1: Introduction to Traditional Blacksmithing",
      lessons: [
        { title: "1.1 The History and Importance of Blacksmithing", duration: "10:15" },
        { title: "1.2 Setting Up Your Workspace", duration: "15:22" },
        { title: "1.3 Essential Tools and Materials", duration: "12:48" }
      ]
    },
    {
      title: "Module 2: Forging Fundamentals",
      lessons: [
        { title: "2.1 Building and Maintaining Your Fire", duration: "18:36" },
        { title: "2.2 Basic Hammering Techniques", duration: "22:10" },
        { title: "2.3 Understanding Metal Movement", duration: "14:55" }
      ]
    },
    {
      title: "Module 3: Creating Your First Tool",
      lessons: [
        { title: "3.1 Designing Your Tool", duration: "16:24" },
        { title: "3.2 Forging Process Step by Step", duration: "25:18" },
        { title: "3.3 Heat Treatment and Finishing", duration: "20:42" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-neutral-900 rounded-lg overflow-hidden relative">
              <img 
                src={course.imageUrl}
                alt={course.title} 
                className="w-full object-cover h-96 lg:h-auto opacity-30" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="ghost" size="icon" className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                  <span className="sr-only">Play video</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-neutral-900">{course.title}</h2>
              <p className="mt-4 text-neutral-600">{course.description}</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">What You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Setting up a traditional forge",
                    "Metal selection and preparation",
                    "Traditional hammering techniques",
                    "Creating specialized hand tools",
                    "Heat treatment and tempering",
                    "Handle fitting and finishing"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Course Content</h3>
                
                <Accordion type="single" collapsible className="border border-neutral-200 rounded-md">
                  {modules.map((module, index) => (
                    <AccordionItem key={index} value={`module-${index + 1}`} className="border-b border-neutral-200 last:border-b-0">
                      <AccordionTrigger className="px-4 py-3 text-left">
                        <span className="font-medium text-neutral-900">{module.title}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <ul className="space-y-2">
                          {module.lessons.map((lesson, i) => (
                            <li key={i} className="flex items-center text-neutral-700">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 mr-3">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                              </svg>
                              <span>{lesson.title}</span>
                              <span className="ml-auto text-sm text-neutral-500">{lesson.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 sticky top-6">
              <div className="mb-6">
                <p className="text-3xl font-bold text-neutral-900">${Number(course.price)}</p>
                <p className="text-neutral-600">Lifetime access to all course materials</p>
              </div>
              
              <Button className="w-full mb-4" size="lg">
                Enroll Now
              </Button>
              
              <Button variant="outline" className="w-full mb-6" size="lg">
                Try Free Preview
              </Button>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="text-neutral-500 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Course Duration</h4>
                    <p className="text-neutral-600">8 weeks, self-paced</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Video className="text-neutral-500 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Content</h4>
                    <p className="text-neutral-600">{course.lessonCount} video lessons ({course.duration})</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="text-neutral-500 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Resources</h4>
                    <p className="text-neutral-600">15 downloadable files, plans & guides</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare className="text-neutral-500 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Access</h4>
                    <p className="text-neutral-600">Community forum & instructor support</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Meet Your Instructor</h3>
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-4">RJ</div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Robert Johnson</h4>
                    <p className="text-sm text-neutral-600 mb-2">Master Blacksmith with 45+ years of experience</p>
                    <div className="flex items-center">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4" />
                        <Star className="h-4 w-4" />
                        <Star className="h-4 w-4" />
                        <Star className="h-4 w-4" />
                        <StarHalf className="h-4 w-4" />
                      </div>
                      <span className="ml-2 text-sm text-neutral-600">4.8 (126 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
