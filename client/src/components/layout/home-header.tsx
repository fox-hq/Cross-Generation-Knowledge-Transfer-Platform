import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Community", href: "/community" },
    { label: "Marketplace", href: "/marketplace" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-white px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold">
          CraftBridge
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            item.label === "Explore" ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className="text-sm hover:underline transition text-white">
                  {item.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/explore?type=videos">Videos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/explore?type=ai">Knowledge AI</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/explore?type=docs">Retired Professional Docs</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:underline transition"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Sign In */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
                onClick={() => {
                  logoutMutation.mutate();
                }}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-block border border-white text-white px-4 py-1 rounded-md hover:bg-white hover:text-black transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-3 p-4 rounded-lg bg-black/80 backdrop-blur-sm text-white">
          {navItems.map((item) => (
            item.label === "Explore" ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className="text-sm hover:underline transition text-white">
                  {item.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/explore?type=videos">Videos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/explore?type=ai">Knowledge AI</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/explore?type=docs">Retired Professional Docs</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          ))}
          {user ? (
            <Button 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
              onClick={() => {
                logoutMutation.mutate();
                setIsOpen(false);
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Link
              href="/auth"
              className="border border-white text-white text-sm px-4 py-1 rounded-md hover:bg-white hover:text-black transition"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
      {/* Perfectly positioned Start Now button with dropdown */}
      <div className="absolute z-50 left-[70%] bottom-[25%] transform -translate-x-1/2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              Start Now
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border border-neutral-200 shadow-lg rounded-lg p-1">
            <DropdownMenuItem asChild>
              <Link href="/explore/videos" className="cursor-pointer">
                Videos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/explore/knowledge-ai" className="cursor-pointer">
                Knowledge AI
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/explore/docs" className="cursor-pointer">
                Retired Professional Docs
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}