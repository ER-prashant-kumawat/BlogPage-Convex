# Convex Debug Checklist

## Step 1: Check Environment Variables
Verify these are set in `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
```

Get from: https://dashboard.convex.dev → Project Settings → "Deployment URL"

## Step 2: Test Connection
Open browser DevTools (F12) → Console tab

Publish a blog and look for:
- ✅ "Publishing blog..." message
- ✅ "Blog published successfully!" with postId
- ❌ Any error messages

## Step 3: Check Convex Database
1. Go to https://dashboard.convex.dev
2. Click your project
3. Go to "Data" tab
4. Look for `posts` table
5. Should show all published blogs

## Step 4: Common Issues

### Issue: "Cannot read properties of undefined"
- **Cause:** NEXT_PUBLIC_CONVEX_URL not set
- **Fix:** Add to `.env.local` and restart dev server

### Issue: Posts publish but don't show
- **Cause:** Database not synced
- **Fix:** Hard refresh dashboard (Ctrl+Shift+R)

### Issue: "Mutation failed"
- **Cause:** Schema mismatch or database issue
- **Fix:** Check Convex dashboard for errors

## Step 5: Force Refresh Dashboard
After publishing, manually:
1. Go to Dashboard
2. Press F5 or Ctrl+R to refresh
3. Blog should appear

## Step 6: Check Logs
Open DevTools → Console and check for:
```javascript
// Expected logs:
"Publishing blog..." 
"Blog published successfully!"
"Dashboard loaded: { user: ..., totalPosts: X, userPosts: Y }"
```
