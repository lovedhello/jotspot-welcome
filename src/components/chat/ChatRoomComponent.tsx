
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessageItem from "./ChatMessageItem";
import { ChatMessage, ChatRoom, ChatUser } from "@/types/chat";
import { fetchChatMessages, sendChatMessage, subscribeToMessages, getChatUser } from "@/services/chatService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";

interface ChatRoomProps {
  room: ChatRoom;
}

const ChatRoomComponent: React.FC<ChatRoomProps> = ({ room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [users, setUsers] = useState<Record<string, ChatUser | null>>({});
  const [chatPartner, setChatPartner] = useState<ChatUser | null>(null);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const messages = await fetchChatMessages(room.id);
        setMessages(messages);
        
        // Fetch user info for each unique user
        const userIds = Array.from(new Set(messages.map(msg => msg.user_id)));
        await loadUserData(userIds);
        
        // Determine chat partner
        if (user) {
          // If admin, the partner is created_by or created_for, whichever is not the admin
          // If user, the partner is the admin (which could be either created_by or created_for)
          const partnerId = isAdmin 
            ? (room.created_by === user.id ? room.created_for : room.created_by)
            : (room.created_by === user.id ? room.created_for : room.created_by);
          
          if (partnerId) {
            try {
              const partnerData = await getChatUser(partnerId);
              setChatPartner(partnerData);
            } catch (error) {
              console.error("Error fetching chat partner:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          variant: "destructive",
          title: "Failed to load messages",
          description: "Please try refreshing the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [room.id, user, isAdmin]);

  // Helper function to load user data
  const loadUserData = async (userIds: string[]) => {
    try {
      const userPromises = userIds.map(async (id) => {
        try {
          const userData = await getChatUser(id);
          return { id, data: userData };
        } catch (error) {
          console.error(`Error fetching user ${id}:`, error);
          return { id, data: null };
        }
      });
      
      const userResults = await Promise.all(userPromises);
      
      // Update the users state with the fetched data
      setUsers(prev => {
        const newUsers = { ...prev };
        userResults.forEach(({ id, data }) => {
          newUsers[id] = data;
        });
        return newUsers;
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Subscribe to new messages
  useEffect(() => {
    const cleanup = subscribeToMessages(room.id, async (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      
      // Fetch user info if we don't have it yet
      if (!users[newMessage.user_id]) {
        try {
          const userData = await getChatUser(newMessage.user_id);
          setUsers(prev => ({
            ...prev,
            [newMessage.user_id]: userData
          }));
        } catch (error) {
          console.error(`Error fetching user ${newMessage.user_id}:`, error);
        }
      }
    });
    
    return cleanup;
  }, [room.id, users]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    try {
      setIsSending(true);
      await sendChatMessage(room.id, message);
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-serif font-medium">
          {chatPartner ? `Chat with ${chatPartner.full_name || 'User'}` : room.name}
        </h2>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center p-4">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessageItem 
                key={msg.id} 
                message={msg} 
                user={users[msg.user_id]} 
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t mt-auto">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            disabled={!message.trim() || isSending}
            variant="clay"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoomComponent;
