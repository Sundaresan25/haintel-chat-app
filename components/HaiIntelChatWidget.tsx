"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage, SimulatedResponse } from "@/types/chat";
import { LOCALSTORAGE_KEY, SIMULATED_RESPONSES } from "@/constants/chat";


// ------------ Local Storage Helpers -------------
function saveSession(messages: ChatMessage[]) {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn("Failed saving chat session", e);
  }
}

function loadSession(): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChatMessage[];
  } catch (e) {
    console.warn("Failed loading chat session", e);
    return null;
  }
}

// ------------ Main Component ---------------------
export default function HaiIntelChatWidget() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadSession() || []);
  const [input, setInput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Save session when messages change
  useEffect(() => {
    saveSession(messages);
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  function toggleOpen() {
    setOpen((v) => !v);
  }

  // ---------- Sending a message ----------
  function handleSend(text: string) {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now() + "-u",
      role: "user",
      text: text.trim(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Find matching simulated response
    const match =
      SIMULATED_RESPONSES.find((r) =>
        r.prompt.toLowerCase().includes(text.toLowerCase())
      ) ||
      SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)];

    simulateAIResponse(match);
  }

  // ---------- AI Streaming Response ----------
  function simulateAIResponse(sim: SimulatedResponse) {
    setIsStreaming(true);

    const aiMsg: ChatMessage = {
      id: Date.now() + "-ai",
      role: "ai",
      text: "",
      fullText: sim.reply,
    };

    setMessages((m) => [...m, aiMsg]);

    // streaming effect
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      const partial = sim.reply.slice(0, i);

      setMessages((curr) => {
        const copy = [...curr];
        const idx = copy.findIndex((x) => x.id === aiMsg.id);
        if (idx >= 0) copy[idx] = { ...copy[idx], text: partial };
        return copy;
      });

      if (i >= sim.reply.length) {
        clearInterval(interval);
        setIsStreaming(false);

        // Add follow-up suggestions
        setMessages((curr) => {
          const copy = [...curr];
          const idx = copy.findIndex((x) => x.id === aiMsg.id);
          if (idx >= 0) {
            copy[idx].suggestions = sim.suggestions ?? [];
          }
          return copy;
        });
      }
    }, 10);
  }

  function handleSuggestionClick(s: string) {
    handleSend(s);
  }

  function clearSession() {
    setMessages([]);
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  // ---------------- UI -------------------------
  return (
    <div className="fixed bottom-4 right-6 z-50 mt-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="w-[520px] max-w-[95vw] h-[680px]
      bg-gradient-to-br from-[#0b0c0d]/90 to-[#151618]/90
      backdrop-blur-xl border border-white/10
      rounded-3xl shadow-[0_0_35px_rgba(0,0,0,0.65)]
      flex flex-col overflow-hidden"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 
        bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 
            flex items-center justify-center text-white font-bold shadow-md">
                  HI
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    HaiIntel Assistant
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Human-centered AI guidance
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={clearSession}
                  className="text-xs text-neutral-400 hover:text-white transition"
                >
                  Clear
                </button>
                <button
                  onClick={toggleOpen}
                  className="text-xs px-2 py-1 bg-neutral-900/60 hover:bg-neutral-800
              rounded-md text-white border border-white/10 transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-auto px-4 py-3 space-y-3 custom-scroll"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`px-4 py-2 max-w-[80%] text-sm rounded-2xl break-words shadow-sm ${m.role === "user"
                      ? "bg-gradient-to-br from-sky-600 to-indigo-600 text-white rounded-tr-none shadow-md"
                      : "bg-white/5 border border-white/10 text-neutral-200 rounded-tl-none backdrop-blur-sm"
                      }`}
                  >
                    {m.text}

                    {m?.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(s)}
                            className="text-xs px-2 py-1 rounded-full
          bg-white/10 hover:bg-white/20 border border-white/10 
          text-neutral-300 transition"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                  </motion.div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10 bg-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-full">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend(input);
                  }}
                  placeholder="Ask HaiIntel..."
                  className="flex-1 bg-transparent text-sm text-white px-3 outline-none"
                />
                <button
                  onClick={() => handleSend(input)}
                  className="px-4 py-2 bg-gradient-to-br from-sky-500 to-indigo-600
              text-white rounded-full text-sm font-medium shadow-md
              hover:opacity-90 active:scale-95 transition"
                >
                  Send
                </button>
              </div>

              {isStreaming && (
                <div className="mt-2 text-xs text-neutral-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-75"></span>
                  <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-150"></span>
                  AI is typing...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      {!open && (
        <button
          onClick={toggleOpen}
          className="flex items-center gap-4 bg-gradient-to-br from-neutral-900 to-neutral-800
        border border-white/10 px-5 py-4 rounded-3xl shadow-xl hover:scale-105 
        hover:border-neutral-600 transition fixed bottom-8 right-8"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 
        flex items-center justify-center text-white font-bold shadow-md text-lg">
            HI
          </div>
          <div className="hidden md:block text-base text-white">Ask HaiIntel</div>
        </button>
      )}


    </div>

  );
}
