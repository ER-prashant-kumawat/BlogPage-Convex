"use client";

import { useState, useEffect, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const addDemoData = useMutation(api.posts.addDemoData);
  const storeUser = useMutation(api.posts.storeUser);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Demo data add (safe dependency added)
  useEffect(() => {
    addDemoData();
  }, [addDemoData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo authentication (email as tokenIdentifier)
      const tokenIdentifier = email;
      const displayName = name || email.split("@")[0];

      await storeUser({
        tokenIdentifier,
        name: displayName,
        profileImage: undefined,
      });

      // Store user locally (demo purpose)
      localStorage.setItem(
        "user",
        JSON.stringify({
          tokenIdentifier,
          name: displayName,
        })
      );

      router.push("/");
    } catch (error) {
      alert(
        "Error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-96 mx-auto p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Real-Time Blog</h1>
        <p className="text-slate-500 mt-2">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="border px-3 py-2 rounded"
          />
        </div>

        {isSignUp && (
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="border px-3 py-2 rounded"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 font-bold rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-slate-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-black font-bold underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
