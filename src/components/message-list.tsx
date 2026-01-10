import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Bot, User, Volume2, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
// @ts-ignore
import generatedImage from "@/assets/bot-icon.png";
import LoadingWithBot from "./loading-with-bot";
import { useKokoro } from "@/hooks/use-kokoro";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const { speak, stop, isLoading: isVoiceLoading, isSpeaking } = useKokoro();
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync internal speakingId with actual hook state
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingId(null);
    }
  }, [isSpeaking]);

  const handleSpeak = async (text: string, id: string) => {
    if (speakingId === id) {
      stop();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(id);
    await speak(text);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id.toString());
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth"
      style={{
        scrollbarWidth: "thin",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 group animate-in slide-in-from-bottom-2 duration-300",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground border-primary/20"
                  : "bg-secondary text-secondary-foreground border-border"
              )}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            <div
              className={cn(
                "flex flex-col max-w-[85%] space-y-2",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className="prose prose-invert prose-sm max-w-none leading-relaxed break-words">
                <ReactMarkdown
                  components={{
                    // Style code blocks specifically
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !className?.includes("language-") ? (
                        <code
                          className="bg-secondary/50 text-primary px-1.5 py-0.5 rounded-md font-mono text-xs border border-border/50"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <div className="relative group/code my-4 rounded-lg overflow-hidden border border-border/50 bg-secondary/20 shadow-sm">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/50 border-b border-border/50 text-xs text-muted-foreground font-mono">
                            <span>{match?.[1] || "code"}</span>
                          </div>
                          <code
                            className="block p-4 overflow-x-auto font-mono text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        </div>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Message Actions */}
              <div
                className={cn(
                  "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    handleCopy(message.content, message.id.toString())
                  }
                >
                  {copiedId === message.id.toString() ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-6 w-6 text-muted-foreground hover:text-foreground",
                      speakingId === message.id.toString() &&
                        "text-primary animate-pulse"
                    )}
                    onClick={() =>
                      handleSpeak(message.content, message.id.toString())
                    }
                    disabled={isVoiceLoading}
                    title={
                      isVoiceLoading
                        ? "Loading voice model..."
                        : "Speak message"
                    }
                  >
                    {isVoiceLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && <LoadingWithBot />}
      </div>
    </div>
  );
}
