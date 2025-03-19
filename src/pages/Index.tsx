
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryList from '@/components/CategoryList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedProducts />
        <CategoryList />
        
        {/* Testimonials Section */}
        <section className="section bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-sm uppercase tracking-widest text-clay mb-2">
                Customer Love
              </h2>
              <h3 className="text-3xl md:text-4xl font-serif font-medium text-espresso">
                What Our Customers Say
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The crochet beanie I purchased is not only beautiful but incredibly warm. The attention to detail is remarkable!",
                  author: "Rebecca T.",
                  location: "Seattle, WA"
                },
                {
                  quote: "I ordered a custom blanket for my daughter's nursery and it exceeded all expectations. It's a family heirloom in the making.",
                  author: "Michael J.",
                  location: "Portland, OR"
                },
                {
                  quote: "The stuffed elephant I bought for my nephew is so adorable and well-made. He takes it everywhere with him!",
                  author: "Amelia R.",
                  location: "Chicago, IL"
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-cream p-6 rounded-lg"
                >
                  <svg className="h-8 w-8 text-clay mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-taupe mb-4">{testimonial.quote}</p>
                  <div>
                    <p className="font-medium text-espresso">{testimonial.author}</p>
                    <p className="text-sm text-taupe">{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="section bg-sand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="animate-slideInLeft"
              >
                <h2 className="text-sm uppercase tracking-widest text-clay mb-2">
                  Stay Connected
                </h2>
                <h3 className="text-3xl md:text-4xl font-serif font-medium text-espresso mb-4">
                  Join Our Newsletter
                </h3>
                <p className="text-taupe mb-6">
                  Subscribe to receive updates on new products, special offers, and crochet care tips.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="animate-slideInRight"
              >
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-grow px-4 py-3 border border-taupe/30 rounded-md focus:outline-none focus:ring-1 focus:ring-clay"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-espresso text-white rounded-md hover:bg-clay button-transition whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-xs text-taupe mt-2">
                  We respect your privacy and will never share your information.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
