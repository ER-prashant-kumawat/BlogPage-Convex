"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import LandingNavbar from "../landing-navbar";

export default function DebugPage() {
  const [user, setUser] = useState<any>(null);
  const posts = useQuery(api.posts.listPosts);
  const createPost = useMutation(api.posts.createPost);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleTestPost = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const testTitle = `Test Blog ${new Date().toLocaleTimeString()}`;
      console.log("Creating test post...", testTitle);

      const postId = await createPost({
        title: testTitle,
        body: "This is a test blog to verify Convex is working correctly.",
        authorId: user.tokenIdentifier,
        authorName: user.name,
        imageUrl: undefined,
      });

      console.log("✅ Post created:", postId);
      alert("✅ Post created! Post ID: " + postId + "\n\nCheck console logs for details.");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Error: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">🔧 Convex Debug Panel</h1>

          {/* User Info */}
          <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-blue-600">
            <h2 className="text-xl font-bold mb-4">👤 User Info</h2>
            {user ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.tokenIdentifier}</p>
              </div>
            ) : (
              <p className="text-red-600">❌ Not logged in</p>
            )}
          </div>

          {/* Convex Status */}
          <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-green-600">
            <h2 className="text-xl font-bold mb-4">📊 Convex Database Status</h2>
            <div className="space-y-2">
              <p><strong>Total Posts:</strong> {posts?.length || 0}</p>
              <p><strong>Posts Loaded:</strong> {posts === undefined ? "Loading..." : "✅"}</p>
              {posts && posts.length > 0 && (
                <div className="mt-4 bg-gray-50 p-4 rounded">
                  <p className="font-bold mb-2">Recent Posts:</p>
                  <ul className="space-y-2">
                    {posts.slice(0, 5).map((post: any) => (
                      <li key={post._id} className="text-sm border-l-2 border-blue-300 pl-2">
                        <strong>{post.title}</strong> by {post.authorName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Test Post */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
            <h2 className="text-xl font-bold mb-4">🧪 Test Create Post</h2>
            <button
              onClick={handleTestPost}
              disabled={!user || posts === undefined}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold disabled:opacity-50"
            >
              Create Test Post
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Click above to create a test post and verify Convex is working.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-bold mb-4">📋 Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open DevTools (F12) → Console tab</li>
              <li>Click "Create Test Post" button above</li>
              <li>Check console for "✅ Post created" message</li>
              <li>Refresh page - test post should appear above</li>
              <li>Go to Dashboard - test post should appear there too</li>
            </ol>
          </div>

          {/* Raw Data */}
          <div className="bg-gray-100 rounded-lg p-6 mt-6 overflow-auto">
            <h2 className="text-lg font-bold mb-4">📝 Raw Database Data</h2>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(
                {
                  user,
                  postsCount: posts?.length,
                  posts: posts?.slice(0, 3),
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
