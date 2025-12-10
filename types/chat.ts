export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  fullText?: string;
  suggestions?: string[];
}

export interface SimulatedResponse {
  prompt: string;
  reply: string;
  suggestions?: string[];
}
