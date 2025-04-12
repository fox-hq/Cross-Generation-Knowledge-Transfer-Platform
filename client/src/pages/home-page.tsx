
import Spline from '@splinetool/react-spline';
import { Link } from 'wouter';
import { HomeHeader } from '@/components/layout/home-header';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <main className="w-full h-screen overflow-hidden relative bg-background">
      <HomeHeader />

      {/* Responsive Spline Scene Container */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          <Spline
            scene="https://prod.spline.design/T9C7UWD4DSVibkvU/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: isMobile ? 'translate(-50%, -50%) scale(0.8)' : 'translate(-50%, -50%) scale(1)',
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        </div>
      </div>

      {/* Responsive Start Now button */}
      <div className="absolute z-50 w-full flex justify-center lg:justify-end items-center px-4 sm:px-6 lg:px-8">
        <div className="fixed bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-24 lg:right-24">
          <Link
            href="/explore"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 
            text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-full shadow-lg hover:shadow-xl 
            transition-all duration-300 transform hover:scale-105"
          >
            Start Now
          </Link>
        </div>
      </div>
    </main>
  );
}
