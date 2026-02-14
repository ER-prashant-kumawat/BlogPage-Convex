"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import LandingNavbar from "../landing-navbar";
import { useEffect, useState } from "react";

const DEMO_POSTS = [
  {
    _id: "demo-1",
    title: "Make Your Website",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum standard dummy text. Learn how to create stunning websites with modern technologies.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=300&fit=crop",
    createdAt: Date.now() - 86400000,
  },
  {
    _id: "demo-2",
    title: "Web Development Best Practices",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum standard dummy text. Discover best practices for modern web development.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    createdAt: Date.now() - 172800000,
  },
  {
    _id: "demo-3",
    title: "Getting Started with React",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum standard dummy text. A comprehensive guide to getting started with React.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    createdAt: Date.now() - 259200000,
  },
];

export default function BlogsPage() {
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

      <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              All <span className="text-blue-600">Blogs</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Browse through all our published articles and find something that inspires you.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <span className="text-6xl block mb-4">📭</span>
                <p className="text-gray-500 text-lg mb-6">No blogs published yet.</p>
                <Link href="/new-post">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Write the First Blog ✍️
                  </button>
                </Link>
              </div>
            ) : (
              displayPosts.map((post: any) => (
                <div
                  key={post._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <p className="text-xs text-gray-400 mb-3 font-medium">
                      📅{" "}
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {post.authorName && (
                        <span className="text-gray-500"> • {post.authorName}</span>
                      )}
                    </p>

                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-5 line-clamp-3">
                      {post.body}
                    </p>

                    <Link href={`/blog/${post._id}`}>
                      <span className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                        Read More →
                      </span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8 px-4 text-center text-gray-500">
        <p>© 2026 MyBlog. All rights reserved.</p>
      </footer>
    </>
  );
}
