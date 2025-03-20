
import React from "react";
import ChatWidget from "@/components/chat/ChatWidget";

const ChatPage: React.FC = () => {
  return (
    <div className="page-container py-8">
      <h1 className="text-3xl font-serif font-medium text-espresso mb-6">Chat Support</h1>
      <p className="mb-6">
        Welcome to our chat support page. You can use the chat widget in the corner of the screen to get in touch with our support team.
      </p>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-serif font-medium mb-4">How to use chat support</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Click on the chat icon in the bottom right corner</li>
          <li>Start a conversation with one of our support agents</li>
          <li>Get quick answers to your questions</li>
          <li>Our team typically responds within minutes</li>
        </ul>
      </div>
      
      {/* The chat widget should be rendered at the App level, but we'll also include it here to ensure it's visible */}
      <ChatWidget />
    </div>
  );
};

export default ChatPage;
