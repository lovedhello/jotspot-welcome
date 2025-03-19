
export interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  created_for?: string;
  is_admin_created?: boolean;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface ChatUser {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}
