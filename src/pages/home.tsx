import AppSidebar from "@/components/app-sidebar";
import AppTopBar from "@/components/app-top-bar";
import { MessageInput } from "@/components/message-input";
import { MessageList } from "@/components/message-list";
import { useState } from "react";
import { Message } from "@/lib/types";
import { generateText } from "ai";
import { ollama } from "@/config/olama.config";
import { ModelInitialMessage } from "@/constants/screen.constants";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([ModelInitialMessage]);
  const [loading, setLoading] = useState(false);

  // function to add a new message
  const addMessage = ({
    message,
    role,
  }: {
    message: string;
    role: "user" | "assistant";
  }) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Number(prev[prev.length - 1].id) + 1,
        role,
        content: message,
        timestamp: Date.now(),
      },
    ]);
  };

  // handle send mesage
  const handleSend = async (message: string) => {
    // add the user message
    addMessage({ message, role: "user" });
    setLoading(true);
    // generate reponse
    const { text } = await generateText({
      model: ollama("deepseek-r1:14b"),
      prompt: message,
    });
    setLoading(false);
    // append the message to the messages state
    addMessage({ message: text, role: "assistant" });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground selection:bg-primary/20">
      {/* Sidebar with overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <AppSidebar
        isOpen={isSidebarOpen}
        onNewChat={() => {}}
        sessions={[]}
        activeSessionId={""}
        onSelectSession={() => {}}
        onDeleteSession={() => {}}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Tob bar */}
        <AppTopBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* list of messages */}
        <MessageList messages={messages} isLoading={loading} />

        {/* message input */}
        <div className="p-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <MessageInput onSend={handleSend} isLoading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Home;
