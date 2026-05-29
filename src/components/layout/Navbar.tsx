"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, History, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="AI Car Advisor Home">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">AI Car Advisor</span>
              <span className="hidden sm:block text-xs text-gray-400 leading-none">
                Find your perfect car
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
