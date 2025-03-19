import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com", label: "Instagram" },
    { icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, url: "https://twitter.com", label: "Twitter" }
  ];
  
  const shopLinks = [
    { name: "Hats", path: "/products?category=hats" },
    { name: "Scarves", path: "/products?category=scarves" },
    { name: "Blankets", path: "/products?category=blankets" },
    { name: "Toys", path: "/products?category=toys" },
    { name: "Accessories", path: "/products?category=accessories" }
  ];
  
  const aboutLinks = [
    { name: "Our Story", path: "/about" },
    { name: "Our Process", path: "/process" },
    { name: "Contact Us", path: "/contact" },
    { name: "Custom Orders", path: "/custom-orders" },
    { name: "FAQs", path: "/faq" }
  ];
  
  return (
    <footer className="bg-cream border-t border-sand relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full border border-taupe/20"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 rounded-full border border-clay/10"></div>
      </div>
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={footerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <motion.div variants={itemVariants} className="space-y-6 md:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-serif font-medium tracking-tight text-espresso">
                Yarn<span className="font-light">Craft</span>
              </h2>
            </Link>
            <p className="text-sm text-taupe max-w-xs leading-relaxed">
              Handcrafted crochet pieces made with love and attention to detail.
              Each item is unique and made to last.
            </p>
            <div className="flex space-x-5 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={social.label}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-taupe hover:text-espresso transition-colors duration-300 relative group"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                  <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-taupe opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1">
            <h3 className="font-medium text-espresso text-lg mb-5 relative inline-block">
              Shop
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-clay"></span>
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-taupe hover:text-espresso transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100">&bull;</span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1">
            <h3 className="font-medium text-espresso text-lg mb-5 relative inline-block">
              About
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-clay"></span>
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-taupe hover:text-espresso transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100">&bull;</span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1">
            <h3 className="font-medium text-espresso text-lg mb-5 relative inline-block">
              Newsletter
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-clay"></span>
            </h3>
            <p className="text-sm text-taupe mb-5 leading-relaxed">
              Subscribe to get updates on new products and special offers.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-taupe h-4 w-4" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full pl-10 pr-4 py-3 border border-sand bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-clay placeholder:text-taupe/60 text-sm"
                  required
                />
              </div>
              <motion.button 
                type="submit" 
                className="w-full bg-espresso text-white py-3 px-4 rounded-md hover:bg-clay transition-colors duration-300 text-sm flex items-center justify-center group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Subscribe</span>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    duration: 1.5,
                    repeatDelay: 1
                  }}
                  className="ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-16 pt-6 border-t border-sand"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-taupe flex items-center">
              &copy; {currentYear} YarnCraft. All rights reserved. Made with <Heart className="h-3 w-3 mx-1 text-clay" /> in USA
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-xs text-taupe hover:text-espresso transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-taupe hover:text-espresso transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-xs text-taupe hover:text-espresso transition-colors duration-300">
                Shipping & Returns
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
