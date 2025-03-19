import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => fetchProducts(),
    select: (data) => data.slice(0, 4), // Just take the first 4 products for now
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="bg-white py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-cream opacity-50"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sand opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm uppercase tracking-widest text-clay mb-2 font-medium">
            Handpicked for you
          </h2>
          <h3 className="text-3xl md:text-4xl font-serif font-medium text-espresso">
            Featured Products
          </h3>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-taupe" />
            </motion.div>
          </div>
        ) : isError ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 px-4 bg-red-50 rounded-lg"
          >
            <p className="text-red-600">Unable to load products. Please try again later.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.image_url}
                category={product.category}
                delay={index}
              />
            ))}
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link 
            to="/products" 
            className="group inline-flex items-center px-8 py-3 border border-taupe text-espresso rounded-md hover:bg-sand hover:border-clay transition-all duration-300"
          >
            <span>View All Products</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
