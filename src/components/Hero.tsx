
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl lg:max-w-xl space-y-6 text-center lg:text-left">
            <div className="inline-block animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                New Release
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-up" style={{ animationDelay: '0.4s' }}>
              Capture your thoughts with elegant simplicity
            </h1>
            
            <p className="text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: '0.6s' }}>
              Noterra helps you organize your ideas, projects, and tasks with a clean, 
              distraction-free interface designed for focus and creativity.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 animate-fade-up" style={{ animationDelay: '0.8s' }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base"
              >
                Get Started Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Watch Demo
              </Button>
            </div>
            
            <div className="pt-6 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '1s' }}>
              <p className="flex items-center justify-center lg:justify-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required · Free 14-day trial
              </p>
            </div>
          </div>
          
          <div className="relative w-full max-w-xl xl:max-w-2xl animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"></div>
            <div className="absolute top-0 -right-4 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
            
            <div className="glass-card rounded-2xl overflow-hidden shadow-lg relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-50"></div>
              
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 border-b flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Notes</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Note cards */}
                <div className="space-y-4">
                  {[
                    { title: "Project Ideas", content: "1. Mobile app for plant care\n2. Smart home dashboard\n3. Writing tool with AI integration", date: "Updated 2 hours ago", color: "bg-blue-50 border-blue-100" },
                    { title: "Meeting Notes", content: "• Discussed Q3 targets\n• New feature prioritization\n• Timeline for launch: Nov 15", date: "Updated yesterday", color: "bg-purple-50 border-purple-100" },
                    { title: "Personal Goals", content: "- Read 2 books per month\n- Practice meditation daily\n- Learn Spanish", date: "Updated 3 days ago", color: "bg-green-50 border-green-100" }
                  ].map((note, index) => (
                    <div key={index} className={`${note.color} border p-4 rounded-lg`}>
                      <h3 className="font-medium mb-2">{note.title}</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{note.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
