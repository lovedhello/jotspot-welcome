
import React from "react";
import ChatWidget from "@/components/chat/ChatWidget";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ChatPage: React.FC = () => {
  const [showChatWidget, setShowChatWidget] = React.useState(false);
  
  const handleOpenChat = () => {
    setShowChatWidget(true);
  };
  
  return (
    <div className="page-container py-8">
      <h1 className="text-3xl font-serif font-medium text-espresso mb-6">Chat Support</h1>
      <p className="mb-6">
        Welcome to our chat support page. You can use the chat widget in the corner of the screen or click the button below to get in touch with our support team.
      </p>
      
      <Button 
        onClick={handleOpenChat}
        className="mb-8 bg-[#9b87f5] hover:bg-[#8e75e6]"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Start a Chat
      </Button>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-serif font-medium mb-4">How to use chat support</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Click on the chat icon in the bottom right corner of any page</li>
          <li>Start a conversation with one of our support agents</li>
          <li>Get quick answers to your questions</li>
          <li>Our team typically responds within minutes</li>
        </ul>
      </div>
      
      {/* The chat widget is rendered at the App level, but we'll show it here if the button is clicked */}
      {showChatWidget && <ChatWidget initialOpen={true} />}
    </div>
  );
};

export default ChatPage;
