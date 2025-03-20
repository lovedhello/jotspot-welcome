
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MessageCircle, X } from "lucide-react";
import { ChatRoom } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createChatRoom } from "@/services/chatService";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatRoomListProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onRoomsUpdated: () => void;
  admins: any[];
  onClose?: () => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  rooms,
  activeRoomId,
  onRoomSelect,
  onRoomsUpdated,
  admins,
  onClose,
}) => {
  const [newRoomName, setNewRoomName] = React.useState("");
  const [isCreatingRoom, setIsCreatingRoom] = React.useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    try {
      setIsCreatingRoom(true);
      // Use the exported createChatRoom function
      await createChatRoom(newRoomName);
      setNewRoomName("");
      onRoomsUpdated();
      toast({
        title: "Chat room created",
        description: `${newRoomName} has been created successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create room",
        description: "Please try again later.",
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleStartChat = async (adminId?: string) => {
    try {
      setIsCreatingRoom(true);
      // If no admins are available, create a general support chat
      if (!adminId) {
        await createChatRoom("Support Chat");
      } else {
        await createChatRoom(adminId);
      }
      onRoomsUpdated();
      toast({
        title: "Chat started",
        description: "Your support chat has been created."
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        variant: "destructive",
        title: "Failed to start chat",
        description: "Please try again later.",
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // Helper to get initials from name
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
    <div className="flex flex-col h-full bg-[#9b87f5] text-white rounded-lg">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-medium">Chat</h2>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-[#8e75e6]"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="p-4 bg-[#8e75e6] flex flex-col items-center">
        <h3 className="text-xl font-medium mb-4">Questions? Chat with us!</h3>
        <p className="mb-3 flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Typically replies within 1 minute
        </p>
        <div className="flex -space-x-4 my-3">
          {admins.slice(0, 3).map((admin, index) => (
            <Avatar key={admin.id || index} className="border-2 border-[#8e75e6]">
              <AvatarImage src={admin.avatar_url || ""} alt={admin.full_name || "Admin"} />
              <AvatarFallback className="bg-[#7e69ab] text-white">
                {getInitials(admin.full_name)}
              </AvatarFallback>
            </Avatar>
          ))}
          {admins.length === 0 && (
            <Avatar className="border-2 border-[#8e75e6]">
              <AvatarFallback className="bg-[#7e69ab] text-white">
                AD
              </AvatarFallback>
            </Avatar>
          )}
          <Avatar className="border-2 border-[#8e75e6]">
            <AvatarFallback className="bg-[#7e69ab] text-white">
              <MessageCircle className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-2">
          {rooms.length === 0 ? (
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <p>Start a conversation with an admin</p>
              <div className="mt-3 space-y-2">
                {admins.length > 0 ? (
                  admins.map(admin => (
                    <Button
                      key={admin.id}
                      variant="outline"
                      className="w-full justify-start border-white/30 text-white hover:bg-white/20"
                      onClick={() => handleStartChat(admin.id)}
                      disabled={isCreatingRoom}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={admin.avatar_url || ""} alt={admin.full_name || "Admin"} />
                        <AvatarFallback className="bg-[#7e69ab] text-white text-xs">
                          {getInitials(admin.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      {admin.full_name || "Admin"}
                    </Button>
                  ))
                ) : (
                  <div className="space-y-2">
                    <p className="text-center text-white/70 text-sm mb-2">No admins available right now</p>
                    <Button
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/20"
                      onClick={() => handleStartChat()}
                      disabled={isCreatingRoom}
                    >
                      Start a general support chat
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            rooms.map((room) => (
              <Button
                key={room.id}
                variant={activeRoomId === room.id ? "default" : "ghost"}
                className={`w-full justify-start mb-1 font-normal ${
                  activeRoomId === room.id 
                    ? "bg-white text-[#9b87f5]" 
                    : "text-white hover:bg-white/20"
                }`}
                onClick={() => onRoomSelect(room.id)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {room.name}
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatRoomList;
