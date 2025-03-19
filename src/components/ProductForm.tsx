
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Plus, X } from 'lucide-react';
import { createProduct, updateProduct, uploadProductImage, Product } from '@/lib/api';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductFormProps {
  product: Product | null;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || '');
  const [materials, setMaterials] = useState(product?.materials || '');
  const [careInstructions, setCareInstructions] = useState(product?.care_instructions || '');
  const [inStock, setInStock] = useState(product?.in_stock !== false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(product?.gallery || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [newColor, setNewColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      blobUrls.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [blobUrls]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      try {
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
          setBlobUrls(prev => prev.filter(url => url !== imagePreview));
        }
        
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
        setBlobUrls(prev => [...prev, objectUrl]);
      } catch (error) {
        console.error('Error creating image preview:', error);
      }
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...newFiles]);
      
      try {
        const newPreviews = newFiles.map(file => {
          const objectUrl = URL.createObjectURL(file);
          setBlobUrls(prev => [...prev, objectUrl]);
          return objectUrl;
        });
        
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
      } catch (error) {
        console.error('Error creating gallery previews:', error);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    const urlToRemove = galleryPreviews[index];
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
      setBlobUrls(prev => prev.filter(url => url !== urlToRemove));
    }
    
    const updatedPreviews = [...galleryPreviews];
    updatedPreviews.splice(index, 1);
    setGalleryPreviews(updatedPreviews);

    if (index < galleryFiles.length) {
      const updatedFiles = [...galleryFiles];
      updatedFiles.splice(index, 1);
      setGalleryFiles(updatedFiles);
    }
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let mainImageUrl = product?.image_url || '';
      if (imageFile) {
        const uploadedUrl = await uploadProductImage(imageFile);
        if (uploadedUrl) {
          mainImageUrl = uploadedUrl;
        }
      }

      let galleryUrls = [...galleryPreviews.filter(url => !url.startsWith('blob:'))];
      
      const fileToPreviewMap = new Map();
      galleryFiles.forEach(file => {
        const blobUrl = blobUrls.find(url => 
          galleryPreviews.includes(url) && !galleryUrls.includes(url)
        );
        if (blobUrl) {
          fileToPreviewMap.set(file, blobUrl);
        }
      });
      
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const uploadedUrl = await uploadProductImage(file);
          if (uploadedUrl) {
            galleryUrls.push(uploadedUrl);
          }
        }
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        alert('Please enter a valid price');
        setIsSubmitting(false);
        return;
      }

      const productData = {
        name,
        price: parsedPrice,
        description,
        category,
        materials,
        care_instructions: careInstructions,
        in_stock: inStock,
        image_url: mainImageUrl,
        gallery: galleryUrls,
        colors,
      };

      let success;
      if (product) {
        success = await updateProduct(product.id, productData);
      } else {
        success = await createProduct(productData);
      }

      if (success) {
        blobUrls.forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            Product Name *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="E.g., Cozy Beanie Hat"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            Price *
          </label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="29.99"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-espresso mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product..."
            rows={4}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-input rounded-md px-3 py-2"
            required
          >
            <option value="">Select a category</option>
            <option value="hats">Hats</option>
            <option value="scarves">Scarves</option>
            <option value="blankets">Blankets</option>
            <option value="toys">Toys</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            In Stock
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-taupe">
              {inStock ? 'Product is available for purchase' : 'Product is out of stock'}
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            Materials
          </label>
          <Input
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="E.g., 100% Merino wool"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            Care Instructions
          </label>
          <Input
            value={careInstructions}
            onChange={(e) => setCareInstructions(e.target.value)}
            placeholder="E.g., Hand wash cold, lay flat to dry"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-espresso mb-1">
            Available Colors
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colors.map((color, index) => (
              <div 
                key={index}
                className="flex items-center bg-sand px-3 py-1 rounded-full"
              >
                <span className="text-sm">{color}</span>
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="ml-2 text-taupe hover:text-clay"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Add a color (e.g., Natural, Blue)"
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={addColor}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-espresso mb-1">
            Main Product Image *
          </label>
          <div className="flex items-start space-x-4">
            {imagePreview && (
              <div className="relative w-24 h-24 rounded overflow-hidden bg-gray-100">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-grow">
              <label className="flex flex-col items-center px-4 py-6 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <Upload className="h-5 w-5 text-taupe mb-2" />
                <span className="text-sm text-taupe">Upload image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!product?.image_url}
                />
              </label>
              <p className="text-xs text-taupe mt-1">
                Recommended: 800x800px. JPG, PNG, or WebP. Images will be displayed in their original aspect ratio.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-espresso mb-1">
            Gallery Images
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24 rounded overflow-hidden bg-gray-100">
                <img
                  src={preview}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                >
                  <X className="h-3 w-3 text-taupe" />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-24 h-24 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <Plus className="h-5 w-5 text-taupe mb-1" />
              <span className="text-xs text-taupe">Add Image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-espresso hover:bg-clay"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>Save Product</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
