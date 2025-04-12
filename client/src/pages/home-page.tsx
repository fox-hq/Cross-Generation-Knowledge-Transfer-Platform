
import Spline from '@splinetool/react-spline';
import { Link } from 'wouter';
import { HomeHeader } from '@/components/layout/home-header';
import { useMediaQuery } from '@/hooks/use-mobile';

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <main className="relative w-full min-h-screen bg-background overflow-hidden">
      <HomeHeader />
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-6 lg:px-8 z-20">
        <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]">
            Blocks That Shape
            <br /> 
            Generations
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-6 py-3 text-base sm:text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Start Now
            </Link>
          </div>
        </div>
      </div>

      {/* Spline Scene Container */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="relative w-full h-full"
          style={{
            transform: isMobile ? 'scale(0.8) translateY(-10%)' : 
                     isTablet ? 'scale(0.9) translateY(-5%)' : 
                     'scale(1)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <Spline
            scene="https://prod.spline.design/T9C7UWD4DSVibkvU/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
    </main>
  );
}
