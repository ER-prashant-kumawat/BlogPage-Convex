"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import LandingNavbar from "../landing-navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  tokenIdentifier: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Fetch posts from Convex
  const posts = useQuery(api.posts.listPosts);
  const deletePost = useMutation(api.posts.deletePost);

  useEffect(() => {
    // Check if user data in URL params (from Google OAuth)
    const searchParams = new URLSearchParams(window.location.search);
    const userParam = searchParams.get("user");
    
    if (userParam) {
      const userData = JSON.parse(userParam);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Check localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleDelete = async (postId: string) => {
    if (!user) return;
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost({
        postId: postId as any,
        authorId: user.tokenIdentifier,
      });
    } catch (error) {
      alert(
        "Error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  // Removed infinite reload loop

  // Log for debugging (BEFORE any conditional returns)
  useEffect(() => {
    if (!user) return;
    
    console.log("Dashboard loaded:", {
      user: user.tokenIdentifier,
      totalPosts: posts?.length || 0,
    });
  }, [posts, user]);

  // Check if user is logged in
  if (!user) return null;

  // Show dashboard immediately with empty posts while loading
  const userPosts = posts?.filter(
    (post: any) => post.authorId === user.tokenIdentifier
  ) || [];

  return (
    <>
      <LandingNavbar />

      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {user.name[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 text-sm">{user.tokenIdentifier}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <div className="bg-gray-50 px-5 py-3 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
              </div>

              <Link href="/new-post">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/25">
                  ✏️ Write New Blog
                </button>
              </Link>
            </div>
          </div>

          {/* Blog List */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Blogs</h2>

          {userPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <span className="text-5xl block mb-4">✍️</span>
              <p className="text-gray-500 text-lg">
                No blogs yet. Create your first blog!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {userPosts.map((post: any) => (
                <div
                  key={post._id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.body}
                  </p>

                  <p className="text-sm text-gray-400 mb-4">
                    📅 {new Date(post.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-4">
                    <Link href={`/edit-post/${post._id}`}>
                      <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                        ✏️ Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 text-sm font-semibold hover:text-red-600 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
