# Blog Publish Guide

## ⚠️ Important: Setup Convex First!

### Step 1: Get Convex Deployment URL
1. Go to https://dashboard.convex.dev
2. Sign in / Create account
3. Create a new project (name: "MyBlog")
4. Go to Project Settings
5. Copy "Deployment URL" (looks like: `https://xxx.convex.cloud`)

### Step 2: Set Environment Variable
Add to `.env.local` file (create if not exists):
```
NEXT_PUBLIC_CONVEX_URL=https://your_deployment_url_here.convex.cloud
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

---

## ✅ Test If Working

### Option A: Quick Test (Recommended)
1. Go to: `http://localhost:3000/debug`
2. Click "Create Test Post" button
3. Check DevTools Console (F12)
4. Should see: ✅ "Post created!"
5. Refresh page - post should appear
6. Go to Dashboard - post should appear there too

### Option B: Manual Test
1. Login to app
2. Click "Write New Blog"
3. Fill title + content
4. Click "Publish Post"
5. Wait for redirect to Dashboard
6. **Blog should appear in "Your Blogs" section**

---

## 🐛 Troubleshooting

### Problem: Blog doesn't appear after publish
**Solution:**
1. Check DevTools Console (F12)
2. Should see logs like:
   ```
   Publishing blog...
   Blog published successfully! <postId>
   ```
3. If you see errors, check `.env.local` for correct URL

### Problem: "NEXT_PUBLIC_CONVEX_URL is not set"
**Solution:**
1. Add to `.env.local`
2. Restart dev server (`npm run dev`)
3. Try again

### Problem: Page reloads but no blog shows
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Check Convex dashboard to see if posts exist
3. Check browser console for any errors

---

## 📊 Verify in Convex Dashboard

1. Go to https://dashboard.convex.dev
2. Click your project
3. Go to "Data" tab
4. Look for `posts` table
5. Should show all published blogs

---

## ✨ How It Works

1. **Write Blog** → Click "Publish Post"
2. **Save to Database** → Convex saves blog
3. **Redirect** → Dashboard reloads
4. **Show Blog** → Your blog appears in dashboard
5. **View Blog** → Click blog title to read full post
6. **Edit Blog** → Click "Edit" button
7. **Delete Blog** → Click "Delete" button

---

## 🎯 Features

✅ Create blog with title + content  
✅ Add featured image (optional)  
✅ Edit published blogs  
✅ Delete blogs  
✅ View all blogs  
✅ Read full blog post  

---

## 💡 Pro Tips

- Always check DevTools Console (F12) for logs
- Use `/debug` page to test Convex connection
- Refresh Dashboard (F5) if blog doesn't appear
- Contact support if Convex URL is wrong

---

## 🚀 You're All Set!

Your blog platform is ready to use. Start creating amazing blogs! 🎉
