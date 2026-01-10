import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  onStop?: () => void;
}

export function MessageInput({ onSend, isLoading, onStop }: MessageInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative flex items-end gap-2 bg-secondary/30 p-2 rounded-xl border border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Llama 3..."
          className="min-h-[24px] max-h-[200px] w-full resize-none bg-transparent border-0 focus-visible:ring-0 p-3 shadow-none text-base"
          data-testid="input-message"
        />
        <div className="pb-1 pr-1">
          {isLoading ? (
            <Button
              size="icon"
              variant="default"
              className="h-8 w-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all"
              onClick={onStop}
              data-testid="button-stop"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant={input.trim() ? "default" : "ghost"}
              className={`h-8 w-8 rounded-lg transition-all ${
                input.trim()
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
              onClick={handleSubmit}
              disabled={!input.trim()}
              data-testid="button-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="text-center mt-2 text-xs text-muted-foreground/50 font-mono">
        LLMs can make mistakes. Verify important information.
      </div>
    </div>
  );
}
