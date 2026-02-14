# Quick Start Guide 🚀

## In 3 Steps - Real-Time Blog Setup

### Step 1: Setup Clerk (5 mins)
1. Go to https://dashboard.clerk.com
2. Create new application
3. Copy **JWT Issuer Domain** (looks like: `https://app-abc123.clerk.accounts.com`)
4. Go to Convex Dashboard
5. In settings → Add environment variable `CLERK_JWT_ISSUER_DOMAIN` with your domain

### Step 2: Run Backend
```bash
npm run dev:backend
# or: convex dev
```

Wait for: `✅ Synced! Type definitions ready`

### Step 3: Run Frontend (new terminal)
```bash
npm run dev:frontend
# or: npm run dev
```

Visit: http://localhost:3000 🎉

---

## 🧪 Test It (2 mins)

1. **Open 2 browser tabs** at http://localhost:3000
2. **Tab 1**: Click "Sign In" → Create account (Clerk modal)
3. **Tab 1**: Click "New Post"
4. **Tab 1**: Fill title = "Hello", body = "This is real-time!"
5. **Tab 1**: Click "Publish Post"
6. **Tab 2**: 👀 See new post appear **INSTANTLY** (no refresh!)

✨ **Real-time magic!** ✨

---

## 📁 What Each File Does

| File | What It Is |
|------|-----------|
| `convex/schema.ts` | Defines users + posts tables |
| `convex/posts.ts` | Functions: listPosts, createPost, storeUser |
| `app/page.tsx` | Home page with post list |
| `app/new-post/page.tsx` | Create post form (protected) |

---

## 🔑 Key Concepts

**Query** = Read from database (can subscribe to real-time updates)
```typescript
const posts = useQuery(api.posts.listPosts);  // ✨ Auto-updates!
```

**Mutation** = Write to database (with auth checks)
```typescript
await createPost({title, body});  // ✅ Creates post safely
```

**Real-time** = Changes sync across all browsers instantly
```
User A creates post → Database updates → User B sees it immediately
```

---

## 🔐 Security Check

```
❌ Can NOT create posts without signing in
✅ Can read all posts (public)
✅ Posts linked to user who created them
```

---

## 🆘 Troubleshooting

### `Cannot find module 'convex/react'`
→ Run `npm install` & make sure `node_modules` exists

### `CLERK_JWT_ISSUER_DOMAIN not set`
→ Add it to Convex Dashboard settings

### No real-time updates?
→ Check browser console for errors
→ Make sure both terminal windows are running

### Post button doesn't work?
→ Check you're signed in
→ Check browser dev console for errors

---

## 📚 Documentation

- Full guide: `BLOG_IMPLEMENTATION.md`
- Project overview: `PROJECT_SUMMARY.md`
- Flow diagram: `FLOW_DIAGRAM.txt`
- Checklist: `REQUIREMENTS_CHECKLIST.md`

---

## ✨ You're All Set!

Your real-time blog is ready. Make posts, invite friends, watch real-time updates work their magic! 🎉

**Questions?** Check the docs above or look at the code comments.

Happy blogging! 📝
