
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MinusIcon, PlusIcon, ShoppingBag, Heart, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProductById, fetchProducts, Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart(); // Changed from addToCart to addItem
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch product details from Supabase
  const { 
    data: product, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id || ''),
    enabled: !!id,
  });

  // Fetch related products from Supabase
  const { 
    data: relatedProducts = [] 
  } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: () => fetchProducts(product?.category),
    enabled: !!product?.category,
    select: (data) => data.filter(p => p.id !== id).slice(0, 3),
  });

  // Set default selected color if not set yet
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  // Handlers
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      // Fixed: Remove the quantity property from the object passed to addItem
      // The addItem function will set quantity=1 by default (for new items)
      // or increment quantity (for existing items)
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        color: selectedColor,
      };
      
      // Adding the item multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem(itemToAdd);
      }
      
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-taupe" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-espresso mb-4">Product Not Found</h1>
            <p className="text-taupe mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products" className="inline-block px-6 py-3 bg-espresso text-white rounded-md hover:bg-clay button-transition">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const gallery = product.gallery || [product.image_url];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-taupe">
            <ol className="flex">
              <li className="flex items-center">
                <Link to="/" className="hover:text-espresso button-transition">Home</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link to="/products" className="hover:text-espresso button-transition">Shop</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link to={`/products?category=${product.category}`} className="hover:text-espresso button-transition capitalize">
                  {product.category}
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-espresso font-medium truncate">{product.name}</li>
            </ol>
          </nav>
        </div>

        {/* Product Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-white card-shadow">
                <div className="relative" style={{ maxHeight: '600px' }}>
                  <img
                    src={gallery[selectedImage]}
                    alt={product.name}
                    className="w-full h-auto object-contain max-h-[600px] mx-auto"
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
              {gallery.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {gallery.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 h-24 w-24 border rounded-md overflow-hidden ${
                        selectedImage === index ? 'border-clay' : 'border-sand'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <div className="h-full w-full">
                        <img
                          src={image}
                          alt={`${product.name} - view ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="animate-slideInRight">
              <h1 className="text-3xl font-serif font-medium text-espresso mb-2">{product.name}</h1>
              <p className="text-2xl text-espresso mb-4">${product.price.toFixed(2)}</p>
              
              <p className="text-taupe mb-6">
                {product.description}
              </p>

              <div className="space-y-6 mb-8">
                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="font-medium text-espresso mb-2">Color</h3>
                    <div className="flex space-x-3">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1 border rounded-md ${
                            selectedColor === color
                              ? 'border-clay bg-clay/10 text-espresso'
                              : 'border-sand text-taupe hover:border-taupe'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <h3 className="font-medium text-espresso mb-2">Quantity</h3>
                  <div className="flex items-center border border-sand rounded-md w-36">
                    <button
                      onClick={decreaseQuantity}
                      className="px-3 py-2 text-taupe hover:text-espresso button-transition"
                      disabled={quantity <= 1}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="px-3 py-2 text-taupe hover:text-espresso button-transition"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-espresso hover:bg-clay text-white px-6 py-3 rounded-md button-transition flex items-center justify-center space-x-2"
                  disabled={!product.in_stock}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{product.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
                <button
                  className="px-6 py-3 border border-sand rounded-md hover:bg-sand button-transition flex items-center justify-center space-x-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Add to Wishlist</span>
                </button>
              </div>

              {/* Product Details */}
              {(product.materials || product.care_instructions) && (
                <div className="border-t border-sand pt-6">
                  {product.materials && (
                    <div className="mb-4">
                      <h3 className="font-medium text-espresso">Material</h3>
                      <p className="text-taupe">{product.materials}</p>
                    </div>
                  )}
                  {product.care_instructions && (
                    <div>
                      <h3 className="font-medium text-espresso">Care</h3>
                      <p className="text-taupe">{product.care_instructions}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-serif font-medium text-espresso mb-8 text-center">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {relatedProducts.map((product, index) => (
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
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
