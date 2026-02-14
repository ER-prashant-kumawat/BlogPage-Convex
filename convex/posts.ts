import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .collect();

    return posts.map((post) => ({
      _id: post._id,
      title: post.title,
      body: post.body,
      authorId: post.authorId,
      authorName: post.authorName,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
    }));
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.authorId) {
      throw new Error("Must be logged in to create a post");
    }

    const postId = await ctx.db.insert("posts", {
      title: args.title,
      body: args.body,
      authorId: args.authorId,
      authorName: args.authorName,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    return postId;
  },
});

export const addDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const demoUser = "demo@example.com";
    
    // Check if demo user exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), demoUser))
      .first();

    if (!existing) {
      await ctx.db.insert("users", {
        tokenIdentifier: demoUser,
        name: "Demo User",
        profileImage: undefined,
      });
    }

    // Delete all existing posts to refresh demo data
    const allPosts = await ctx.db.query("posts").collect();
    for (const post of allPosts) {
      await ctx.db.delete(post._id);
    }

    // Add fresh demo posts with images
    const demoPosts = [
      {
        title: "Make Your Website",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum standard dummy text.",
        authorId: demoUser,
        authorName: "Manager",
        imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=300&fit=crop",
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Make Your Website",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum standard dummy text.",
        authorId: demoUser,
        authorName: "Manager",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
        createdAt: Date.now() - 172800000,
      },
      {
        title: "Make Your Website",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum standard dummy text.",
        authorId: demoUser,
        authorName: "Manager",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
        createdAt: Date.now() - 259200000,
      },
    ];

    // Add fresh demo posts
    for (const post of demoPosts) {
      await ctx.db.insert("posts", post);
    }

    return { success: true };
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    
    if (!post || post.authorId !== args.authorId) {
      throw new Error("Unauthorized to delete this post");
    }

    await ctx.db.delete(args.postId);
    return { success: true };
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
    body: v.string(),
    imageUrl: v.optional(v.string()),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    
    if (!post || post.authorId !== args.authorId) {
      throw new Error("Unauthorized to edit this post");
    }

    await ctx.db.patch(args.postId, {
      title: args.title,
      body: args.body,
      imageUrl: args.imageUrl,
    });

    return { success: true };
  },
});

export const storeUser = mutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), args.tokenIdentifier))
      .first();

    if (existing) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      profileImage: args.profileImage,
    });

    return userId;
  },
});
