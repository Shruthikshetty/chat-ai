import { Menu, PanelLeft, Share, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { ModelSelector } from "./model-selector";
import { useState } from "react";
import { SelectDemo } from "./simple-select";

const AppTopBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}) => {
  const [selectedModel, setSelectedModel] = useState("1");
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10">
      {/* Tob bar */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          {isSidebarOpen ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>

        <div className="w-48">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
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
  );
};

export default AppTopBar;
