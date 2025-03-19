
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRoom } from "@/types/chat";
import { fetchChatRooms } from "@/services/chatService";
import ChatRoomList from "./ChatRoomList";
import ChatRoomComponent from "./ChatRoom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Chat: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find the active room object
  const activeRoom = rooms.find(room => room.id === activeRoomId);

  // Load rooms
  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const fetchedRooms = await fetchChatRooms();
      setRooms(fetchedRooms);
      
      // Select the first room if we don't have an active room
      if (fetchedRooms.length > 0 && !activeRoomId) {
        setActiveRoomId(fetchedRooms[0].id);
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
      toast({
        variant: "destructive",
        title: "Failed to load chat rooms",
        description: "Please try refreshing the page.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <h1 className="text-3xl font-serif font-medium text-espresso">Chat</h1>
        <p className="text-center text-muted-foreground mb-4">
          Please sign in to access the chat feature.
        </p>
        <Button variant="clay" onClick={() => navigate("/login")}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-3xl font-serif font-medium text-espresso mb-6">Chat</h1>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p className="text-muted-foreground">Loading chat rooms...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border rounded-lg overflow-hidden" style={{ height: "70vh" }}>
          <div className="md:col-span-1">
            <ChatRoomList
              rooms={rooms}
              activeRoomId={activeRoomId}
              onRoomSelect={setActiveRoomId}
              onRoomsUpdated={loadRooms}
            />
          </div>
          
          <div className="md:col-span-3 border-l">
            {activeRoom ? (
              <ChatRoomComponent room={activeRoom} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  {rooms.length === 0
                    ? "No chat rooms available. Create one to get started!"
                    : "Select a chat room to start messaging"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
