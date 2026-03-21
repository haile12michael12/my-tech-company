import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const emojiCategories = [
  {
    name: "Smileys",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🫡","😐","😑","😶","🫥","😏","😒","🙄","😬","😮‍💨","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥴","😵","🤯","🥳","🥸","😎","🤓","🧐"],
  },
  {
    name: "Gestures",
    emojis: ["👋","🤚","🖐️","✋","🖖","🫱","🫲","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🙏"],
  },
  {
    name: "Objects",
    emojis: ["💼","📁","📂","📄","📝","✏️","📎","📌","📍","🔗","💡","🔔","📣","💬","💭","🗨️","📧","📨","📩","✉️","📦","🏷️","🔖","📅","📆","🗓️","⏰","🕐","⌛","⏳"],
  },
  {
    name: "Symbols",
    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","💕","💞","💓","💗","💖","💘","💝","⭐","🌟","✨","💫","🔥","💯","✅","❌","⚠️","🚀","🎉","🎊"],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = search
    ? emojiCategories.map((cat) => ({
        ...cat,
        emojis: cat.emojis.filter(() => cat.name.toLowerCase().includes(search.toLowerCase())),
      })).filter((cat) => cat.emojis.length > 0)
    : emojiCategories;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start" side="top">
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search emojis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="h-56">
          <div className="p-2">
            {filtered.map((cat) => (
              <div key={cat.name} className="mb-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1 mb-1">{cat.name}</p>
                <div className="grid grid-cols-8 gap-0.5">
                  {cat.emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onEmojiSelect(emoji);
                        setOpen(false);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
