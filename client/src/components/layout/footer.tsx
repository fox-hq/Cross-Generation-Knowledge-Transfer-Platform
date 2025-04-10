import { Link } from "wouter";
import { FolderSync } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-white mb-4">
              <FolderSync className="text-primary h-6 w-6" />
              <span className="text-xl font-bold">CraftBridge</span>
            </Link>
            <p className="mb-4">Preserving traditional crafts and knowledge for future generations through education, mentorship, and community.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">How It Works</Link></li>
              <li><Link href="/explore" className="hover:text-white">Browse Courses</Link></li>
              <li><Link href="/mentorship" className="hover:text-white">Find a Mentor</Link></li>
              <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
              <li><Link href="/community" className="hover:text-white">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white">Become a Mentor</Link></li>
              <li><Link href="#" className="hover:text-white">Sell Your Crafts</Link></li>
              <li><Link href="#" className="hover:text-white">Affiliate Program</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Accessibility</Link></li>
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-sm">
          <p>© {new Date().getFullYear()} CraftBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
