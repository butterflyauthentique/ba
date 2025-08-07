'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Upload, 
  Save, 
  ArrowLeft,
  X,
  Plus,
  Trash2,
  Tag,
  DollarSign,
  Truck,
  BarChart3,
  Eye,
  Star,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  FileImage,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import AdminSidebar from '@/components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import { productService } from '@/lib/firebase';
import ImageUploader from '@/components/admin/ImageUploader';
import { ImageMetadata } from '@/lib/imageUpload';

interface ProductForm {
  // Basic Information
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  sku: string;
  barcode: string;
  
  // Categories & Organization
  category: string;
  subcategory: string;
  tags: string[];
  vendor: string;
  productType: string;
  
  // Inventory & Shipping
  stock: string;
  lowStockThreshold: string;
  weight: string;
  dimensions: string;
  shippingClass: string;
  
  // Media & Content
  images: string[];
  videos: string[];
  featuredImage: string;
  
  // Variants
  variants: Array<{
    name: string;
    price: string;
    comparePrice: string;
    sku: string;
    stock: string;
    weight: string;
    inStock: boolean;
  }>;
  
  // Status & Settings
  isActive: boolean;
  isFeatured: boolean;
  requiresShipping: boolean;
  isTaxable: boolean;
  
  // SEO
  slug: string;
  metaTitle: string;
  metaDescription: string;
  
  // Product Badges
  badges: string[];
  
  // Additional Details
  materials: string;
  artist: string;
  careInstructions: string;
  warranty: string;
}

const categories = [
  'Jewelry',
  'Paintings', 
  'Stoles',
  'Home Decor',
  'Accessories'
];

const subcategories = {
  'Jewelry': ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Anklets', 'Pendants', 'Necklace & Earrings Set', 'Necklace, Earrings & Bracelet Set'],
  'Paintings': ['Oil Paintings', 'Watercolor', 'Acrylic', 'Mixed Media', 'Digital Art', 'Traditional'],
  'Stoles': ['Silk Stoles', 'Wool Stoles', 'Cotton Stoles', 'Embroidered Stoles', 'Cashmere Stoles'],
  'Home Decor': ['Wall Art', 'Vases', 'Candles', 'Cushions', 'Rugs', 'Tableware'],
  'Accessories': ['Bags', 'Scarves', 'Belts', 'Hair Accessories', 'Jewelry Boxes']
};

const productBadges = [
  'Bestseller',
  'New Arrival', 
  'Limited Edition',
  'Staff Pick',
  'Award Winning',
  'Fast Selling',
  'Only X Left',
  'Sale',
  'Free Shipping',
  'Handmade'
];

