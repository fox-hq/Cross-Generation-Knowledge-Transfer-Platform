import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-primary-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-600 opacity-90"></div>
      <div 
        className="absolute inset-0 opacity-30" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Preserve Wisdom, Share Skills, Build Legacy
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8">
            Connect generations through knowledge transfer. Learn from masters, preserve crafts, and pass skills to the future.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-primary-700 hover:bg-primary-50"
            >
              <Link href="/explore">Explore Courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-primary-600"
            >
              <Link href="/mentorship">Become a Mentor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
