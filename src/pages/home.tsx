import AppSidebar from "@/components/app-sidebar";
import AppTopBar from "@/components/app-top-bar";
import { MessageInput } from "@/components/message-input";
import { MessageList } from "@/components/message-list";
import { useState } from "react";
import { Message } from "@/lib/types";

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! How can I help you today?",
    timestamp: Date.now(),
  },
];

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // handle send mesage
  const handleSend = (message: string) => {
    console.log(message);
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
        <MessageList messages={MOCK_MESSAGES} isLoading={false} />

        {/* message input */}
        <div className="p-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <MessageInput onSend={handleSend} isLoading={false} />
        </div>
      </main>
    </div>
  );
};

export default Home;
