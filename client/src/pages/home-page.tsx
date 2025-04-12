import Spline from '@splinetool/react-spline';
import { Link } from 'wouter';
import { HomeHeader } from '@/components/layout/home-header'; // 👈 make sure this path is correct

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden relative">
      <HomeHeader />

      {/* Spline Scene */}
      <Spline scene="https://prod.spline.design/T9C7UWD4DSVibkvU/scene.splinecode" />

      {/* Perfectly positioned Start Now button */}
      <div className="absolute z-50 left-[70%] bottom-[25%] transform -translate-x-1/2">
        <Link
          href="/explore"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          Start Now
        </Link>
      </div>
    </main>
  );
}
