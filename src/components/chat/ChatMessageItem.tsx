
import React from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessage, ChatUser } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessageItemProps {
  message: ChatMessage;
  user: ChatUser | null;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, user }) => {
  const { user: currentUser } = useAuth();
  const isOwnMessage = currentUser?.id === message.user_id;
  
  // Generate initials from full name
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className={cn(
        "flex w-full gap-3 mb-4",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "User"} />
        <AvatarFallback className="bg-taupe text-espresso">
          {getInitials(user?.full_name)}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwnMessage ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center mb-1 gap-2">
          <span className="text-sm font-medium">{user?.full_name || "Unknown User"}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.created_at), "h:mm a")}
          </span>
        </div>
        
        <div
          className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isOwnMessage
              ? "bg-clay text-white rounded-tr-none"
              : "bg-muted rounded-tl-none"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;
