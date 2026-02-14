# Google OAuth Setup Guide

## Quick Setup (5 minutes)

### 1. Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "MyBlog"
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web Application)
5. Add redirect URI: `http://localhost:3000/api/auth/google`

### 2. Add to `.env.local`
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 3. Test
- Click "Sign In with Google" button
- Login with your Google account
- Instant dashboard! ✅

---

## Login Options Available

✨ **Quick Demo Login**
- Email: `demo@example.com`
- Password: `123456`
- Click auto-fill → Submit

🔵 **Google Sign-In/Sign-Up**
- One-click Google login
- Auto-fill profile (name, photo)
- Fast & secure

📧 **Email/Password**
- Traditional manual signup
- Full control

---

## Production Setup

For production (e.g., myblog.com):
1. Update redirect URI: `https://myblog.com/api/auth/google`
2. Update `.env.local`:
   ```
   NEXT_PUBLIC_APP_URL=https://myblog.com
   ```
3. Deploy!

---

## Troubleshooting

**Google button doesn't work?**
- Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
- Restart dev server: `npm run dev`
- Check browser console for errors

**Redirect not working?**
- Ensure redirect URI matches exactly
- Check `NEXT_PUBLIC_APP_URL` is correct

---

## Done! 🎉
