import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageSquare,
  Settings,
  Database,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

export type Sessions = {
  id: string;
  title: string;
  messages: Message[];
};
interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
  sessions: Sessions[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClose?: () => void;
}

function AppSidebar({
  isOpen,
  onNewChat,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none",
        !isOpen && "-translate-x-full lg:hidden"
      )}
    >
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <Button
          variant="outline"
          className="flex-1 justify-start gap-2 border-primary/20 hover:border-primary/50 hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
          onClick={onNewChat}
          data-testid="button-new-chat"
        >
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden ml-2 text-muted-foreground"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        <div className="px-2 text-xs font-semibold text-muted-foreground/50 mb-2 uppercase tracking-wider font-mono">
          Chat History
        </div>
        {sessions.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-muted-foreground/40 font-mono italic">
              No recent chats
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="group relative">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 h-10 px-2 font-normal truncate text-sm transition-all",
                  activeSessionId === session.id
                    ? "bg-secondary/60 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
                onClick={() => onSelectSession(session.id)}
                data-testid={`button-session-${session.id}`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate pr-6">{session.title}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                data-testid={`button-delete-session-${session.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border/40 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9 px-2"
        >
          <Database className="w-4 h-4" />
          <span>Manage Models</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9 px-2"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Button>
        <div className="flex items-center gap-3 pt-4 px-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20"></div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">User Account</span>
            <span className="text-xs text-muted-foreground">Local Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
