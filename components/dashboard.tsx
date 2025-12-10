"use client";
import AppLayout from "@/layout/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HaiIntelChatWidget from "./HaiIntelChatWidget";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (!session) return <p className="text-white p-6">Loading...</p>;

  return (
    <AppLayout>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
          Dashboard
        </h1>
        <p className="text-neutral-400 mt-1 text-sm">
          Welcome back, <span className="text-sky-400">{session.user?.name}</span> 👋
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="bg-[#0d0f13] border border-white/10 rounded-2xl p-6 mb-8 shadow-xl hover:shadow-sky-500/10 transition-all">
        <h2 className="text-xl font-semibold mb-2 text-white">
          Welcome to HaiIntel AI Platform
        </h2>
        <p className="text-neutral-400">
          Your personalized AI workspace is ready. Start chatting, generating results,
          and managing your data with our advanced AI tools.
        </p>
      </div>

      {/* Main Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#0d0f13] border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-blue-500/10 transition-all">
          <h3 className="text-xl font-semibold mb-3 text-white">Your AI Assistant</h3>
          <p className="text-neutral-400 mb-4">
            Chat with HaiIntel AI — ask questions, get insights, and automate tasks.
          </p>

          <div className="mt-4">
            <HaiIntelChatWidget />
          </div>
        </div>

        {/* Right side card */}
        <div className="bg-[#0d0f13] border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-blue-500/10 transition-all">
          <h3 className="text-xl font-semibold mb-3 text-white">Quick Stats</h3>
          <p className="text-neutral-400 mb-4">
            This section can show analytics or usage metrics here.
          </p>

          {/* Example stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#101317] border border-neutral-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-sky-400">12</div>
              <div className="text-sm text-neutral-400">Chats Today</div>
            </div>

            <div className="bg-[#101317] border border-neutral-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-sm text-neutral-400">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
