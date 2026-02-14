"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LandingNavbar from "../landing-navbar";

interface User {
  name: string;
  tokenIdentifier: string;
  profileImage?: string;
}

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const createPost = useMutation(api.posts.createPost);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_upload"); // Use unsigned upload
      
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        setImageUrl(data.secure_url);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed. Use URL instead.");
      }
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewImage(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      console.log("📝 Publishing blog...", {
        title,
        authorId: user.tokenIdentifier,
        authorName: user.name,
      });
      
      // Save to database
      const postId = await createPost({
        title,
        body,
        authorId: user.tokenIdentifier,
        authorName: user.name,
        imageUrl: imageUrl || undefined,
      });
      
      console.log("✅ Blog published successfully!", postId);
      alert("✅ Blog published! Redirecting to dashboard...");
      
      // Wait for database sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force navigate to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("❌ Error creating post:", error);
      setLoading(false);
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert("❌ Error: " + errorMsg);
    }
  };

  return (
    <>
      <LandingNavbar />

      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ✍️ Create New Blog
            </h1>
            <p className="text-gray-400 text-lg">
              Share your thoughts and stories with the world
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 sm:p-10 shadow-2xl border border-gray-800">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-lg font-bold mb-3 text-white"
                >
                  📝 Post Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter an engaging title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  className="w-full border-2 border-gray-700 hover:border-blue-500/50 focus:border-blue-500 rounded-xl p-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-lg font-bold mb-4 text-white">
                  🖼️ Featured Image (Optional)
                </label>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setImageUploadMode("url");
                      setImageUrl("");
                      setPreviewImage(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                      imageUploadMode === "url"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    🔗 URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUploadMode("upload");
                      setImageUrl("");
                      setPreviewImage(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                      imageUploadMode === "upload"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    ⬆️ Upload
                  </button>
                </div>

                {imageUploadMode === "url" && (
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    disabled={loading}
                    className="w-full border-2 border-gray-700 hover:border-blue-500/50 focus:border-blue-500 rounded-xl p-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                )}

                {imageUploadMode === "upload" && (
                  <div
                    className="border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl p-8 bg-gray-800/30 cursor-pointer transition-all group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="text-4xl group-hover:scale-110 transition-transform">
                        📤
                      </span>
                      <div>
                        <p className="text-white font-semibold">Click to upload</p>
                        <p className="text-gray-500 text-sm mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                )}

                {previewImage && (
                  <div className="mt-4 relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl"
                      onError={() => setPreviewImage(null)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setPreviewImage(null);
                      }}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="body"
                  className="block text-lg font-bold mb-3 text-white"
                >
                  📄 Content
                </label>
                <textarea
                  id="body"
                  rows={12}
                  placeholder="Write your amazing blog post here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={loading}
                  className="w-full border-2 border-gray-700 hover:border-blue-500/50 focus:border-blue-500 rounded-xl p-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-base"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "⏳ Publishing..." : "🚀 Publish Post"}
                </button>

                <Link href="/public-home" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-4 rounded-xl font-bold text-lg text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
                  >
                    ← Cancel
                  </button>
                </Link>
              </div>

              {/* Tip */}
              <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
                <p className="text-blue-400 text-sm flex items-start gap-2">
                  <span>💡</span>
                  <span>
                    Pro tip: Add a featured image to make your blog post more engaging!
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
