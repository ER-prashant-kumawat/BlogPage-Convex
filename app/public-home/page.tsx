"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import LandingNavbar from "../landing-navbar";
import { useEffect, useState } from "react";

const DEMO_POSTS = [
  {
    _id: "demo-1",
    title: "Make Your Website",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Learn how to create stunning websites.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=300&fit=crop",
    createdAt: Date.now() - 86400000,
  },
  {
    _id: "demo-2",
    title: "Web Development Best Practices",
    body: "Discover best practices for modern web development and design patterns.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    createdAt: Date.now() - 172800000,
  },
  {
    _id: "demo-3",
    title: "Getting Started with React",
    body: "A comprehensive guide to getting started with React and modern JavaScript.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    createdAt: Date.now() - 259200000,
  },
];

export default function PublicHome() {
  const posts = useQuery(api.posts.listPosts);
  const [displayPosts, setDisplayPosts] = useState(DEMO_POSTS);

  // Use real posts if available, otherwise use demo
  useEffect(() => {
    if (posts !== undefined && posts.length > 0) {
      setDisplayPosts(posts);
    }
  }, [posts]);

  return (
    <>
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-500/30">
            ✨ Welcome to MyBlog
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Discover Amazing{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Stories
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore insightful articles and stories from passionate writers.
            Share your knowledge and inspire others with your words.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blogs">
              <button className="px-8 py-4 font-bold text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5">
                Explore Blogs →
              </button>
            </Link>
            <Link href="/new-post">
              <button className="px-8 py-4 font-bold text-lg border-2 border-gray-600 text-white rounded-xl hover:bg-white hover:text-gray-900 hover:border-white transition-all hover:-translate-y-0.5">
                Start Writing ✍️
              </button>
            </Link>
          </div>

          <div className="mt-16 flex justify-center gap-12 text-center">
            <div>
              <p className="text-3xl font-bold text-white">{displayPosts?.length || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">100+</p>
              <p className="text-sm text-gray-500 mt-1">Readers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">Free</p>
              <p className="text-sm text-gray-500 mt-1">Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
              Latest Content
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 text-gray-900">
              Featured Articles
            </h2>
            <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
              Stay updated with inspiring stories and professional insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!displayPosts || displayPosts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-500 text-lg">
                  No blogs yet. Be the first to share your story!
                </p>
                <Link href="/new-post">
                  <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Write First Blog
                  </button>
                </Link>
              </div>
            ) : (
              displayPosts.slice(0, 3).map((post: any) => (
                <div
                  key={post._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  {post.imageUrl && (
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <p className="text-xs text-gray-400 font-medium mb-2">
                      📅{" "}
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.body}
                    </p>

                    <Link href={`/blog/${post._id}`}>
                      <span className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors group/link">
                        Read More
                        <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
                      </span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {displayPosts && displayPosts.length > 3 && (
            <div className="mt-16 text-center">
              <Link href="/blogs">
                <button className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
                  View All Articles →
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">📝</span>
            <span className="text-xl font-bold text-white">MyBlog</span>
          </div>
          <p className="mb-4">Share your stories with the world</p>
          <p className="text-sm text-gray-600">
            © 2026 MyBlog. Built with Next.js & Convex.
          </p>
        </div>
      </footer>
    </>
  );
}
