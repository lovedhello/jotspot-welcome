import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRoom, ChatUser, ChatMessage } from "@/types/chat";
import { 
  fetchChatRooms, 
  fetchAdmins, 
  fetchUsers, 
  createDirectMessageRoom,
  fetchChatMessages,
  sendChatMessage,
  subscribeToMessages,
  getChatUser
} from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, SendIcon, X, Smile, Paperclip, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatRoomList from "./ChatRoomList";

interface ChatWidgetProps {
  initialOpen?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(!initialOpen);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [admins, setAdmins] = useState<ChatUser[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userMap, setUserMap] = useState<Record<string, ChatUser | null>>({});

  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Get active room
  const activeRoom = rooms.find(room => room.id === activeRoomId);

  // Load rooms
  const loadRooms = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const fetchedRooms = await fetchChatRooms();
      
      // Filter rooms based on user role
      if (!isAdmin) {
        // For regular users, only show rooms where they are involved
        const userRooms = fetchedRooms.filter(room => 
          room.created_by === user.id || room.created_for === user.id
        );
        setRooms(userRooms);
      } else {
        // For admins, show all rooms
        setRooms(fetchedRooms);
      }
      
      // Load appropriate contacts
      if (isAdmin) {
        const usersList = await fetchUsers();
        setUsers(usersList);
      } else {
        const adminsList = await fetchAdmins();
        setAdmins(adminsList);
      }
      
      // Auto-select first room if available
      if (fetchedRooms.length > 0 && !activeRoomId) {
        const firstRoom = isAdmin 
          ? fetchedRooms[0]
          : fetchedRooms.filter(room => room.created_by === user.id || room.created_for === user.id)[0];
        
        if (firstRoom) {
          setActiveRoomId(firstRoom.id);
          await loadMessages(firstRoom.id);
        }
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

  // Load messages for a room
  const loadMessages = async (roomId: string) => {
    try {
      const fetchedMessages = await fetchChatMessages(roomId);
      setMessages(fetchedMessages);
      
      // Load user data for messages
      const userIds = Array.from(new Set(fetchedMessages.map(msg => msg.user_id)));
      await loadUserData(userIds);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };
  
  // Load user data
  const loadUserData = async (userIds: string[]) => {
    const userPromises = userIds.map(id => getChatUser(id));
    const userData = await Promise.all(userPromises);
    
    const newUserMap: Record<string, ChatUser | null> = {};
    userIds.forEach((id, index) => {
      newUserMap[id] = userData[index];
    });
    
    setUserMap(prev => ({ ...prev, ...newUserMap }));
  };
  
  // Effect to load rooms when user changes
  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user, isAdmin]);
  
  // Effect to load messages when room changes
  useEffect(() => {
    if (activeRoomId) {
      loadMessages(activeRoomId);
    }
  }, [activeRoomId]);
  
  // Subscribe to new messages
  useEffect(() => {
    if (!activeRoomId) return;
    
    const cleanup = subscribeToMessages(activeRoomId, async (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      
      // Load user data if needed
      if (!userMap[newMessage.user_id]) {
        const userData = await getChatUser(newMessage.user_id);
        setUserMap(prev => ({
          ...prev,
          [newMessage.user_id]: userData
        }));
      }
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
    
    return cleanup;
  }, [activeRoomId, userMap]);
  
  // Handle send message
  const handleSendMessage = async () => {
    if (!activeRoomId || !message.trim() || !user) return;
    
    try {
      setIsSending(true);
      await sendChatMessage(activeRoomId, message);
      setMessage("");
      textareaRef.current?.focus();
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
  
  // Toggle chat widget
  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsMinimized(!isMinimized);
    }
  };
  
  // Close chat widget
  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };
  
  // Format message time
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle key press in textarea
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Effect for initialOpen prop
  useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [initialOpen]);
  
  if (!user) {
    return null; // Don't show chat widget for logged out users
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Main Chat Window */}
      {isOpen && !isMinimized && (
        <div className="bg-white rounded-lg shadow-xl mb-4 w-[350px] h-[500px] flex flex-col overflow-hidden">
          {!activeRoomId ? (
            <ChatRoomList
              rooms={rooms}
              activeRoomId={activeRoomId}
              onRoomSelect={setActiveRoomId}
              onRoomsUpdated={loadRooms}
              admins={admins}
              onClose={closeChat}
            />
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3 bg-[#9b87f5] text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-[#8e75e6] mr-1 h-8 w-8 p-0" 
                    onClick={() => setActiveRoomId(null)}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                  <span className="font-medium">{activeRoom?.name || "Chat"}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-[#8e75e6] h-8 w-8"
                  onClick={closeChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Message List */}
              <ScrollArea className="flex-1 p-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageCircle className="h-12 w-12 text-[#9b87f5] mb-2 opacity-50" />
                    <p className="text-sm text-gray-500">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isOwnMessage = msg.user_id === user.id;
                      const messageUser = userMap[msg.user_id];
                      
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwnMessage && (
                            <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                              <AvatarImage 
                                src={messageUser?.avatar_url || ""} 
                                alt={messageUser?.full_name || "User"} 
                              />
                              <AvatarFallback className="bg-[#7e69ab] text-white text-xs">
                                {getInitials(messageUser?.full_name)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`max-w-[75%] ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                            <div 
                              className={`px-3 py-2 rounded-lg ${
                                isOwnMessage 
                                  ? 'bg-[#9b87f5] text-white rounded-br-none' 
                                  : 'bg-gray-100 rounded-bl-none'
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div 
                              className={`text-xs text-gray-500 mt-1 ${
                                isOwnMessage ? 'text-right' : 'text-left'
                              }`}
                            >
                              {formatMessageTime(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-3 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 min-h-[60px] resize-none"
                    ref={textareaRef}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!message.trim() || isSending} 
                    size="icon"
                    className="bg-[#9b87f5] hover:bg-[#8e75e6] text-white h-10 w-10"
                  >
                    <SendIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center mt-2 text-gray-400">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={`rounded-full h-14 w-14 flex items-center justify-center shadow-lg ${
          isOpen && isMinimized
            ? "bg-gray-400 hover:bg-gray-500"
            : "bg-[#9b87f5] hover:bg-[#8e75e6]"
        }`}
      >
        {isOpen && isMinimized ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default ChatWidget;
