"use client";

import { ReactNode, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (session?.user?.name) setUserName(session.user.name);
  }, [session]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090B0E] text-white font-sans">

      {/* Navbar */}
      <header className="backdrop-blur-md bg-[#0d0e10]/70 border-b border-white/10 px-8 py-4 flex items-center justify-between shadow-lg">
        
        {/* Left Side Brand */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            HaiIntel
          </div>
          <div className="text-sm text-neutral-400 tracking-wide">
            AI Application
          </div>
        </div>

        {/* Right Side User + Logout */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className="w-9 h-9 rounded-full bg-sky-600/20 border border-sky-600/40 flex items-center justify-center text-sky-400 font-semibold">
              {userName ? userName[0].toUpperCase() : "U"}
            </div>

            <div className="text-sm font-medium">
              Hello, <span className="text-sky-400">{userName}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-red-500/20"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
