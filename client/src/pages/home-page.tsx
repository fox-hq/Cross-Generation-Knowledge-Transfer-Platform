import Spline from '@splinetool/react-spline';
import { Link } from 'wouter';
import { HomeHeader } from '@/components/layout/home-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden relative">
      <HomeHeader />

      {/* Spline Scene */}
      <Spline scene="https://prod.spline.design/T9C7UWD4DSVibkvU/scene.splinecode" />

      {/* Perfectly positioned Start Now button with dropdown */}
      <div className="absolute z-50 left-[70%] bottom-[25%] transform -translate-x-1/2">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            Start Now
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-neutral-900/95 backdrop-blur-sm border border-neutral-800 shadow-lg rounded-lg p-1">
            <Link to="/videos" className="block">
              <DropdownMenuItem className="cursor-pointer text-white hover:text-gray-300 transition">
                Videos
              </DropdownMenuItem>
            </Link>
            <Link to="/knowledge-ai" className="block">
              <DropdownMenuItem className="cursor-pointer text-white hover:text-gray-300 transition">
                Knowledge AI
              </DropdownMenuItem>
            </Link>
            <Link to="/retired-professionals" className="block">
              <DropdownMenuItem className="cursor-pointer text-white hover:text-gray-300 transition">
                Retired Professional Docs
              </DropdownMenuItem>
            </Link>
            <Link to="/3d-learning" className="block">
              <DropdownMenuItem className="cursor-pointer text-white hover:text-gray-300 transition">
                3D Learning
              </DropdownMenuItem>
            </Link>
            <Link to="/ai-mentor" className="block">
              <DropdownMenuItem className="cursor-pointer text-white hover:text-gray-300 transition">
                Realtime AI Mentor
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </main>
  );
}
