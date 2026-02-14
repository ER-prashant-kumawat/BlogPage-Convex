"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName }: NavbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-10 bg-foreground text-background p-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-xl font-bold cursor-pointer">Real-Time Blog</h1>
      </Link>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-background text-foreground px-4 py-2 rounded-md font-semibold"
        >
          👤 {userName || "Profile"}
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-background text-foreground border rounded-md shadow-lg">
            <Link href="/dashboard">
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">
                📊 Dashboard
              </button>
            </Link>
            <Link href="/new-post">
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">
                ✏️ Write Blog
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 border-t"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
