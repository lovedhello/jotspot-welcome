import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-screen bg-cream overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1597033260827-13a689abba28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          alt="Cozy crochet blankets and accessories"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/70 to-cream/20"></div>
      </motion.div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-1/4 right-[10%] w-32 h-32 rounded-full border-4 border-clay/30"
        />
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-1/4 right-[20%] w-48 h-48 rounded-full border-4 border-espresso/20"
        />
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute top-1/3 left-[5%] w-24 h-24 rounded-full bg-taupe/10"
        />
      </div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-lg">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm uppercase tracking-widest text-clay mb-2 font-medium"
            >
              Handcrafted with love
            </motion.h2>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-espresso leading-tight mb-6"
            >
              Exquisite Crochet Creations
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-taupe text-lg mb-8 max-w-md"
            >
              Discover our collection of handmade crochet pieces, each created with care and attention to detail.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link 
                to="/products" 
                className="group px-8 py-3 bg-espresso text-white rounded-md hover:bg-clay transition-all duration-300 flex items-center justify-center sm:justify-start"
              >
                <span>Shop Collection</span>
                <motion.div
                  initial={{ x: 0, opacity: 0.5 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    duration: 1.5,
                    repeatDelay: 1
                  }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </Link>
              
              <Link 
                to="/about" 
                className="px-8 py-3 border border-taupe text-espresso rounded-md hover:bg-sand hover:border-clay transition-all duration-300"
              >
                Our Story
              </Link>
            </motion.div>
            
            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
              <span className="text-xs text-taupe mb-2">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 1.5 
                }}
                className="w-6 h-10 border-2 border-taupe rounded-full flex justify-center pt-1"
              >
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    duration: 1.5 
                  }}
                  className="w-1.5 h-1.5 bg-taupe rounded-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
