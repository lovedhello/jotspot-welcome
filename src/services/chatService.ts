
import { supabase } from "@/integrations/supabase/client";
import { ChatRoom, ChatMessage, ChatUser } from "@/types/chat";

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }

  return data || [];
};

export const createChatRoom = async (name: string): Promise<ChatRoom> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in to create a chat room");

  const { data, error } = await supabase
    .from("chat_rooms")
    .insert({ 
      name, 
      created_by: user.id 
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }

  return data;
};

export const fetchChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  return data || [];
};

export const sendChatMessage = async (roomId: string, content: string): Promise<ChatMessage> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in to send a message");

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ 
      room_id: roomId, 
      content,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }

  return data;
};

export const getChatUser = async (userId: string): Promise<ChatUser | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
};

export const subscribeToMessages = (
  roomId: string,
  callback: (message: ChatMessage) => void
) => {
  const channel = supabase
    .channel(`room_${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
