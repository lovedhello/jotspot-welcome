
import React from 'react';
import { Pencil, Search, Share2, Shield, Sparkles, Smartphone } from 'lucide-react';

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
};

const Feature = ({ icon, title, description, delay }: FeatureProps) => (
  <div 
    className="flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
    style={{ animationDelay: delay }}
  >
    <div className="rounded-lg p-3 bg-blue-50 text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <Pencil size={24} />,
      title: "Rich Text Editing",
      description: "Format your notes with intuitive rich text tools for better organization and visual hierarchy.",
      delay: "0.1s"
    },
    {
      icon: <Search size={24} />,
      title: "Powerful Search",
      description: "Find what you need instantly with lightning-fast search across all your notes and notebooks.",
      delay: "0.2s"
    },
    {
      icon: <Sparkles size={24} />,
      title: "AI Assistance",
      description: "Get smart suggestions, summaries, and help formatting your content using AI technology.",
      delay: "0.3s"
    },
    {
      icon: <Shield size={24} />,
      title: "End-to-End Encryption",
      description: "Your notes are secured with enterprise-grade encryption for complete privacy and security.",
      delay: "0.4s"
    },
    {
      icon: <Share2 size={24} />,
      title: "Seamless Collaboration",
      description: "Share notes, collaborate in real-time, and control access with flexible permission settings.",
      delay: "0.5s"
    },
    {
      icon: <Smartphone size={24} />,
      title: "Multi-Device Sync",
      description: "Access your notes from any device with perfect synchronization across all platforms.",
      delay: "0.6s"
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for the way you think</h2>
          <p className="text-xl text-muted-foreground">
            Powerful features wrapped in a beautiful, intuitive interface that stays out of your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
