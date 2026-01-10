import { Message } from "@/lib/types";

export const ModelInitialMessage: Message = {
  id: 1,
  role: "assistant",
  content: "Hello! How can I help you today?",
  timestamp: Date.now(),
};
