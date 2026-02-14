# Real-Time Blog Implementation Guide

## 📋 Project Overview

This is a **minimal, real-time blog** built with:
- **Backend**: Convex (serverless database & functions)
- **Frontend**: Next.js 15 + React 19
- **Authentication**: Clerk

Real-time updates: When a user creates a post, all other users see it instantly via Convex's `useQuery` hook.

---

## 🏗️ Architecture & Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│  ┌──────────────────┐         ┌──────────────────┐           │
│  │  Home Page (/)   │  ────→  │  New Post (/new) │           │
│  │  Shows all posts │  ←────  │  Create form     │           │
│  └──────────────────┘         └──────────────────┘           │
│         ▲                             │                       │
│         │ useQuery(listPosts)        │ useMutation(createPost)
│         │ [REAL-TIME]               │                        │
│         │                           ▼                        │
└─────────┼───────────────────────────────────────────────────┘
          │                           │
          │                           │
┌─────────┴───────────────────────────┴──────────────────────┐
│                    CONVEX BACKEND                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              convex/posts.ts                         │   │
│  │  ├─ listPosts() → Query all posts (sorted DESC)     │   │
│  │  ├─ createPost() → Mutation (auth required)         │   │
│  │  └─ storeUser() → Sync Clerk user data             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           convex/schema.ts                           │   │
│  │  ├─ users: {tokenIdentifier, name, profileImage}   │   │
│  │  └─ posts: {title, body, authorId, createdAt}      │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
                 ┌──────────────────┐
                 │  CONVEX DATABASE │
                 │  (Cloud Storage) │
                 └──────────────────┘
```

---

## 📁 Project Structure

```
template-nextjs-clerk/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 🏠 Home - List all posts (real-time)
│   ├── layout.tsx               # Root layout with Clerk provider
│   ├── new-post/
│   │   └── page.tsx             # 📝 Create post page (protected)
│   └── ...
├── convex/                       # Backend logic
│   ├── schema.ts                # 📊 Data model definition
│   ├── posts.ts                 # 🔧 Functions: listPosts, createPost, storeUser
│   ├── auth.config.ts           # 🔐 Clerk auth setup
│   ├── myFunctions.ts           # Legacy (can be deleted)
│   └── _generated/              # AUTO-GENERATED (do not edit)
├── components/
│   └── ConvexClientProvider.tsx # Setup Convex + Clerk
├── middleware.ts                # Clerk auth middleware
├── package.json                 # Dependencies
└── tsconfig.json               # TypeScript config
```

---

## 🚀 START HERE → IMPLEMENTATION STEPS

### **Step 1: Schema Definition** (`convex/schema.ts`)
Defines two tables:
- **users**: Synced from Clerk (tokenIdentifier, name, profileImage)
- **posts**: Blog posts (title, body, authorId, createdAt)

```typescript
// Tables indexed for fast queries
posts.index("by_creation_time", ["createdAt"])
users.index("by_token", ["tokenIdentifier"])
```

### **Step 2: Backend Functions** (`convex/posts.ts`)

#### `listPosts` (Query)
- Fetches all posts, sorted by creation time (newest first)
- NO AUTH REQUIRED (public)
- Returns: `[{_id, title, body, authorId, createdAt}, ...]`

#### `createPost` (Mutation)
- Creates a new post
- **AUTH REQUIRED**: `ctx.auth.getUserIdentity()` must return a user
- Stores: authorId = user's tokenIdentifier
- Timestamp: createdAt = Date.now()

#### `storeUser` (Mutation)
- Internal: Called when user signs in via Clerk
- Syncs Clerk user data → Convex users table
- Prevents duplicates via tokenIdentifier lookup

---

### **Step 3: Frontend - Home Page** (`app/page.tsx`)

**Real-time Post List:**
```typescript
const posts = useQuery(api.posts.listPosts);  // Automatic updates!
```

When someone creates a post anywhere, all clients see it instantly.

**Components:**
- SignInForm (unauthenticated users)
- Content (authenticated users showing posts)
- Link to `/new-post`

---

### **Step 4: Frontend - New Post Page** (`app/new-post/page.tsx`)

**Protected Form** (Only logged-in users):
```typescript
const createPost = useMutation(api.posts.createPost);

const handleSubmit = async (e) => {
  await createPost({ title, body });
  router.push("/");  // Redirect to home
};
```

---

## 🔐 Security Implementation

| Feature | How |
|---------|-----|
| Auth Check | `ctx.auth.getUserIdentity()` in mutations |
| Post Ownership | authorId = user's tokenIdentifier (stored in DB) |
| Protected Routes | Clerk `<Authenticated>` + `<Unauthenticated>` components |
| Clerk Integration | ConvexClientProvider with react-clerk binding |

---

## ⚡ Real-Time Magic

Convex provides automatic real-time via:
1. **useQuery** subscribes to data
2. Backend functions update data
3. All clients auto-receive updates
4. No WebSocket setup needed!

---

## 🎯 END POINT: Working Features

✅ **Home Page** (`/`):
- Display all blog posts
- Real-time updates when posts are created
- Sign in/Sign up buttons for guests
- New Post button (logged-in only)

✅ **New Post Page** (`/new-post`):
- Title + Body form
- Create button (mutations)
- Cancel button
- Error handling
- Redirect after success

✅ **Authentication**:
- Clerk integration
- Protected mutations
- User identification

---

## 📌 Next Steps to Run

1. **Setup Clerk**:
   - Create Clerk app at https://dashboard.clerk.com
   - Get JWT Issuer Domain
   - Set `CLERK_JWT_ISSUER_DOMAIN` in Convex Dashboard

2. **Run Backend**:
   ```bash
   npm run dev:backend
   # or: convex dev
   ```

3. **Run Frontend**:
   ```bash
   npm run dev:frontend
   # or: npm run dev
   ```

4. **Test**:
   - Visit http://localhost:3000
   - Sign in with Clerk
   - Create a post
   - Open in another tab → See real-time update! ✨

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `convex/schema.ts` | Data model |
| `convex/posts.ts` | Core backend logic |
| `convex/auth.config.ts` | Clerk setup |
| `app/page.tsx` | Home + list posts |
| `app/new-post/page.tsx` | Create post form |
| `components/ConvexClientProvider.tsx` | Setup Convex provider |

---

## ✨ Key Technologies

- **Convex**: Serverless backend with real-time queries
- **Clerk**: Authentication & user management
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

---

## 🎓 Learning Resources

- [Convex Docs](https://docs.convex.dev/)
- [Clerk Docs](https://clerk.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Status**: ✅ Ready to deploy & test!
