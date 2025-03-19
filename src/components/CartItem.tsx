
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-espresso">
            <h3>{item.name}</h3>
            <p className="ml-4">${item.price.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="text-espresso">{item.quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex">
            <Button 
              variant="ghost" 
              className="text-clay hover:text-espresso button-transition"
              onClick={() => removeItem(item.id)}
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
