'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  thumbnailUrl?: string;
}

interface Product {
  id: string;
  name: string;
  price: number | null;
  category: string;
  stock: number | null;
  status: string;
  isActive: boolean;
  createdAt: any;
  images?: (ProductImage | string)[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://us-central1-butterflyauthentique33.cloudfunctions.net/getProducts');
      const data = await response.json();
      
      if (data.success) {
        console.log('Client side:', typeof window !== 'undefined');
        console.log('Total products:', data.products.length);
        
        console.log('All products:', data.products.length);
        
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`https://us-central1-butterflyauthentique33.cloudfunctions.net/deleteProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId })
      });
      
      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Helper function to get the best image URL for thumbnails
  const getProductThumbnail = (product: Product): string => {
    if (!product.images || product.images.length === 0) {
      return '/logo.png'; // Fallback to logo
    }

    // Handle new image structure (array of objects)
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      
      // If it's an object with thumbnailUrl, use that
      if (typeof firstImage === 'object' && firstImage.thumbnailUrl) {
        return firstImage.thumbnailUrl;
      }
      
      // If it's an object with url, use that
      if (typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      }
      
      // If it's a string, use it directly
      if (typeof firstImage === 'string') {
        return firstImage;
      }
    }

    return '/logo.png'; // Final fallback
  };

  // Helper function to get primary image URL
  const getProductImage = (product: Product): string => {
    if (!product.images || product.images.length === 0) {
      return '/logo.png';
    }

    // Handle new image structure (array of objects)
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      
      // If it's an object with url, use that
      if (typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      }
      
      // If it's a string, use it directly
      if (typeof firstImage === 'string') {
        return firstImage;
      }
    }

    return '/logo.png';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
          {/* Header */}
        <div className="flex justify-between items-center">
              <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
              </div>
                <Link
                  href="/admin/products/new"
            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                >
            <Plus className="h-4 w-4" />
                  Add Product
                </Link>
          </div>

              {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products by name, category, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                
                {/* Status Filter */}
                <div className="md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

          {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                    <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium mb-2">No products found</p>
                        <p className="text-sm">Start by adding your first product</p>
                          </div>
                        </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                          {/* Product Thumbnail */}
                          <div className="flex-shrink-0 h-12 w-12">
                                <img
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                              src={getProductThumbnail(product)}
                                  alt={product.name || 'Product'}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/logo.png'; // Fallback image
                              }}
                                />
                                </div>
                          {/* Product Name */}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name || 'Untitled Product'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                          {product.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{product.price ? product.price.toLocaleString() : '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (product.status || 'inactive') === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : (product.status || 'inactive') === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                          {(product.status || 'inactive').charAt(0).toUpperCase() + (product.status || 'inactive').slice(1)}
                              </span>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                            <Link
                            href={`/product/${product.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Product"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/admin/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>
    </AdminLayout>
  );
} 