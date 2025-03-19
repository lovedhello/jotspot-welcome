
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center justify-center p-6">
      <div className="w-24 h-24 mb-8 relative">
        <div className="absolute inset-0 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="relative z-10 w-full h-full bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center">
          <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">404</span>
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Page not found</h1>
      
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      
      <Button 
        onClick={() => window.location.href = '/'} 
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        <ArrowLeft size={18} className="mr-2" />
        Return to Home
      </Button>
    </div>
  );
};

export default NotFound;
