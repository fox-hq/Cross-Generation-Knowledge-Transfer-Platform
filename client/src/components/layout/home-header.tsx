import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";

export function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Forum", href: "/community" },
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
            <Link
              key={item.href}
              href={item.href}
              className="text-sm hover:underline transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign In */}
        <Link
          href="/auth"
          className="hidden md:inline-block border border-white text-white px-4 py-1 rounded-md text-sm hover:bg-white hover:text-black transition"
        >
          Sign In
        </Link>

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
        <div className="md:hidden mt-2 flex flex-col gap-3 p-4 rounded-lg bg-transparent text-white">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/auth"
            className="border border-white text-white text-sm px-4 py-1 rounded-md hover:bg-white hover:text-black transition"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
