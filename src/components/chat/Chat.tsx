
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRoom, ChatUser } from "@/types/chat";
import { fetchChatRooms, fetchAdmins, createDirectMessageRoom } from "@/services/chatService";
import ChatRoomList from "./ChatRoomList";
import ChatRoomComponent from "./ChatRoom";
import { Button } from "@/components/ui/button";
import { LogIn, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Chat: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [admins, setAdmins] = useState<ChatUser[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const { user } = useAuth();
  const { isAdmin, loading: adminCheckLoading } = useAdmin();
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

      // If admin, fetch list of users they can message
      if (isAdmin) {
        const { data: usersList, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .neq("role", "admin");
        
        if (!error) {
          setUsers(usersList || []);
        }
      } else {
        // If regular user, fetch admins they can message
        const adminsList = await fetchAdmins();
        setAdmins(adminsList);
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
    if (user && !adminCheckLoading) {
      loadRooms();
    }
  }, [user, adminCheckLoading, isAdmin]);

  const handleStartDirectMessage = async (userId: string) => {
    try {
      const newRoom = await createDirectMessageRoom(userId, isAdmin);
      
      // Refresh rooms list and set active room
      await loadRooms();
      setActiveRoomId(newRoom.id);
      
      toast({
        title: "Chat started",
        description: "You can now send messages",
      });
    } catch (error) {
      console.error("Error starting direct message:", error);
      toast({
        variant: "destructive",
        title: "Failed to start chat",
        description: "Please try again later.",
      });
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
      <h1 className="text-3xl font-serif font-medium text-espresso mb-6">
        {isAdmin ? "User Support Chats" : "Chat with Admin"}
      </h1>
      
      {isLoading || adminCheckLoading ? (
        <div className="flex justify-center p-8">
          <p className="text-muted-foreground">Loading chats...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border rounded-lg overflow-hidden" style={{ height: "70vh" }}>
          <div className="md:col-span-1 flex flex-col border-r">
            {/* Active chats section */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-serif font-medium mb-4">
                {isAdmin ? "Active Chats" : "Support Chats"}
              </h2>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2">
                {rooms.length === 0 ? (
                  <div className="text-center p-4 text-muted-foreground">
                    {isAdmin 
                      ? "No active support chats."
                      : "No support chats yet. Start one with an admin below."}
                  </div>
                ) : (
                  rooms.map((room) => (
                    <Button
                      key={room.id}
                      variant={activeRoomId === room.id ? "clay" : "ghost"}
                      className="w-full justify-start mb-1 font-normal"
                      onClick={() => setActiveRoomId(room.id)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {room.name}
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
            
            {/* Contact options section */}
            <div className="p-4 border-t">
              <h3 className="font-medium mb-2">
                {isAdmin ? "All Users" : "Contact Support"}
              </h3>
              <ScrollArea className="h-48">
                {isAdmin ? (
                  users.length > 0 ? (
                    users.map(user => (
                      <div 
                        key={user.id} 
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleStartDirectMessage(user.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                          <AvatarFallback className="bg-taupe text-espresso text-xs">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.full_name || "Anonymous User"}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">No users available</p>
                  )
                ) : (
                  admins.length > 0 ? (
                    admins.map(admin => (
                      <div 
                        key={admin.id} 
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleStartDirectMessage(admin.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={admin.avatar_url || ""} alt={admin.full_name || ""} />
                          <AvatarFallback className="bg-taupe text-espresso text-xs">
                            {getInitials(admin.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{admin.full_name || "Admin"}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">No admins available</p>
                  )
                )}
              </ScrollArea>
            </div>
          </div>
          
          <div className="md:col-span-3 border-l">
            {activeRoom ? (
              <ChatRoomComponent room={activeRoom} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  {rooms.length === 0
                    ? isAdmin 
                      ? "No active support chats. Click on a user to start chatting."
                      : "No active support chats. Start one with an admin."
                    : "Select a chat to start messaging"}
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
