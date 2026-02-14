"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import LandingNavbar from "../landing-navbar";
import Link from "next/link";
import { useEffect } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const storeUser = useMutation(api.posts.storeUser);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProfileImage(result);
                setPreviewImage(result);
                setError(null);
            };
            reader.onerror = () => {
                setError("Failed to read image file");
            };
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!email.trim()) {
            setError("Please enter email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (isSignUp) {
            if (!name.trim()) {
                setError("Please enter your full name");
                return;
            }

            if (!password.trim()) {
                setError("Please enter a password");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
        } else {
            if (!password.trim()) {
                setError("Please enter your password");
                return;
            }
        }

        setLoading(true);
        try {
            const tokenIdentifier = email;
            const userName = name || email.split("@")[0];

            // Store user info in localStorage IMMEDIATELY
            localStorage.setItem(
                "user",
                JSON.stringify({
                    tokenIdentifier,
                    name: userName,
                    profileImage: profileImage || undefined,
                })
            );

            // Store to database in background (don't wait)
            storeUser({
                tokenIdentifier,
                name: userName,
                profileImage: profileImage || undefined,
            }).catch(() => {
                // Silent fail - user is already logged in locally
            });

            // Redirect immediately (no delay)
            router.push("/dashboard");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An error occurred";
            setError(errorMessage);
            console.error("Login error:", error);
            setLoading(false);
        }
    };

    const handleToggleMode = () => {
        setIsSignUp(!isSignUp);
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setProfileImage(null);
        setPreviewImage(null);
        setError(null);
        setSuccess(null);
    };

    return (
        <>
            <LandingNavbar />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-5xl">
                    {/* Split Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl shadow-2xl overflow-hidden bg-white">
                        {/* Left Panel - Welcome Section */}
                        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-12 text-white relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

                            <div className="relative z-10">
                                <h2 className="text-4xl font-bold mb-4">
                                    {isSignUp ? "Welcome!" : "Welcome Back!"}
                                </h2>
                                <p className="text-lg text-blue-100 mb-8">
                                    {isSignUp
                                        ? "Join our community and start sharing your amazing stories with the world"
                                        : "Enter your personal details to use all of site features"}
                                </p>

                                {/* Toggle Button for Mobile */}
                                <button
                                    type="button"
                                    onClick={handleToggleMode}
                                    disabled={loading}
                                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 disabled:opacity-50"
                                >
                                    {isSignUp ? "SIGN IN" : "SIGN UP"}
                                </button>
                            </div>

                            <div className="relative z-10 text-sm text-blue-100">
                                <p>© 2026 Real-Time Blog. All rights reserved.</p>
                            </div>
                        </div>

                        {/* Right Panel - Form Section */}
                        <div className="p-8 sm:p-12 flex flex-col justify-center">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {isSignUp ? "Create Account" : "Sign In"}
                                </h1>
                                {isSignUp && (
                                    <p className="text-gray-600 text-sm">
                                        or use your email for registration
                                    </p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm flex items-start gap-3">
                                    <span className="text-lg">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-300 text-green-700 text-sm flex items-start gap-3">
                                    <span className="text-lg">✅</span>
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Quick Login Options */}
                             <div className="mb-8 space-y-3">
                                 {/* Quick Demo Login */}
                                 <button
                                     type="button"
                                     onClick={() => {
                                         setEmail("demo@example.com");
                                         setPassword("123456");
                                         setName("Demo User");
                                         setError(null);
                                     }}
                                     disabled={loading}
                                     className="w-full py-3 px-6 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-all font-bold text-green-600 disabled:opacity-50"
                                 >
                                     ✨ Quick Demo Login
                                 </button>
                                 <p className="text-xs text-center text-gray-500">Click above, then submit form below</p>

                                 {/* Divider */}
                                 <div className="flex items-center gap-3">
                                     <div className="flex-1 h-px bg-gray-300"></div>
                                     <span className="text-gray-500 text-sm font-medium">OR</span>
                                     <div className="flex-1 h-px bg-gray-300"></div>
                                 </div>

                                 {/* Google Sign-In/Sign-Up */}
                                 <button
                                     type="button"
                                     onClick={() => {
                                         window.location.href = "/api/auth/google";
                                     }}
                                     disabled={loading}
                                     className="w-full py-3 px-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-all font-bold text-blue-600 flex items-center justify-center gap-2 disabled:opacity-50"
                                 >
                                     <svg className="w-5 h-5" viewBox="0 0 24 24">
                                         <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                         <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                         <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                         <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                     </svg>
                                     {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
                                 </button>
                             </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-sm font-medium">
                                    or use your email {isSignUp ? "for registration" : ""}
                                </span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name (Sign Up Only) */}
                                {isSignUp && (
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                                    />
                                )}

                                {/* Email */}
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                                />

                                {/* Password */}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                                />

                                {/* Confirm Password (Sign Up Only) */}
                                {isSignUp && (
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                                    />
                                )}

                                {/* Profile Image (Sign Up Only) */}
                                {isSignUp && (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-all"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <span className="text-2xl">📷</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">
                                                {previewImage ? "Change Profile Photo" : "Upload Profile Photo"}
                                            </p>
                                            <p className="text-xs text-gray-500">Optional • Max 5MB</p>
                                        </div>
                                        {previewImage && (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={loading}
                                />

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin inline-block">⏳</span>
                                            {isSignUp ? "CREATING..." : "SIGNING IN..."}
                                        </>
                                    ) : isSignUp ? (
                                        "SIGN UP"
                                    ) : (
                                        "SIGN IN"
                                    )}
                                </button>
                            </form>

                            {/* Toggle - Mobile Only */}
                            <div className="lg:hidden mt-6 text-center">
                                <p className="text-gray-600 text-sm mb-3">
                                    {isSignUp
                                        ? "Already have an account?"
                                        : "Don't have an account?"}{" "}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleToggleMode}
                                    disabled={loading}
                                    className="text-purple-600 font-bold hover:text-purple-700 transition-colors disabled:opacity-50"
                                >
                                    {isSignUp ? "Sign In" : "Sign Up"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-8">
                        <Link href="/">
                            <button className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium">
                                ← Back to Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
