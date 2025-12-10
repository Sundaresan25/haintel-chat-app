"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Email validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) return setError("Please enter a valid email");
    if (!password) return setError("Password cannot be empty");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050507] relative overflow-hidden">

      {/* Background Gradient Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600/10 to-indigo-600/10 blur-2xl"></div>

      {/* Animated Glow Circles */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-sky-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-lg w-96 animate-fadeIn"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 
          flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            HI
          </div>
          <h1 className="text-2xl text-white font-semibold mt-4">HaiIntel Login</h1>
          <p className="text-sm text-neutral-400">Human-centered AI guidance</p>
        </div>

        {/* Email */}
        <label className="text-neutral-300 text-sm">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="w-full mt-1 mb-4 px-3 py-2 rounded-md bg-neutral-900/60 text-white border border-neutral-700 focus:border-sky-500 outline-none transition"
          required
        />

        {/* Password */}
        <label className="text-neutral-300 text-sm">Password</label>
        <input
          type="password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="w-full mt-1 mb-4 px-3 py-2 rounded-md bg-neutral-900/60 text-white border border-neutral-700 focus:border-sky-500 outline-none transition"
          required
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 mb-3 text-sm bg-red-500/10 border border-red-500/20 p-2 rounded-md">
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-br from-sky-500 to-indigo-600 py-2 rounded-md text-white font-medium 
          shadow-md hover:opacity-90 active:scale-95 transition"
        >
          Login
        </button>

        {/* Footer Text */}
        <p className="text-center text-xs text-neutral-500 mt-4">
          Powered by HaiIntel AI
        </p>
      </form>
    </div>
  );
}
