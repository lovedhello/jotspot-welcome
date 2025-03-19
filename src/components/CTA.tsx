
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-50 to-transparent"></div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl overflow-hidden">
          <div className="p-12 md:p-16 text-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Start capturing your best ideas today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their note-taking experience with Noterra's beautiful, distraction-free interface.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base"
                >
                  Get Started Free
                  <ArrowRight size={18} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  View Pricing
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required · Free 14-day trial · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
