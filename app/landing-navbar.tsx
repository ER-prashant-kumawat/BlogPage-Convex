"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  tokenIdentifier: string;
  profileImage?: string;
}

export default function LandingNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/public-home");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 text-white shadow-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/public-home" className="flex items-center gap-2 group">
            <span className="text-2xl">📝</span>
            <span className="text-xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">
              MyBlog
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/public-home"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Blogs
            </Link>
            <Link
              href="/new-post"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Create Blog
            </Link>
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user.name[0]?.toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    {user.name}
                  </span>
                </div>
                <Link href="/dashboard">
                  <button className="px-4 py-1.5 text-sm bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-600/25">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 mt-2">
            <div className="flex flex-col gap-1 pt-3">
              <Link
                href="/public-home"
                className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                href="/blogs"
                className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                📚 Blogs
              </Link>
              <Link
                href="/new-post"
                className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                ✍️ Create Blog
              </Link>

              <div className="border-t border-gray-800 my-2"></div>

              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                      {user.name[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="px-4 py-2.5 text-left text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="mx-4"
                  onClick={() => setMobileOpen(false)}
                >
                  <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
