import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Course } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Video, FileText, MessageSquare, Star, StarHalf, Play, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await apiRequest("GET", `/api/courses/${id}`);
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        setError("Failed to load course details");
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to enroll in this course",
        variant: "destructive",
      });
      return;
    }

    // Redirect to checkout
    window.location.href = "/checkout";
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!course) return <div className="text-center py-10">Course not found</div>;

  const modules = [
    {
      title: "Module 1: Introduction",
      lessons: [
        { title: "1.1 The History and Importance", duration: "10:15" },
        { title: "1.2 Setting Up Your Workspace", duration: "15:22" },
        { title: "1.3 Essential Tools and Materials", duration: "12:48" }
      ]
    },
    {
      title: "Module 2: Fundamentals",
      lessons: [
        { title: "2.1 Building and Maintaining Your Setup", duration: "18:36" },
        { title: "2.2 Basic Techniques", duration: "22:10" },
        { title: "2.3 Understanding Materials", duration: "14:55" }
      ]
    },
    {
      title: "Module 3: Creating Your First Project",
      lessons: [
        { title: "3.1 Designing Your Project", duration: "16:24" },
        { title: "3.2 Step by Step Process", duration: "25:18" },
        { title: "3.3 Finishing Touches", duration: "20:42" }
      ]
    }
  ];

  const learningPoints = [
    "Setting up your workspace properly",
    "Material selection and preparation",
    "Traditional techniques and methodologies",
    "Creating specialized tools and items",
    "Treatment and finishing processes",
    "Assembly and final adjustments"
  ];

  return (
    <div className="bg-neutral-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/explore" className="inline-flex items-center text-primary hover:text-primary-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to courses
          </Link>
          
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
                    <Play className="h-10 w-10 text-white" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <h1 className="text-2xl font-bold text-neutral-900">{course.title}</h1>
                <p className="mt-4 text-neutral-600">{course.description}</p>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {learningPoints.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
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
                                <Play className="h-5 w-5 text-neutral-400 mr-3" />
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
                
                <Button className="w-full mb-4" size="lg" onClick={handleEnroll}>
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
                    <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-4">
                      <span className="font-bold">{course.instructorId}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Instructor #{course.instructorId}</h4>
                      <p className="text-sm text-neutral-600 mb-2">Master Craftsperson with decades of experience</p>
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
      </div>
    </div>
  );
}
