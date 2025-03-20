import { supabase } from "@/integrations/supabase/client";
import { ChatRoom, ChatMessage, ChatUser } from "@/types/chat";

// Helper function to check if any admin profile exists
const checkForExistingAdmins = async () => {
  const { data: existingAdmins, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1);

  if (checkError) {
    console.error("Error checking for existing admins:", checkError);
    return false;
  }

  return existingAdmins && existingAdmins.length > 0;
};

interface ChatRoomWithProfiles extends ChatRoom {
  created_by_profile: ChatUser;
  created_for_profile: ChatUser;
}

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be logged in");

  // Get current user's role
  const { data: currentUserProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    throw profileError;
  }

  // First fetch the rooms
  const { data: rooms, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }

  // Then fetch all relevant user profiles
  const userIds = new Set(
    (rooms || []).flatMap(room => [room.created_by, room.created_for])
      .filter(id => id !== null && id !== undefined) // Filter out null/undefined IDs
  );

  // If there are no valid user IDs, return empty rooms array
  if (userIds.size === 0) {
    return [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("id", Array.from(userIds));

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    throw profilesError;
  }

  // Create a map of user profiles for easy lookup
  const profileMap = (profiles || []).reduce((acc, profile) => {
    acc[profile.id] = profile;
    return acc;
  }, {} as Record<string, ChatUser>);

  if (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }

  // Transform the rooms with appropriate names
  const transformedRooms = (rooms || []).map(room => {
    const isAdmin = currentUserProfile.role === 'admin';
    const otherUserId = room.created_by === user.id ? room.created_for : room.created_by;
    
    // Skip rooms where the other user ID is null
    if (!otherUserId) {
      return room;
    }

    const otherUser = profileMap[otherUserId];

    if (!otherUser) {
      console.error(`Could not find profile for user ${otherUserId}`);
      return room;
    }

    // Always show the other person's name
    if (isAdmin) {
      // Admin is viewing: show the user's name
      room.name = otherUser.full_name || 'User';
    } else {
      // User is viewing: show the admin's name
      if (otherUser.role === 'admin') {
        room.name = otherUser.full_name || 'Admin';
      } else {
        room.name = 'Support Chat';
      }
    }

    return room;
  });

  return transformedRooms
};

export const fetchAdmins = async (): Promise<ChatUser[]> => {
  // Check for existing admins without creating a test admin
  const hasAdmins = await checkForExistingAdmins();
  if (!hasAdmins) {
    console.log("No admins found in checkForExistingAdmins");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .eq("role", "admin");

  if (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }

  console.log("Fetched admins in fetchAdmins:", {
    count: data?.length,
    admins: data?.map(admin => ({
      id: admin.id,
      full_name: admin.full_name,
      role: admin.role
    }))
  });
  
  return data || [];
};

export const fetchUsers = async (): Promise<ChatUser[]> => {
  // Fetch all profiles regardless of role
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role");

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
    .or(`and(created_by.eq.${user.id},created_for.eq.${adminId}),and(created_by.eq.${adminId},created_for.eq.${user.id})`);

  if (checkError) {
    console.error("Error checking existing chats:", checkError);
    throw checkError;
  }

  // If chat already exists, return it
  if (existingChats && existingChats.length > 0) {
    return existingChats[0];
  }

  // If no existing chat, create a new one
  let createdBy = user.id;
  let createdFor = adminId;

  // Get both user profiles to set appropriate names
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .in('id', [user.id, adminId]);

  if (profileError) {
    console.error('Error fetching profiles:', profileError);
    throw profileError;
  }

  const currentUserProfile = profiles.find(p => p.id === user.id);
  const otherUserProfile = profiles.find(p => p.id === adminId);

  if (!currentUserProfile || !otherUserProfile) {
    throw new Error('Could not find user profiles');
  }

  // Set room name based on who's creating it
  let roomName;
  if (currentUserProfile.role === 'admin') {
    // Admin is creating: show the user's name
    roomName = otherUserProfile.full_name || 'User';
  } else {
    // User is creating: show the admin's name
    roomName = otherUserProfile.role === 'admin' ? 
      (otherUserProfile.full_name || 'Admin') : 
      'Support Chat';
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
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();  // Use maybeSingle() instead of single() to handle not found case gracefully

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
