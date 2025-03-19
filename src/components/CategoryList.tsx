
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Static category data (images and names)
const categoryInfo = [
  {
    id: 'hats',
    name: 'Hats',
    imageUrl: 'https://images.unsplash.com/photo-1530735038726-a73fd6e6c31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'blankets',
    name: 'Blankets',
    imageUrl: 'https://images.unsplash.com/photo-1580301762395-20a3d3fe890b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'scarves',
    name: 'Scarves',
    imageUrl: 'https://images.unsplash.com/photo-1609803384069-19f3e3a15121?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'toys',
    name: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  }
];

const CategoryList = () => {
  // Fetch all products to calculate category counts
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => fetchProducts(),
  });

  // Calculate category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    
    products.forEach(product => {
      if (product.category) {
        counts[product.category] = (counts[product.category] || 0) + 1;
      }
    });
    
    return counts;
  }, [products]);

  // Combine static category info with dynamic counts
  const categories = React.useMemo(() => {
    return categoryInfo.map(category => ({
      ...category,
      count: categoryCounts[category.id] || 0
    }));
  }, [categoryCounts]);

  return (
    <section className="bg-cream section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase tracking-widest text-clay mb-2">
            Browse by category
          </h2>
          <h3 className="text-3xl md:text-4xl font-serif font-medium text-espresso">
            Our Collections
          </h3>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-taupe" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={`/products?category=${category.id}`}
                  className="group relative rounded-lg overflow-hidden hover-lift card-shadow block"
                >
                  <div className="aspect-square w-full">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-espresso/30 group-hover:bg-espresso/40 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <h4 className="text-2xl font-serif font-medium mb-1">{category.name}</h4>
                      <p className="text-sm">{category.count} products</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList;
