
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  className?: string;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  category,
  className,
  delay = 0
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Handle wishlist button click
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Stop event bubbling
    
    toast({
      title: "Added to Wishlist",
      description: `${name} has been added to your wishlist`,
    });
  };
  
  // Handle add to cart button click
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Stop event bubbling
    
    addItem({
      id,
      name,
      price,
      image: imageUrl
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <Link to={`/product/${id}`} className="relative overflow-hidden">
        <div className="aspect-square w-full overflow-hidden bg-cream">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Quick action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-espresso hover:text-clay transition-colors"
            aria-label="Add to wishlist"
            onClick={handleWishlistClick}
          >
            <Heart className="h-5 w-5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-espresso flex items-center justify-center text-white hover:bg-clay transition-colors"
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2 py-1 text-xs bg-white/80 backdrop-blur-sm rounded-full text-espresso font-medium">
            {category}
          </span>
        </div>
      </Link>
      
      <div className="flex flex-col p-4">
        <Link to={`/product/${id}`} className="group-hover:text-clay transition-colors">
          <h3 className="font-medium text-espresso text-lg truncate">{name}</h3>
        </Link>
        <div className="mt-2 font-medium text-espresso">${price.toFixed(2)}</div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
