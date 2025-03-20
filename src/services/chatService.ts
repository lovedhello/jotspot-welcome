
import { supabase } from "@/integrations/supabase/client";
import { ChatRoom, ChatMessage, ChatUser } from "@/types/chat";

// Helper function to create an admin profile for testing if none exists
const createTestAdminIfNeeded = async () => {
  // Check if any admin exists
  const { data: existingAdmins, error: checkError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("role", "admin")
    .limit(1);
    
  if (checkError) {
    console.error("Error checking for existing admins:", checkError);
    return;
  }
  
  // If no admins found, create a test admin
  if (!existingAdmins || existingAdmins.length === 0) {
    console.log("No admins found, creating a test admin...");
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if the user has a profile
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error("Error checking user profile:", profileError);
        return;
      }
      
      if (!userProfile) {
        // Create a profile for the user if it doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            full_name: user.email?.split('@')[0] || 'Test Admin',
            role: 'admin'
          });
          
        if (insertError) {
          console.error("Error creating admin profile:", insertError);
        } else {
          console.log("Created admin profile for testing");
        }
      } else if (userProfile.role !== 'admin') {
        // Update existing profile to admin role only if not already admin
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: 'admin' })
          .eq("id", user.id);
          
        if (updateError) {
          console.error("Error updating to admin role:", updateError);
        } else {
          console.log("Updated user to admin role for testing");
        }
      } else {
        console.log("User is already an admin, no changes needed");
      }
    }
  } else {
    console.log("Admins already exist, no need to create test admin");
  }
};

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

export const fetchAdmins = async (): Promise<ChatUser[]> => {
  // Create a test admin if none exists
  await createTestAdminIfNeeded();
  
  // Use a more robust query to fetch admins
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("role", "admin");

  if (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }

  console.log("Fetched admins:", data);
  return data || [];
};

export const fetchUsers = async (): Promise<ChatUser[]> => {
  // Add a new function to fetch regular users
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("role", "user");

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  console.log("Fetched users:", data);
  return data || [];
};

export const createDirectMessageRoom = async (
  adminId: string,
  isAdminCreating: boolean = false
): Promise<ChatRoom> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in to create a chat room");

  // Check if a direct chat already exists between these users
  const { data: existingChats, error: checkError } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(`created_by.eq.${user.id},created_for.eq.${user.id}`)
    .or(`created_by.eq.${adminId},created_for.eq.${adminId}`)
    .limit(1);

  if (checkError) {
    console.error("Error checking existing chats:", checkError);
    throw checkError;
  }

  // If chat already exists, return it
  if (existingChats && existingChats.length > 0) {
    return existingChats[0];
  }

  // If no existing chat, create a new one
  let roomName = '';
  let createdBy = '';
  let createdFor = '';
  
  if (isAdminCreating) {
    // Admin creating chat with user
    roomName = `Admin Support`;
    createdBy = user.id;
    createdFor = adminId; // actually the user ID in this context
  } else {
    // User creating chat with admin
    roomName = `Admin Support`;
    createdBy = user.id;
    createdFor = adminId;
  }
  
  const { data, error } = await supabase
    .from("chat_rooms")
    .insert({ 
      name: roomName, 
      created_by: createdBy,
      created_for: createdFor,
      is_admin_created: isAdminCreating
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }

  return data;
};

// Create a general support chat when no admin is selected
export const createGeneralSupportRoom = async (): Promise<ChatRoom> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in to create a chat room");

  // Check if a general support chat already exists for this user
  const { data: existingChats, error: checkError } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("created_by", user.id)
    .eq("name", "Support Chat")
    .limit(1);

  if (checkError) {
    console.error("Error checking existing chats:", checkError);
    throw checkError;
  }

  // If chat already exists, return it
  if (existingChats && existingChats.length > 0) {
    return existingChats[0];
  }

  // Create a new general support chat
  const { data, error } = await supabase
    .from("chat_rooms")
    .insert({ 
      name: "Support Chat", 
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

// Export createChatRoom that handles both cases
export const createChatRoom = async (adminIdOrRoomName: string): Promise<ChatRoom> => {
  // If it looks like a UUID, treat it as an admin ID
  if (adminIdOrRoomName.length === 36 && adminIdOrRoomName.includes('-')) {
    return createDirectMessageRoom(adminIdOrRoomName);
  } else if (adminIdOrRoomName === "Support Chat") {
    return createGeneralSupportRoom();
  } else {
    // Legacy support for creating a room with just a name
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in to create a chat room");
    
    const { data, error } = await supabase
      .from("chat_rooms")
      .insert({ 
        name: adminIdOrRoomName, 
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }

    return data;
  }
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
  // Use maybeSingle() instead of single() to handle non-existent users
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();

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
