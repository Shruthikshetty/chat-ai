import AppSidebar from "@/components/app-sidebar";
import AppTopBar from "@/components/app-top-bar";
import { MessageInput } from "@/components/message-input";
import { MessageList } from "@/components/message-list";
import { useState } from "react";
import { Message } from "@/lib/types";
import { createOllama } from "ollama-ai-provider-v2";
import { generateText } from "ai";

//initialize the ollama provider
const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: Date.now(),
    },
  ]);

  // handle send mesage
  const handleSend = async (message: string) => {
    // add the user message
    setMessages((prev) => [
      ...prev,
      {
        id: (Number(prev[prev.length - 1].id) + 1).toString(),
        role: "user",
        content: message,
        timestamp: Date.now(),
      },
    ]);

    // generate reponse
    const { text } = await generateText({
      model: ollama("deepseek-r1:14b"),
      prompt: message,
    });

    // temp
    console.log(text);
    // append the message to the messages state
    setMessages((prev) => [
      ...prev,
      {
        id: (Number(prev[prev.length - 1].id) + 1).toString(),
        role: "assistant",
        content: text,
        timestamp: Date.now(),
      },
    ]);
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
        <MessageList messages={messages} isLoading={false} />

        {/* message input */}
        <div className="p-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <MessageInput onSend={handleSend} isLoading={false} />
        </div>
      </main>
    </div>
  );
};

export default Home;
