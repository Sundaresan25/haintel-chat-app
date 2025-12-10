import { SimulatedResponse } from "@/types/chat";

export const LOCALSTORAGE_KEY = "haiintel_chat_session";

export const SIMULATED_RESPONSES: SimulatedResponse[] = [
    {
        prompt: "what is haiintel",
        reply:
            "HaiIntel builds human-centered AI experiences that merge design, performance, and intelligence.",
        suggestions: ["What services do you offer?", "Tell me about design philosophy"],
    },
    {
        prompt: "ai design",
        reply:
            "We specialize in AI-native UI systems, intelligent workflows, and high-performance interfaces.",
        suggestions: ["Show examples", "How do you build AI-native UI?"],
    },
] as const;
