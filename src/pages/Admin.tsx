import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchProducts, deleteProduct, Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil, Trash2, Plus, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '@/components/ProductForm';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '../hooks/use-admin';

const Admin = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: isAdminLoading } = useAdmin();

  // Fetch all products
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => fetchProducts(),
  });

  // Filter products by search term
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.category?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(id);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      }
    }
  };

  // If loading admin status, show loading indicator
  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-taupe mx-auto mb-4" />
            <p className="text-taupe">Checking access...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-espresso mb-4">Admin Access Required</h1>
            <p className="text-taupe mb-6">Please log in to access the admin area.</p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-espresso hover:bg-clay"
            >
              Log In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If user is not an admin, show access denied message
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-espresso mb-4">Access Denied</h1>
            <p className="text-taupe mb-6">You do not have permission to access the admin area.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-espresso hover:bg-clay"
            >
              Return Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-serif font-medium text-espresso mb-4 md:mb-0">
              Product Management
            </h1>
            <Button 
              onClick={() => {
                setEditingProduct(null);
                setIsAddingProduct(true);
              }}
              className="bg-espresso hover:bg-clay"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </div>
          
          {isAddingProduct || editingProduct ? (
            <div className="bg-white rounded-lg p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-espresso">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <ProductForm 
                product={editingProduct}
                onSuccess={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                  queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-taupe" />
                </div>
              ) : isError ? (
                <div className="text-center py-8">
                  <p className="text-taupe">Error loading products. Please try again.</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-taupe">No products found. {searchTerm ? 'Try a different search term.' : 'Add your first product!'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sand">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-espresso">Image</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-espresso">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-espresso">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-espresso">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-espresso">In Stock</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-espresso">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-cream/30">
                          <td className="px-4 py-3">
                            <div className="w-12 h-12 rounded overflow-hidden">
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-espresso">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-taupe">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-taupe">${product.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.in_stock 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Pencil className="h-4 w-4 text-taupe" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-clay" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
