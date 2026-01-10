import { Bot } from "lucide-react";

const LoadingWithBot = () => {
  return (
    <div className="flex gap-4 animate-in fade-in duration-300">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border">
        <Bot className="w-5 h-5 text-secondary-foreground" />
      </div>
      <div className="flex items-center gap-1 h-8">
        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default LoadingWithBot;
