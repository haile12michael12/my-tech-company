import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  content: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 min ago";
  if (diffMins < 60) return `${diffMins} mins ago`;
  return formatTime(date);
};

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hello! 👋 Welcome to NovaTech. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const quickReplies = [
  "Tell me about your services",
  "I need a quote",
  "Schedule a consultation",
  "Contact support",
];

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
      </div>
    </div>
  );
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  // Update relative timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: messages.length + 2,
        content:
          "Thanks for your message! This is a demo chatbot. In a production environment, I would connect to your AI backend to provide intelligent responses. For now, feel free to explore our website or contact us directly!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div
        className={cn(
          "absolute bottom-16 right-0 w-[360px] max-w-[calc(100vw-3rem)] transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold">NovaTech Assistant</h3>
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Online • Typically replies instantly
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[320px]">
            <div ref={scrollRef} className="p-4 space-y-4">
              {messages.map((message, index) => {
                const showTimestamp =
                  index === 0 ||
                  message.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 60000 ||
                  message.sender !== messages[index - 1].sender;

                return (
                  <div key={message.id}>
                    {showTimestamp && (
                      <div className="text-[10px] text-muted-foreground text-center mb-2">
                        {getRelativeTime(message.timestamp)}
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex gap-2",
                        message.sender === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback
                          className={cn(
                            message.sender === "bot"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          )}
                        >
                          {message.sender === "bot" ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <div
                          className={cn(
                            "max-w-[220px] rounded-2xl px-4 py-2.5 text-sm",
                            message.sender === "bot"
                              ? "bg-muted text-foreground rounded-tl-sm"
                              : "bg-primary text-primary-foreground rounded-tr-sm"
                          )}
                        >
                          {message.content}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] text-muted-foreground",
                            message.sender === "user" ? "text-right" : ""
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && <TypingIndicator />}

              {/* Quick Replies */}
              {messages.length === 1 && !isTyping && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isTyping || !inputValue.trim()}
                className="rounded-full bg-gradient-primary hover:opacity-90 shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Powered by NovaTech AI
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen
            ? "bg-muted hover:bg-muted/80 text-foreground"
            : "bg-gradient-primary hover:opacity-90 shadow-glow animate-pulse-glow"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
