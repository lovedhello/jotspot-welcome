import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, LogIn, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../hooks/use-admin';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Chat", path: "/chat" },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm' 
          : 'bg-transparent py-5'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-serif font-medium tracking-tight text-espresso">
                Yarn<span className="font-light">Craft</span>
              </h1>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={link.path} 
                  className={cn(
                    "relative text-espresso hover:text-clay transition-colors duration-300 font-medium py-2",
                    location.pathname === link.path && "text-clay after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-clay after:rounded-full"
                  )}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center space-x-5"
          >
            <button 
              className="text-espresso hover:text-clay transition-colors duration-300 relative group" 
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-espresso opacity-0 group-hover:opacity-100 transition-opacity duration-300">Search</span>
            </button>
            
            {user && isAdmin && (
              <Link 
                to="/admin" 
                className="text-espresso hover:text-clay transition-colors duration-300 relative group" 
                aria-label="Admin"
              >
                <Settings className="h-5 w-5" />
                <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-espresso opacity-0 group-hover:opacity-100 transition-opacity duration-300">Admin</span>
              </Link>
            )}
            
            {user ? (
              <Link 
                to="/profile" 
                className="text-espresso hover:text-clay transition-colors duration-300 relative group" 
                aria-label="Account"
              >
                <User className="h-5 w-5" />
                <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-espresso opacity-0 group-hover:opacity-100 transition-opacity duration-300">Profile</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="text-espresso hover:text-clay transition-colors duration-300 relative group" 
                aria-label="Login"
              >
                <LogIn className="h-5 w-5" />
                <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-espresso opacity-0 group-hover:opacity-100 transition-opacity duration-300">Login</span>
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className="relative text-espresso hover:text-clay transition-colors duration-300 group" 
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-2 -right-2 bg-clay text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-espresso opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cart</span>
            </Link>
            
            <button 
              className="md:hidden text-espresso hover:text-clay transition-colors duration-300" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 pb-4 border-t overflow-hidden"
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link 
                      to={link.path} 
                      className={cn(
                        "block text-espresso hover:text-clay transition-colors duration-300 font-medium px-4 py-3 rounded-md",
                        location.pathname === link.path && "bg-cream text-clay"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                {user && isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Link 
                      to="/admin" 
                      className={cn(
                        "block text-espresso hover:text-clay transition-colors duration-300 font-medium px-4 py-3 rounded-md",
                        location.pathname === '/admin' && "bg-cream text-clay"
                      )}
                    >
                      Admin Dashboard
                    </Link>
                  </motion.div>
                )}
                
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Link 
                      to="/profile" 
                      className={cn(
                        "block text-espresso hover:text-clay transition-colors duration-300 font-medium px-4 py-3 rounded-md",
                        location.pathname === '/profile' && "bg-cream text-clay"
                      )}
                    >
                      My Account
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Link 
                        to="/login" 
                        className={cn(
                          "block text-espresso hover:text-clay transition-colors duration-300 font-medium px-4 py-3 rounded-md",
                          location.pathname === '/login' && "bg-cream text-clay"
                        )}
                      >
                        Log In
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Link 
                        to="/signup" 
                        className={cn(
                          "block text-espresso hover:text-clay transition-colors duration-300 font-medium px-4 py-3 rounded-md",
                          location.pathname === '/signup' && "bg-cream text-clay"
                        )}
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
