
import Spline from '@splinetool/react-spline';
import { Link } from 'wouter';
import { HomeHeader } from '@/components/layout/home-header';

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden relative">
      <HomeHeader />

      {/* Spline Scene with responsive container */}
      <div className="w-full h-full absolute top-0 left-0">
        <Spline 
          scene="https://prod.spline.design/T9C7UWD4DSVibkvU/scene.splinecode"
          className="w-full h-full"
          style={{ 
            transform: 'scale(1)',
            transformOrigin: 'center center'
          }}
        />
      </div>

      {/* Responsive Start Now button */}
      <div className="absolute z-50 w-full flex justify-center items-center bottom-[10%] sm:bottom-[15%] md:bottom-[20%] lg:bottom-[25%] px-4">
        <Link
          href="/explore"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Start Now
        </Link>
      </div>
    </main>
  );
}
