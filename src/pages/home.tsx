import AppSidebar from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeft, Share, Trash2 } from "lucide-react";
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
        <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          {/* Tob bar */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isSidebarOpen ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              //   onClick={handleClearCurrent}
              title="Clear active chat"
              //   disabled={!activeSessionId || messages.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Share className="w-4 h-4" />
            </Button>
            {/* main content goes here */}
          </div>
        </header>
      </main>
    </div>
  );
};

export default Home;
