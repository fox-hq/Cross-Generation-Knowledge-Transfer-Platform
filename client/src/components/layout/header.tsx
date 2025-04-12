import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added import for DropdownMenu components

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Community", href: "/community" },
    { label: "Marketplace", href: "/marketplace" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          CraftBridge
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            item.label === "Explore" ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className="text-sm hover:text-gray-600 transition">
                  {item.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/videos">Videos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/knowledge-ai">Knowledge AI</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/retired-professionals">Retired Professional Docs</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:text-gray-600 transition"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Sign In Button */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                onClick={() => {
                  logoutMutation.mutate();
                }}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white shadow">
          {navItems.map((item) => (
            item.label === "Explore" ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className="text-sm hover:text-gray-600 transition">
                  {item.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/videos">Videos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/knowledge-ai">Knowledge AI</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/retired-professionals">Retired Professional Docs</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-black hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          ))}
          {user ? (
            <Button
              variant="ghost"
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
              className="border border-black text-black text-sm px-4 py-1 rounded-md hover:bg-black hover:text-white transition"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}