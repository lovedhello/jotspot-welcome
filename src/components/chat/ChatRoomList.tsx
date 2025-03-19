
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MessageCircle } from "lucide-react";
import { ChatRoom } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createChatRoom } from "@/services/chatService";
import { toast } from "@/hooks/use-toast";

interface ChatRoomListProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onRoomsUpdated: () => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  rooms,
  activeRoomId,
  onRoomSelect,
  onRoomsUpdated,
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

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-serif font-medium mb-4">Chat Rooms</h2>
        <form onSubmit={handleCreateRoom} className="flex gap-2">
          <Input
            placeholder="New room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            variant="clay"
            disabled={isCreatingRoom || !newRoomName.trim()}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </Button>
        </form>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {rooms.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No chat rooms available. Create one to get started!
            </div>
          ) : (
            rooms.map((room) => (
              <Button
                key={room.id}
                variant={activeRoomId === room.id ? "clay" : "ghost"}
                className="w-full justify-start mb-1 font-normal"
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
