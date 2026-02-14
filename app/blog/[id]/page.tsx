"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import LandingNavbar from "@/app/landing-navbar";
import Link from "next/link";
import { useState, useEffect } from "react";

// Demo posts
const DEMO_POSTS = [
  {
    _id: "demo-1",
    title: "Make Your Website",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum standard dummy text. Learn how to create stunning websites with modern technologies and best practices. This comprehensive guide will walk you through everything you need to know about web development.\n\nWeb development has evolved significantly over the past decade. Today's developers need to understand not just HTML and CSS, but also JavaScript frameworks, backend technologies, and DevOps principles.\n\nWhether you're a beginner or an experienced developer, this guide will help you understand the fundamentals and advanced concepts of modern web development.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=300&fit=crop",
    createdAt: Date.now() - 86400000,
  },
  {
    _id: "demo-2",
    title: "Web Development Best Practices",
    body: "Discover best practices for modern web development and design patterns. Writing clean, maintainable code is essential for building scalable applications.\n\nSome key principles include:\n- DRY (Don't Repeat Yourself)\n- SOLID principles\n- Proper error handling\n- Performance optimization\n- Security best practices\n\nFollowing these practices will help you write better code and build more robust applications.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    createdAt: Date.now() - 172800000,
  },
  {
    _id: "demo-3",
    title: "Getting Started with React",
    body: "A comprehensive guide to getting started with React and modern JavaScript. React has become one of the most popular JavaScript libraries for building user interfaces.\n\nKey React concepts:\n- Components\n- JSX\n- Props and State\n- Hooks\n- Context API\n- Performance optimization\n\nThis guide covers all the essentials to get you started with React development.",
    authorId: "demo@example.com",
    authorName: "Manager",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    createdAt: Date.now() - 259200000,
  },
];

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);

  // Safe param access
  const blogId = params?.id as string | undefined;

  // Fetch posts from Convex (in background)
  const posts = useQuery(api.posts.listPosts);

  useEffect(() => {
    if (!blogId) return;

    // First, try to find in Convex posts
    if (posts && posts.length > 0) {
      const foundPost = posts.find((p: any) => p._id === blogId);
      if (foundPost) {
        setPost(foundPost);
        return;
      }
    }

    // Fall back to demo posts
    const demoPost = DEMO_POSTS.find((p) => p._id === blogId);
    if (demoPost) {
      setPost(demoPost);
    }
  }, [blogId, posts]);

  // If no id in URL
  if (!blogId) {
    return (
      <>
        <LandingNavbar />
        <div className="max-w-4xl mx-auto py-12 px-8 text-center">
          <p className="text-slate-500">Invalid blog URL</p>
        </div>
      </>
    );
  }

  // Post not found
  if (post === null && posts !== undefined && posts.length > 0) {
    return (
      <>
        <LandingNavbar />
        <div className="max-w-4xl mx-auto py-12 px-8 text-center">
          <p className="text-slate-500">Blog post not found</p>
          <Link href="/blogs">
            <button className="mt-4 text-blue-600 font-semibold hover:underline">
              ← Back to Blogs
            </button>
          </Link>
        </div>
      </>
    );
  }

  // Loading or post exists
  if (!post) {
    return (
      <>
        <LandingNavbar />
        <div className="max-w-4xl mx-auto py-12 px-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LandingNavbar />

      <article className="max-w-4xl mx-auto py-12 px-8">
        {/* Featured Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center justify-between text-slate-500 gap-4">
            <div>
              <p className="text-lg">
                By <strong>{post.authorName || "Anonymous"}</strong>
              </p>
              <p>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm">
                {Math.max(
                  1,
                  Math.ceil(post.body.split(" ").length / 200)
                )}{" "}
                min read
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-12">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {post.body}
          </p>
        </div>

        {/* Back Button */}
        <div className="border-t pt-8">
          <Link href="/blogs">
            <button className="text-blue-600 font-semibold hover:underline">
              ← Back to All Blogs
            </button>
          </Link>
        </div>
      </article>
    </>
  );
}
