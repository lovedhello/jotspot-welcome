
import React from "react";
import ChatWidget from "./ChatWidget";

const Chat: React.FC = () => {
  return (
    <div className="page-container py-8">
      <h1 className="text-3xl font-serif font-medium text-espresso mb-6">Chat Support</h1>
      <p className="mb-6">
        Need help? Our team is ready to assist you. Use the chat widget in the bottom right corner to start a conversation with our support team.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-serif font-medium mb-4">How to use chat support</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Click on the chat icon in the bottom right corner</li>
            <li>Start a conversation with one of our support agents</li>
            <li>Get quick answers to your questions</li>
            <li>Our team typically responds within minutes</li>
          </ul>
        </div>
        
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-serif font-medium mb-4">Support Hours</h2>
          <p className="mb-3">Our chat support is available:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Monday - Friday: 9am - 5pm EST</li>
            <li>Saturday: 10am - 2pm EST</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>
      
      <ChatWidget />
    </div>
  );
};

export default Chat;
