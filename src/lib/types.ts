export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
}

export interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  modelId: string;
  createdAt: number;
}
