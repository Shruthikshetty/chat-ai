import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Bot, User, Volume2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// @ts-ignore
import generatedImage from "@/assets/bot-icon.png";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 mb-8 rounded-full bg-secondary/30 flex items-center justify-center border border-border/50 shadow-2xl shadow-primary/5">
          <img
            src={generatedImage}
            alt="AI Logo"
            className="w-16 h-16 opacity-80"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 tracking-tight">
          How can I help you today?
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          I'm running locally on your machine. All conversations are private and
          secure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            "Explain quantum computing",
            "Write a Python script for scraping",
            "How does a neural network work?",
            "Draft a professional email",
          ].map((suggestion, i) => (
            <button
              key={i}
              className="p-4 rounded-xl bg-secondary/20 border border-border/50 hover:bg-secondary/50 hover:border-primary/20 transition-all text-left text-sm text-muted-foreground hover:text-foreground group"
            >
              <span className="group-hover:translate-x-1 transition-transform inline-block">
                → {suggestion}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth">
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
                  onClick={() => handleCopy(message.content, message.id)}
                >
                  {copiedId === message.id ? (
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
                      speakingId === message.id && "text-primary animate-pulse"
                    )}
                    onClick={() => handleSpeak(message.content, message.id)}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
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
        )}
      </div>
    </div>
  );
}
