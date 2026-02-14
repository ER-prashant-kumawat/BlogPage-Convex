import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    profileImage: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.string(),
    authorName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
