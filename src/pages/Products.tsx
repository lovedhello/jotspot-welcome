import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

// Available categories
const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'hats', name: 'Hats' },
  { id: 'scarves', name: 'Scarves' },
  { id: 'blankets', name: 'Blankets' },
  { id: 'toys', name: 'Toys' },
  { id: 'accessories', name: 'Accessories' }
];

const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');

  // Initialize state with the URL parameter
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortOption, setSortOption] = useState('default');

  // Fetch products from Supabase
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProducts(selectedCategory !== 'all' ? selectedCategory : undefined),
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Update category from URL parameter - only when categoryParam changes
  useEffect(() => {
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam || 'all');
    }
  }, [categoryParam]);

  // Sort products when products array or sort option changes
  useEffect(() => {
    if (products && products.length > 0) {
      // Sort products based on selected sort option
      let sorted = [...products];
      if (sortOption === 'price-low-high') {
        sorted = sorted.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'price-high-low') {
        sorted = sorted.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'name-a-z') {
        sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'name-z-a') {
        sorted = sorted.sort((a, b) => b.name.localeCompare(a.name));
      }

      setFilteredProducts(sorted);
    } else {
      setFilteredProducts([]);
    }
  }, [products, sortOption]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Header */}
        <div className="bg-cream py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-espresso text-center">
              Shop Our Collection
            </h1>
          </div>
        </div>

        {/* Products Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="w-full md:w-64 shrink-0">
                <div className="sticky top-24">
                  <h3 className="font-medium text-lg text-espresso mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-taupe text-white font-medium'
                            : 'text-taupe hover:bg-sand'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                {/* Sorting and Results Count */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b">
                  <p className="text-taupe mb-4 sm:mb-0">
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" /> 
                        Loading products...
                      </span>
                    ) : (
                      `Showing ${filteredProducts.length} products`
                    )}
                  </p>
                  <div className="flex items-center">
                    <label htmlFor="sort" className="text-sm text-taupe mr-2">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="border border-sand rounded-md px-3 py-1.5 text-espresso focus:outline-none focus:ring-1 focus:ring-clay"
                    >
                      <option value="default">Featured</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="name-a-z">Name: A to Z</option>
                      <option value="name-z-a">Name: Z to A</option>
                    </select>
                  </div>
                </div>

                {/* Products */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-taupe" />
                  </div>
                ) : isError ? (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-taupe">Error loading products. Please try again.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          imageUrl={product.image_url}
                          category={product.category}
                          delay={index}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-taupe">No products found in this category.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
