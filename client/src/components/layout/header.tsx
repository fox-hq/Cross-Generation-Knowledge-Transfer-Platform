import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  FolderSync,
  ChevronDown,
  UserIcon,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "Learn", href: "/explore" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Community", href: "/community" },
    { label: "Marketplace", href: "/marketplace" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="backdrop-blur-md bg-black/30 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-purple-600 to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-black rounded-full p-1.5">
                  <FolderSync className="text-white h-6 w-6" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                <span className="text-gradient-primary">Craft</span>Bridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? "text-purple-400 font-medium"
                    : "text-white/80 hover:text-white font-medium"
                } relative group py-1`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform ${isActive(item.href) ? 'scale-x-100' : ''}`}></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 focus:outline-none text-white hover:bg-white/10 rounded-full pr-3">
                    <Avatar className="h-8 w-8 border border-purple-500/30 ring-2 ring-purple-500/20">
                      <AvatarImage src="" alt={user.username} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-white">
                      {user.username}
                    </span>
                    <ChevronDown className="h-4 w-4 text-white/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-lg border border-white/10 shadow-xl shadow-purple-500/10">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center text-white hover:bg-white/10 focus:bg-white/10">
                      <UserIcon className="mr-2 h-4 w-4 text-purple-400" />
                      <span>Your Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center text-white hover:bg-white/10 focus:bg-white/10">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-purple-400" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex items-center text-white hover:bg-white/10 focus:bg-white/10">
                      <Settings className="mr-2 h-4 w-4 text-purple-400" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-950/20 focus:bg-red-950/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild 
                variant="default"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all duration-300"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-1 border-t border-white/10 animate-in slide-in-from-top-5 duration-300">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-3 px-4 text-base font-medium ${
                  isActive(item.href)
                    ? "text-purple-400 bg-white/5"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                } rounded-lg transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <div className="mt-4 pt-4 pb-3 border-t border-white/10">
                <div className="flex items-center px-4 mb-3">
                  <Avatar className="h-10 w-10 border border-purple-500/30 ring-2 ring-purple-500/20">
                    <AvatarImage src="" alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.fullName || user.username}</div>
                    <div className="text-sm font-medium text-white/60">{user.email}</div>
                  </div>
                </div>
                <div className="space-y-1 px-2">
                  <Link 
                    href="/profile"
                    className="flex items-center py-2 px-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserIcon className="mr-3 h-5 w-5 text-purple-400" />
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard"
                    className="flex items-center py-2 px-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-purple-400" />
                    Dashboard
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
