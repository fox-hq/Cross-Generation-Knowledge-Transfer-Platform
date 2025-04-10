import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-pink-600/20 to-indigo-800/20 opacity-70"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
              <span>Connecting Generations Through Knowledge</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-100">
              Preserve Wisdom, Share Skills, Build Legacy
            </h1>
            
            <p className="text-lg md:text-xl text-blue-50/90 mb-8 leading-relaxed">
              Connect with masters who've perfected their craft over decades. Learn authentic skills, preserve cultural techniques, and become part of a living tradition.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                asChild
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50 hover:scale-105 transition-all shadow-lg shadow-primary-900/20 group"
              >
                <Link href="/explore">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/70 text-white hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                <Link href="/mentorship">Become a Mentor</Link>
              </Button>
            </div>
          </div>
          
          {/* High-quality image of a young woman learning from a mentor */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-sm opacity-70"></div>
            <div className="relative bg-black/30 backdrop-blur-sm p-2 rounded-2xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Young woman learning traditional craft from experienced mentor" 
                className="w-full h-auto rounded-xl shadow-lg object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/30 backdrop-blur-md rounded-lg">
                <p className="text-white text-sm font-medium">
                  "The mentorship program helped me preserve my family's traditional techniques that might have otherwise been lost." — Sarah, Apprentice
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}
