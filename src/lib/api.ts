
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url: string;
  gallery: string[];
  category: string;
  in_stock: boolean;
  colors?: string[];
  materials?: string;
  care_instructions?: string;
}

export async function fetchProducts(category?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Could not load products. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    toast({
      title: 'Error',
      description: 'Could not load products. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Could not load product details. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
    
    return data as Product;
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    toast({
      title: 'Error',
      description: 'Could not load product details. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
}

export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast({
        title: 'Error',
        description: 'Could not upload image. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    toast({
      title: 'Error',
      description: 'Could not upload image. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Could not create product. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
    
    toast({
      title: 'Success',
      description: 'Product created successfully!',
    });
    
    return data as Product;
  } catch (error) {
    console.error('Error in createProduct:', error);
    toast({
      title: 'Error',
      description: 'Could not create product. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Could not update product. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
    
    toast({
      title: 'Success',
      description: 'Product updated successfully!',
    });
    
    return data as Product;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    toast({
      title: 'Error',
      description: 'Could not update product. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Could not delete product. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
    
    toast({
      title: 'Success',
      description: 'Product deleted successfully!',
    });
    
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    toast({
      title: 'Error',
      description: 'Could not delete product. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
}
