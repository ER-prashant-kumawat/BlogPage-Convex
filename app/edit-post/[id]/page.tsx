"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import LandingNavbar from "@/app/landing-navbar";

interface User {
  name: string;
  tokenIdentifier: string;
}

export default function EditPostPage() {
  const params = useParams();
  const postId = params?.id as string | undefined;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const posts = useQuery(api.posts.listPosts);
  const updatePost = useMutation(api.posts.updatePost);

  // Auth
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // Load post into form (show immediately with current state)
  useEffect(() => {
    if (!posts || !postId) return;

    const post = posts.find((p: any) => p._id === postId);
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setImageUrl(post.imageUrl || "");
    }
  }, [posts, postId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      console.log("✏️ Updating blog...");
      
      // Update database
      await updatePost({
        postId: postId as any,
        title,
        body,
        imageUrl: imageUrl || undefined,
        authorId: user.tokenIdentifier,
      });
      
      console.log("✅ Blog updated successfully!");
      alert("✅ Blog updated! Redirecting...");
      
      // Wait and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("❌ Error updating post:", error);
      setLoading(false);
      alert("❌ Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  if (!user) return null;

  return (
    <>
      <LandingNavbar />

      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ✏️ Edit Blog Post
            </h1>
            <p className="text-gray-400 text-lg">
              Update your blog post
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 sm:p-10 shadow-2xl border border-gray-800">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-bold mb-3 text-white">
                📝 Post Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="w-full border-2 border-gray-700 hover:border-blue-500/50 focus:border-blue-500 rounded-xl p-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="body" className="block text-lg font-bold mb-3 text-white">
                📄 Content
              </label>
              <textarea
                id="body"
                rows={12}
                placeholder="Write your blog post here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={loading}
                className="w-full border-2 border-gray-700 hover:border-blue-500/50 focus:border-blue-500 rounded-xl p-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-base"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-lg font-bold mb-3 text-white">
                🖼️ Featured Image URL (Optional)
              </label>
              <input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={loading}
                className="w-full border-2 border-gray-700 hover:border-blue-500/50 focus:border-blue-500 rounded-xl p-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />

              {imageUrl && (
                <div className="mt-4 relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 rounded-xl font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "⏳ Saving..." : "💾 Save Changes"}
              </button>

              <Link href="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full px-6 py-4 rounded-xl font-bold text-lg text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
                >
                  ← Cancel
                </button>
              </Link>
            </div>
            </form>
            </div>
            </div>
            </main>
    </>
  );
}