const shippingClasses = [
  'Standard Shipping',
  'Express Shipping', 
  'Free Shipping',
  'Heavy Items',
  'Fragile Items'
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  // Removed user, getProduct, updateProduct from store - will use Firebase directly
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<ImageMetadata[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    barcode: '',
    category: '',
    subcategory: '',
    tags: [],
    vendor: '',
    productType: '',
    stock: '',
    lowStockThreshold: '',
    weight: '',
    dimensions: '',
    shippingClass: '',
    images: [],
    videos: [],
    featuredImage: '',
    variants: [],
    isActive: true,
    isFeatured: false,
    requiresShipping: true,
    isTaxable: true,
    slug: '',
    metaTitle: '',
    metaDescription: '',
    badges: [],
    materials: '',
    artist: '',
    careInstructions: '',
    warranty: ''
  });

  const productId = params.id as string;

  // Load existing product data
  useEffect(() => {
    if (productId) {
      // Load product from Firebase instead of store
      const loadProduct = async () => {
        try {
          const existingProduct = await productService.getById(productId);
          if (existingProduct) {
        setFormData({
          name: existingProduct.name || '',
          description: existingProduct.description || '',
          shortDescription: existingProduct.shortDescription || '',
          price: existingProduct.price?.toString() || '',
          comparePrice: existingProduct.comparePrice?.toString() || '',
          costPrice: existingProduct.costPrice?.toString() || '',
          sku: existingProduct.sku || '',
          barcode: existingProduct.barcode || '',
          category: existingProduct.category || '',
          subcategory: existingProduct.subcategory || '',
          tags: existingProduct.tags || [],
          vendor: existingProduct.vendor || '',
          productType: existingProduct.productType || '',
          stock: existingProduct.stock?.toString() || '',
          lowStockThreshold: existingProduct.lowStockThreshold?.toString() || '',
          weight: existingProduct.weight || '',
          dimensions: existingProduct.dimensions || '',
          shippingClass: existingProduct.shippingClass || '',
          images: existingProduct.images?.map(img => typeof img === 'string' ? img : img.url) || [],
          videos: [], // Videos not supported in current Product interface
          featuredImage: '', // featuredImage not in current Product interface
          variants: existingProduct.variants?.map(v => ({
            name: v.name,
            price: v.price?.toString() || '',
            comparePrice: '', // comparePrice not in current variant interface
            sku: v.sku || '',
            stock: v.stock?.toString() || '',
            weight: '', // weight not in current variant interface
            inStock: v.stock > 0
          })) || [],
          isActive: existingProduct.isActive ?? true,
          isFeatured: existingProduct.isFeatured ?? false,
          requiresShipping: existingProduct.requiresShipping ?? true,
          isTaxable: existingProduct.isTaxable ?? true,
          slug: existingProduct.slug || '',
          metaTitle: existingProduct.metaTitle || '',
          metaDescription: existingProduct.metaDescription || '',
          badges: existingProduct.badges || [],
          materials: existingProduct.materials || '',
          artist: existingProduct.artist || '',
          careInstructions: existingProduct.careInstructions || '',
          warranty: existingProduct.warranty || ''
        });
                } else {
            toast.error('Product not found');
            router.push('/admin/products');
          }
        } catch (error) {
          console.error('Error loading product:', error);
          toast.error('Failed to load product');
          router.push('/admin/products');
        }
      };
      
      loadProduct();
    }
  }, [productId, router]);

  // Enhanced validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Product description is required';
    }

    if (!formData.shortDescription.trim()) {
      errors.shortDescription = 'Short description is required';
    }

    // Price validation
    if (formData.comparePrice && parseFloat(formData.comparePrice) <= parseFloat(formData.price)) {
      errors.comparePrice = 'Compare price must be higher than selling price';
    }

    // Stock validation
    if (formData.stock && parseInt(formData.stock) < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    // Image validation
    if (formData.images.length === 0) {
      errors.images = 'At least one product image is required';
    }

    // URL validation for images
    formData.images.forEach((image, index) => {
      try {
        new URL(image);
      } catch {
        errors[`image-${index}`] = 'Invalid image URL';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle image uploads
  const handleImagesUploaded = (images: ImageMetadata[]) => {
    setUploadedImages(prev => [...prev, ...images]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...images.map(img => img.url)]
    }));
  };

  const handleImagesRemoved = async (imageIds: string[]) => {
    try {
      // Remove from uploaded images state
      const removedImages = uploadedImages.filter(img => imageIds.includes(img.id));
      setUploadedImages(prev => prev.filter(img => !imageIds.includes(img.id)));
      
      // Remove from form data
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, index) => !imageIds.includes(uploadedImages[index]?.id || ''))
      }));
      
      // Delete from Firebase Storage
      const { ImageUploadService } = await import('@/lib/imageUpload');
      
      try {
        await ImageUploadService.deleteImagesFromUrls(removedImages.map(img => img.url));
      } catch (deleteError) {
        console.warn('Some images failed to delete from storage:', deleteError);
      }
      
      toast.success('Images removed successfully');
    } catch (error) {
      console.error('Error removing images:', error);
      toast.error('Failed to remove images');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    const tag = prompt('Enter tag:');
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleToggleBadge = (badge: string) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { 
        name: '', 
        price: '', 
        comparePrice: '', 
        sku: '', 
        stock: '', 
        weight: '', 
        inStock: true 
      }]
    }));
  };

  const handleVariantChange = (index: number, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  // Image URL management functions
  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
      toast.success('Image URL added successfully');
    } else if (formData.images.includes(newImageUrl.trim())) {
      toast.error('This image URL already exists');
    } else {
      toast.error('Please enter a valid image URL');
    }
  };

  const handleRemoveImageUrl = async (index: number) => {
    const imageUrl = formData.images[index];
    
    try {
      // Import ImageUploadService dynamically to avoid SSR issues
      const { ImageUploadService } = await import('@/lib/imageUpload');
      
      // Check if this is a Firebase Storage URL and delete from storage
      if (imageUrl && ImageUploadService.extractStoragePathFromUrl(imageUrl)) {
        try {
          await ImageUploadService.deleteImage(ImageUploadService.extractStoragePathFromUrl(imageUrl)!);
          toast.success('Image removed from storage and product');
        } catch (deleteError) {
          console.warn('Failed to delete from storage, but removed from product:', deleteError);
          toast.success('Image URL removed from product');
        }
      } else {
        toast.success('Image URL removed');
      }
      
      // Remove from form data
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleSetFeaturedImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: imageUrl
    }));
    toast.success('Featured image updated');
  };

  // Clear all images and delete from Firebase Storage
  const handleClearAllImages = async () => {
    if (formData.images.length === 0) {
      toast('No images to clear');
      return;
    }

    try {
      const { ImageUploadService } = await import('@/lib/imageUpload');
      
      // Delete all images from Firebase Storage
      await ImageUploadService.deleteImagesFromUrls(formData.images);
      
      // Clear from form data
      setFormData(prev => ({
        ...prev,
        images: [],
        featuredImage: ''
      }));
      
      // Clear uploaded images
      setUploadedImages([]);
      
      toast.success('All images cleared and deleted from storage');
    } catch (error) {
      console.error('Error clearing images:', error);
      toast.error('Failed to clear images');
    }
  };

  // Enhanced submit function with Firebase integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsLoading(true);

    try {
      // Generate SKU if not provided
      const sku = formData.sku || `${formData.category.substring(0, 3).toUpperCase()}-${Date.now()}`;
      
      // Generate slug if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Create product object
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        comparePrice: parseFloat(formData.comparePrice) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        sku,
        barcode: formData.barcode,
        category: formData.category,
        subcategory: formData.subcategory,
        tags: formData.tags,
        vendor: formData.vendor,
        productType: formData.productType,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        weight: formData.weight,
        dimensions: formData.dimensions,
        shippingClass: formData.shippingClass,
        images: formData.images.map((url, index) => ({
          id: `img-${index}`,
          url,
          alt: formData.name,
          isPrimary: index === 0
        })),
        videos: formData.videos,
        featuredImage: formData.featuredImage || formData.images[0],
        variants: formData.variants.map((variant, index) => ({
          id: `variant-${index}`,
          name: variant.name,
          price: parseFloat(variant.price) || 0,
          stock: parseInt(variant.stock) || 0,
          sku: variant.sku
        })),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        requiresShipping: formData.requiresShipping,
        isTaxable: formData.isTaxable,
        slug,
        metaTitle: formData.metaTitle || formData.name,
        metaDescription: formData.metaDescription || formData.shortDescription,
        badges: formData.badges,
        materials: formData.materials,
        artist: formData.artist,
        careInstructions: formData.careInstructions,
        warranty: formData.warranty,
        status: 'active' as const
      };

      // Convert form data to Product interface format
      const firebaseProductData = {
        ...productData,
        images: formData.images.map((url, index) => ({
          id: `img-${Date.now()}-${index}`,
          url,
          alt: formData.name,
          isPrimary: index === 0
        })),
        variants: formData.variants.map((variant, index) => ({
          id: `variant-${Date.now()}-${index}`,
          name: variant.name,
          price: parseFloat(variant.price) || 0,
          stock: parseInt(variant.stock) || 0,
          sku: variant.sku
        }))
      };
      
      // Update product in Firebase
      await productService.update(productId, firebaseProductData);
      
      console.log('Product updated in Firebase successfully');
      
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save as draft function
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    try {
      // Generate SKU if not provided
      const sku = formData.sku || `${formData.category.substring(0, 3).toUpperCase()}-${Date.now()}`;
      
      // Generate slug if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        comparePrice: parseFloat(formData.comparePrice) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        sku,
        barcode: formData.barcode,
        category: formData.category,
        subcategory: formData.subcategory,
        tags: formData.tags,
        vendor: formData.vendor,
        productType: formData.productType,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        weight: formData.weight,
        dimensions: formData.dimensions,
        shippingClass: formData.shippingClass,
        images: formData.images.map((url, index) => ({
          id: `img-${Date.now()}-${index}`,
          url,
          alt: formData.name,
          isPrimary: index === 0
        })),
        variants: formData.variants.map((variant, index) => ({
          id: `variant-${Date.now()}-${index}`,
          name: variant.name,
          price: parseFloat(variant.price) || 0,
          stock: parseInt(variant.stock) || 0,
          sku: variant.sku
        })),
        isActive: false,
        isFeatured: formData.isFeatured,
        requiresShipping: formData.requiresShipping,
        isTaxable: formData.isTaxable,
        slug,
        metaTitle: formData.metaTitle || formData.name,
        metaDescription: formData.metaDescription || formData.shortDescription,
        badges: formData.badges,
        materials: formData.materials,
        artist: formData.artist,
        careInstructions: formData.careInstructions,
        warranty: formData.warranty,
        status: 'draft' as const
      };
      
      // Save draft to Firebase
      await productService.update(productId, productData);
      toast.success('Draft saved successfully!');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const tabs = [
    { id: 'basic', name: 'Basic Information', icon: Package },
    { id: 'pricing', name: 'Pricing & Inventory', icon: DollarSign },
    { id: 'media', name: 'Media & Content', icon: Upload },
    { id: 'variants', name: 'Variants', icon: Tag },
    { id: 'shipping', name: 'Shipping & Tax', icon: Truck },
    { id: 'seo', name: 'SEO & Marketing', icon: Eye },
    { id: 'badges', name: 'Product Badges', icon: Award }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Link 
                    href="/admin/products"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Products
                  </Link>
                </div>
                <h1 className="font-secondary text-3xl font-bold text-gray-900">
                  Edit Product
                </h1>
                <p className="text-gray-600 mt-2">
                  Update your product information and media
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
            </div>
          </div>

          {/* Validation Errors Summary */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(validationErrors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Debug Info */}
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                Active Tab: {activeTab} | Total Tabs: {tabs.length}
              </div>
              
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            validationErrors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Handcrafted Silver Necklace"
                          required
                        />
                        {validationErrors.name && (
                          <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Description *
                        </label>
                        <textarea
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={handleInputChange}
                          rows={2}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            validationErrors.shortDescription ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Brief description for product cards and search results"
                        />
                        {validationErrors.shortDescription && (
                          <p className="text-red-600 text-sm mt-1">{validationErrors.shortDescription}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={6}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            validationErrors.description ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Tell a story about your product. Include features, benefits, and what makes it special."
                        />
                        {validationErrors.description && (
                          <p className="text-red-600 text-sm mt-1">{validationErrors.description}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            validationErrors.category ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        {validationErrors.category && (
                          <p className="text-red-600 text-sm mt-1">{validationErrors.category}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory
                        </label>
                        <select
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          disabled={!formData.category}
                        >
                          <option value="">Select subcategory</option>
                          {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map(subcategory => (
                            <option key={subcategory} value={subcategory}>{subcategory}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Artist/Creator
                        </label>
                        <input
                          type="text"
                          name="artist"
                          value={formData.artist}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., Ashwini A. Nanal"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Materials
                        </label>
                        <input
                          type="text"
                          name="materials"
                          value={formData.materials}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., Sterling Silver, 22K Gold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Media & Content Tab */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Media & Content
                    </h3>
                    
                    {/* Product Images */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Product Images *</h4>
                      
                      {validationErrors.images && (
                        <p className="text-red-600 text-sm mb-2">{validationErrors.images}</p>
                      )}
                      
                      <ImageUploader
                        productId={formData.sku || productId}
                        category={formData.category || 'general'}
                        userId={'admin'}
                        onImagesUploaded={handleImagesUploaded}
                        onImagesRemoved={handleImagesRemoved}
                        maxImages={10}
                        allowMultiple={true}
                        showThumbnails={true}
                        className="mb-4"
                      />
                      
                      {/* Image URL Management */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Add Image URLs</h5>
                        
                        <div className="flex gap-2 mb-3">
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="Enter image URL (e.g., Firebase Storage URL)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddImageUrl()}
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Add URL
                          </button>
                        </div>

                        {/* Current Image URLs */}
                        {formData.images.length > 0 && (
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Current Images ({formData.images.length})</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {formData.images.map((imageUrl, index) => (
                                <div key={index} className="relative group border border-gray-200 rounded-lg p-3 bg-white">
                                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                    <img
                                      src={imageUrl}
                                      alt={`Product image ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEM2My40MDQ2IDQwIDU0IDQ5LjQwNDYgNTQgNjFDNTQgNzIuNTk1NCA2My40MDQ2IDgyIDc1IDgyQzg2LjU5NTQgODIgOTYgNzIuNTk1NCA5NiA2MUM5NiA0OS40MDQ2IDg2LjU5NTQgNDAgNzUgNDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAxMjBDMjAgMTE4Ljg5NSAyMC44OTU0IDExOCAyMiAxMThIMTI4QzEyOS4xMDUgMTE4IDEzMCAxMTguODk1IDEzMCAxMjBDMTMwIDEyMS4xMDUgMTI5LjEwNSAxMjIgMTI4IDEyMkgyMkMyMC44OTU0IDEyMiAyMCAxMjEuMTA1IDIwIDEyMFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+';
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Featured Badge */}
                                  {formData.featuredImage === imageUrl && (
                                    <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                                      Featured
                                    </div>
                                  )}
                                  
                                  {/* Action Buttons */}
                                  <div className="flex justify-between items-center">
                                    <div className="flex space-x-1">
                                      <button
                                        type="button"
                                        onClick={() => handleSetFeaturedImage(imageUrl)}
                                        className={`p-1 rounded-full text-xs ${
                                          formData.featuredImage === imageUrl 
                                            ? 'bg-yellow-500 text-white' 
                                            : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                                        }`}
                                        title="Set as featured"
                                      >
                                        <Star className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImageUrl(index)}
                                        className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 text-xs"
                                        title="Remove image"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                    <span className="text-xs text-gray-500">#{index + 1}</span>
                                  </div>
                                  
                                  {/* URL Preview */}
                                  <p className="text-xs text-gray-500 mt-1 truncate" title={imageUrl}>
                                    {imageUrl.length > 30 ? `${imageUrl.substring(0, 30)}...` : imageUrl}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">

                          
                          {formData.images.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllImages}
                              className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="h-5 w-5 mr-2" />
                              Clear All Images
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Care Instructions
                        </label>
                        <textarea
                          name="careInstructions"
                          value={formData.careInstructions}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="How to care for this product..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty Information
                        </label>
                        <textarea
                          name="warranty"
                          value={formData.warranty}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Warranty details..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing & Inventory Tab */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Pricing & Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            validationErrors.price ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                        {validationErrors.price && (
                          <p className="text-red-600 text-sm mt-1">{validationErrors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Compare Price (₹)
                        </label>
                        <input
                          type="number"
                          name="comparePrice"
                          value={formData.comparePrice}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            validationErrors.comparePrice ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        {validationErrors.comparePrice && (
                          <p className="text-red-600 text-sm mt-1">{validationErrors.comparePrice}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Original price to show discount</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost Price (₹)
                        </label>
                        <input
                          type="number"
                          name="costPrice"
                          value={formData.costPrice}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <p className="text-xs text-gray-500 mt-1">For profit calculation</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU
                        </label>
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Auto-generated if empty"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            validationErrors.stock ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="0"
                          min="0"
                        />
                        {validationErrors.stock && (
                          <p className="text-red-600 text-sm mt-1">{validationErrors.stock}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          name="lowStockThreshold"
                          value={formData.lowStockThreshold}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="5"
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (g)
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., 25g"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., 10cm x 5cm x 2cm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {activeTab === 'variants' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Product Variants
                    </h3>
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </button>
                      
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Variant {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Variant Name
                              </label>
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="e.g., Red, Large"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹)
                              </label>
                              <input
                                type="number"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Compare Price (₹)
                              </label>
                              <input
                                type="number"
                                value={variant.comparePrice}
                                onChange={(e) => handleVariantChange(index, 'comparePrice', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU
                              </label>
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="Variant SKU"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock
                              </label>
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="0"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (g)
                              </label>
                              <input
                                type="text"
                                value={variant.weight}
                                onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="e.g., 25g"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={variant.inStock}
                                onChange={(e) => handleVariantChange(index, 'inStock', e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 text-sm text-gray-700">
                                In Stock
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping & Tax Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Shipping & Tax
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Class
                        </label>
                        <select
                          name="shippingClass"
                          value={formData.shippingClass}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Select shipping class</option>
                          {shippingClasses.map(shippingClass => (
                            <option key={shippingClass} value={shippingClass}>{shippingClass}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="requiresShipping"
                            checked={formData.requiresShipping}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Requires shipping
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isTaxable"
                            checked={formData.isTaxable}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Taxable
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO & Marketing Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      SEO & Marketing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Slug
                        </label>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Auto-generated from product name"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL-friendly version of product name</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          name="metaTitle"
                          value={formData.metaTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="SEO title for search engines"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          name="metaDescription"
                          value={formData.metaDescription}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="SEO description for search engines (150-160 characters)"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-red-600 hover:text-red-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Tag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Badges Tab */}
              {activeTab === 'badges' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Product Badges
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add badges to make your product stand out and grab shopper attention.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {productBadges.map((badge) => (
                        <button
                          key={badge}
                          type="button"
                          onClick={() => handleToggleBadge(badge)}
                          className={`
                            p-3 rounded-lg border-2 text-left transition-colors
                            ${formData.badges.includes(badge)
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{badge}</span>
                            {formData.badges.includes(badge) && (
                              <CheckCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback - Show all tabs if none are active */}
              {!['basic', 'pricing', 'media', 'variants', 'shipping', 'seo', 'badges'].includes(activeTab) && (
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">Tab "{activeTab}" not found. Showing all tabs:</p>
                  </div>
                  
                  {/* Basic Information Tab */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <p className="text-gray-600">Basic information tab content would go here.</p>
                  </div>
                  
                  {/* Pricing & Inventory Tab */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
                    <p className="text-gray-600">Pricing and inventory tab content would go here.</p>
                  </div>
                  
                  {/* Media & Content Tab */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Content</h3>
                    <p className="text-gray-600">Media and content tab content would go here.</p>
                  </div>
                  
                  {/* Variants Tab */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
                    <p className="text-gray-600">Product variants tab content would go here.</p>
                  </div>
                  
                  {/* Shipping & Tax Tab */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Tax</h3>
                    <p className="text-gray-600">Shipping and tax tab content would go here.</p>
                  </div>
                  
                  {/* SEO & Marketing Tab */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Marketing</h3>
                    <p className="text-gray-600">SEO and marketing tab content would go here.</p>
                  </div>
                  
                  {/* Product Badges Tab */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Badges</h3>
                    <p className="text-gray-600">Product badges tab content would go here.</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/products"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 