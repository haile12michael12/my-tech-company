import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Search, Phone, Video, MoreVertical, Check, CheckCheck, Smile, FileText, Image as ImageIcon, X, Download, Loader2, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import EmojiPicker from "./EmojiPicker";
import MessageReactions, { ReactionTrigger, type Reaction } from "./MessageReactions";

interface Attachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface DbConversation {
  id: string;
  title: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number | null;
  client_id: string;
}

interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean | null;
  created_at: string;
}

interface DbReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain", "text/csv",
];

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 24) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (hours < 48) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageType = (type: string) => type.startsWith("image/");

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

const AttachmentPreview = ({ attachment, isMe }: { attachment: Attachment; isMe: boolean }) => {
  if (isImageType(attachment.type)) {
    return (
      <div className="mt-2 rounded-lg overflow-hidden max-w-xs">
        <img src={attachment.url} alt={attachment.name} className="w-full h-auto max-h-60 object-cover rounded-lg" />
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <span className={cn("text-xs truncate", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>{attachment.name}</span>
          <span className={cn("text-[10px] shrink-0", isMe ? "text-primary-foreground/50" : "text-muted-foreground/70")}>{formatFileSize(attachment.size)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "mt-2 flex items-center gap-3 rounded-lg border p-3",
      isMe ? "border-primary-foreground/20 bg-primary-foreground/10" : "border-border bg-background"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
        isMe ? "bg-primary-foreground/20" : "bg-muted"
      )}>
        <FileText className={cn("w-5 h-5", isMe ? "text-primary-foreground" : "text-muted-foreground")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", isMe ? "text-primary-foreground" : "text-foreground")}>{attachment.name}</p>
        <p className={cn("text-[10px]", isMe ? "text-primary-foreground/60" : "text-muted-foreground")}>{formatFileSize(attachment.size)}</p>
      </div>
      <Button variant="ghost" size="icon" className={cn("shrink-0 h-8 w-8", isMe ? "text-primary-foreground hover:bg-primary-foreground/20" : "")}>
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
};

const PendingAttachmentChip = ({ attachment, onRemove }: { attachment: Attachment; onRemove: () => void }) => (
  <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
    {isImageType(attachment.type) ? (
      <img src={attachment.url} alt={attachment.name} className="w-8 h-8 rounded object-cover" />
    ) : (
      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
    )}
    <span className="truncate max-w-[120px]">{attachment.name}</span>
    <span className="text-xs text-muted-foreground shrink-0">{formatFileSize(attachment.size)}</span>
    <button onClick={onRemove} className="ml-1 text-muted-foreground hover:text-foreground transition-colors">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

const PortalMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<DbConversation[]>([]);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [reactions, setReactions] = useState<DbReaction[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newConvoTitle, setNewConvoTitle] = useState("");
  const [newConvoOpen, setNewConvoOpen] = useState(false);
  const dragCounterRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("client_id", user.id)
      .order("last_message_at", { ascending: false });
    if (data) setConversations(data);
  }, [user]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (convoId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }, []);

  // Fetch reactions for current messages
  const fetchReactions = useCallback(async (messageIds: string[]) => {
    if (messageIds.length === 0) { setReactions([]); return; }
    const { data } = await supabase
      .from("message_reactions")
      .select("*")
      .in("message_id", messageIds);
    if (data) setReactions(data);
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };
    load();
  }, [fetchConversations]);

  // Auto-select first conversation
  useEffect(() => {
    if (!activeConvoId && conversations.length > 0) {
      setActiveConvoId(conversations[0].id);
    }
  }, [conversations, activeConvoId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConvoId) {
      fetchMessages(activeConvoId);
    }
  }, [activeConvoId, fetchMessages]);

  // Fetch reactions when messages change
  useEffect(() => {
    const ids = messages.map((m) => m.id);
    fetchReactions(ids);
  }, [messages, fetchReactions]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("portal-messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        fetchConversations();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const newMsg = payload.new as DbMessage;
        if (newMsg.conversation_id === activeConvoId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
        fetchConversations();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "message_reactions" }, () => {
        const ids = messages.map((m) => m.id);
        if (ids.length > 0) fetchReactions(ids);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConvoId, messages, fetchConversations, fetchReactions]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Create new conversation
  const handleCreateConversation = async () => {
    if (!user || !newConvoTitle.trim()) return;
    const { data, error } = await supabase
      .from("conversations")
      .insert({ title: newConvoTitle.trim(), client_id: user.id })
      .select()
      .single();
    if (error) {
      toast({ title: "Error", description: "Could not create conversation.", variant: "destructive" });
      return;
    }
    if (data) {
      setActiveConvoId(data.id);
      setNewConvoTitle("");
      setNewConvoOpen(false);
      await fetchConversations();
    }
  };

  // File handling (kept from original)
  const processFiles = useCallback((files: FileList | File[]) => {
    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: "File too large", description: `${file.name} exceeds the 10MB limit.`, variant: "destructive" });
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
        toast({ title: "Unsupported file type", description: `${file.name} is not a supported format.`, variant: "destructive" });
        continue;
      }
      newAttachments.push({ name: file.name, size: file.size, type: file.type, url: URL.createObjectURL(file) });
    }
    if (newAttachments.length > 0) setPendingAttachments((prev) => [...prev, ...newAttachments].slice(0, 5));
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current++; if (e.dataTransfer.types.includes("Files")) setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current--; if (dragCounterRef.current === 0) setIsDragging(false); }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current = 0; setIsDragging(false); if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files); }, [processFiles]);

  const removePendingAttachment = (index: number) => {
    setPendingAttachments((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Send message
  const handleSend = async () => {
    if (!user || !activeConvoId) return;
    const hasText = newMessage.trim().length > 0;
    const hasAttachments = pendingAttachments.length > 0;
    if (!hasText && !hasAttachments) return;

    const content = hasText
      ? newMessage.trim()
      : `📎 ${pendingAttachments.map((a) => a.name).join(", ")}`;

    setSending(true);
    setNewMessage("");
    setPendingAttachments([]);

    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConvoId,
      sender_id: user.id,
      content,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
      setSending(false);
      return;
    }

    // Update conversation's last message
    await supabase
      .from("conversations")
      .update({ last_message: content, last_message_at: new Date().toISOString() })
      .eq("id", activeConvoId);

    setSending(false);
  };

  // Handle reactions
  const handleReaction = useCallback(async (msgId: string, emoji: string) => {
    if (!user) return;
    const existing = reactions.find((r) => r.message_id === msgId && r.emoji === emoji && r.user_id === user.id);
    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({ message_id: msgId, emoji, user_id: user.id });
    }
    // Re-fetch reactions
    const ids = messages.map((m) => m.id);
    fetchReactions(ids);
  }, [user, reactions, messages, fetchReactions]);

  // Build reactions map for a message
  const getReactionsForMessage = (msgId: string): Reaction[] => {
    const msgReactions = reactions.filter((r) => r.message_id === msgId);
    const emojiMap: Record<string, string[]> = {};
    for (const r of msgReactions) {
      if (!emojiMap[r.emoji]) emojiMap[r.emoji] = [];
      emojiMap[r.emoji].push(r.user_id === user?.id ? "me" : r.user_id);
    }
    return Object.entries(emojiMap).map(([emoji, users]) => ({ emoji, users }));
  };

  const activeConvo = conversations.find((c) => c.id === activeConvoId);
  const initials = activeConvo?.title?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (msg: DbMessage) => {
    if (msg.is_read) return <CheckCheck className="w-3 h-3 text-sky-300" />;
    return <Check className="w-3 h-3 text-primary-foreground/50" />;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-card">
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" className="hidden" onChange={handleFileSelect} />

      {/* Conversation List */}
      <div className="w-80 border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Dialog open={newConvoOpen} onOpenChange={setNewConvoOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Conversation</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 pt-2">
                  <Input
                    placeholder="Conversation title..."
                    value={newConvoTitle}
                    onChange={(e) => setNewConvoTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateConversation()}
                  />
                  <Button onClick={handleCreateConversation} disabled={!newConvoTitle.trim()}>
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start a new conversation</p>
            </div>
          ) : (
            filtered.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setActiveConvoId(convo.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                  activeConvoId === convo.id && "bg-muted"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {convo.title.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{convo.title}</span>
                    {convo.last_message_at && (
                      <span className="text-xs text-muted-foreground shrink-0">{formatTime(convo.last_message_at)}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {convo.last_message || "No messages yet"}
                  </p>
                </div>
                {(convo.unread_count ?? 0) > 0 && (
                  <Badge className="bg-primary text-primary-foreground h-5 px-1.5 shrink-0">{convo.unread_count}</Badge>
                )}
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {activeConvo ? (
        <div
          className="flex-1 flex flex-col min-w-0 relative"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-primary/5 border-2 border-dashed border-primary rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <Paperclip className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-primary">Drop files here</p>
                <p className="text-xs text-muted-foreground mt-1">Images, PDFs, and documents up to 10MB</p>
              </div>
            </div>
          )}

          {/* Chat Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{activeConvo.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-5">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  const msgReactions = getReactionsForMessage(msg.id);
                  return (
                    <div key={msg.id} className={cn("flex items-end gap-1 group", isMe ? "justify-end" : "justify-start")}>
                      {isMe && (
                        <ReactionTrigger onReact={(emoji) => handleReaction(msg.id, emoji)} isMe={isMe} />
                      )}
                      <div>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2.5",
                            isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"
                          )}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={cn("flex items-center gap-1 mt-1", isMe ? "justify-end" : "justify-start")}>
                            <span className={cn("text-[10px]", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isMe && getStatusIcon(msg)}
                          </div>
                        </div>
                        <MessageReactions
                          reactions={msgReactions}
                          onReact={(emoji) => handleReaction(msg.id, emoji)}
                          isMe={isMe}
                        />
                      </div>
                      {!isMe && (
                        <ReactionTrigger onReact={(emoji) => handleReaction(msg.id, emoji)} isMe={isMe} />
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Pending Attachments */}
          {pendingAttachments.length > 0 && (
            <div className="border-t border-border px-4 py-3 flex flex-wrap gap-2">
              {pendingAttachments.map((att, i) => (
                <PendingAttachmentChip key={i} attachment={att} onRemove={() => removePendingAttachment(i)} />
              ))}
            </div>
          )}

          {/* Compose */}
          <div className="border-t border-border p-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "image/*";
                fileInputRef.current.click();
                setTimeout(() => { if (fileInputRef.current) fileInputRef.current.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"; }, 100);
              }
            }}>
              <ImageIcon className="w-5 h-5" />
            </Button>
            <EmojiPicker onEmojiSelect={(emoji) => setNewMessage((prev) => prev + emoji)} />
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" disabled={sending || (!newMessage.trim() && pendingAttachments.length === 0)}>
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Select a conversation or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalMessages;
