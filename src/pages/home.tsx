import AppSidebar from "@/components/app-sidebar";
import AppTopBar from "@/components/app-top-bar";
import { SelectDemo } from "@/components/simple-select";
import { useState } from "react";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      </main>
    </div>
  );
};

export default Home;
