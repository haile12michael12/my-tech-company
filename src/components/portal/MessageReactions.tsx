import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

export interface Reaction {
  emoji: string;
  users: string[]; // "me" or user name
}

interface MessageReactionsProps {
  reactions: Reaction[];
  onReact: (emoji: string) => void;
  isMe: boolean;
}

const MessageReactions = ({ reactions, onReact, isMe }: MessageReactionsProps) => {
  const [open, setOpen] = useState(false);

  if (reactions.length === 0 && !open) return null;

  return (
    <div className={cn("flex flex-wrap gap-1 mt-1.5", isMe ? "justify-end" : "justify-start")}>
      {reactions.map((r) => {
        const iReacted = r.users.includes("me");
        return (
          <button
            key={r.emoji}
            onClick={() => onReact(r.emoji)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition-colors",
              iReacted
                ? "bg-primary/10 border-primary/30 text-foreground"
                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="text-sm">{r.emoji}</span>
            {r.users.length > 1 && <span className="font-medium">{r.users.length}</span>}
          </button>
        );
      })}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1.5" side="top" align={isMe ? "end" : "start"}>
          <div className="flex gap-1">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(emoji);
                  setOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface ReactionTriggerProps {
  onReact: (emoji: string) => void;
  isMe: boolean;
}

export const ReactionTrigger = ({ onReact, isMe }: ReactionTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted text-muted-foreground",
          )}
        >
          <Smile className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1.5" side="top" align={isMe ? "end" : "start"}>
        <div className="flex gap-1">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(emoji);
                setOpen(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MessageReactions;
