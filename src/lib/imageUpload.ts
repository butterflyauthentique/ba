import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  StorageReference 
} from 'firebase/storage';
import { storage, auth } from './firebase';

// Image upload configuration
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  QUALITY: 0.8, // JPEG quality
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1920,
  THUMBNAIL_WIDTH: 400,
  THUMBNAIL_HEIGHT: 400
};

// Firebase Storage folder structure
export const STORAGE_FOLDERS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BLOG: 'blog',
  USERS: 'users',
  TEMP: 'temp',
  THUMBNAILS: 'thumbnails',
  ORIGINALS: 'originals',
  OPTIMIZED: 'optimized'
} as const;

// Image metadata interface
export interface ImageMetadata {
  id: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  url: string;
  thumbnailUrl?: string;
  optimizedUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
  alt?: string;
  caption?: string;
}

// Product image organization structure
export interface ProductImageStructure {
  productId: string;
  category: string;
  images: {
    original: ImageMetadata;
    thumbnail?: ImageMetadata;
    optimized?: ImageMetadata;
  }[];
  featuredImage?: ImageMetadata;
}

/**
 * Image Upload Service for Butterfly Authentique
 * Handles image upload, organization, optimization, and management
 */
export class ImageUploadService {
  /**
   * Upload optimized blog image with optional aspect ratio and size constraints
   */
  static async uploadBlogImageOptimized(
    file: File,
    key: string,
    userId: string,
    options?: {
      // aspect width/height. Example for 9:16 => { width: 9, height: 16 }
      aspect?: { width: number; height: number };
      maxBytes?: number; // enforce output <= this size
      targetLongEdge?: number; // longest side in pixels
      format?: 'image/jpeg' | 'image/webp';
    }
  ): Promise<ImageMetadata> {
    const aspect = options?.aspect;
    const maxBytes = options?.maxBytes ?? 200 * 1024; // default 200KB
    const targetLongEdge = options?.targetLongEdge ?? 1600; // default 1600px long edge
    const format = options?.format ?? 'image/webp';

    // Validate file
    this.validateFile(file);

    // Read original into HTMLImageElement
    const originalUrl = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = originalUrl;
    });

    // Determine target dimensions while maintaining/cropping to aspect if provided
    let targetWidth: number;
    let targetHeight: number;
    if (aspect) {
      const desiredRatio = aspect.width / aspect.height; // e.g., 9/16
      const currentRatio = img.width / img.height;
      // Determine crop rectangle to achieve desired ratio via center-crop
      let cropWidth = img.width;
      let cropHeight = img.height;
      if (currentRatio > desiredRatio) {
        // too wide → crop width
        cropWidth = Math.round(img.height * desiredRatio);
        cropHeight = img.height;
      } else if (currentRatio < desiredRatio) {
        // too tall → crop height
        cropWidth = img.width;
        cropHeight = Math.round(img.width / desiredRatio);
      }

      // scale so that longer edge becomes targetLongEdge
      const scale = targetLongEdge / Math.max(cropWidth, cropHeight);
      targetWidth = Math.round(cropWidth * scale);
      targetHeight = Math.round(cropHeight * scale);

      // Draw cropped and scaled onto canvas
      const sx = Math.floor((img.width - cropWidth) / 2);
      const sy = Math.floor((img.height - cropHeight) / 2);
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, sx, sy, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight);

      // Compress iteratively to meet size constraint
      const blob = await this.compressToTarget(canvas, format, maxBytes);
      const timestamp = Date.now();
      const fileExtension = format === 'image/webp' ? 'webp' : 'jpg';
      const fileName = `${key}_${timestamp}.${fileExtension}`;
      const blogRef = ref(storage, `${STORAGE_FOLDERS.BLOG}/${key}/${fileName}`);
      const snapshot = await uploadBytes(blogRef, blob);
      const url = await getDownloadURL(snapshot.ref);

      return {
        id: `${key}_${timestamp}`,
        originalName: file.name,
        fileName,
        fileSize: blob.size,
        mimeType: blob.type,
        width: targetWidth,
        height: targetHeight,
        url,
        uploadedAt: new Date(),
        uploadedBy: userId,
        alt: file.name
      };
    } else {
      // No enforced aspect: scale longest edge to targetLongEdge
      const ratio = Math.min(targetLongEdge / img.width, targetLongEdge / img.height, 1);
      targetWidth = Math.round(img.width * ratio);
      targetHeight = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
      const blob = await this.compressToTarget(canvas, format, maxBytes);
      const timestamp = Date.now();
      const fileExtension = format === 'image/webp' ? 'webp' : 'jpg';
      const fileName = `${key}_${timestamp}.${fileExtension}`;
      const blogRef = ref(storage, `${STORAGE_FOLDERS.BLOG}/${key}/${fileName}`);
      const snapshot = await uploadBytes(blogRef, blob);
      const url = await getDownloadURL(snapshot.ref);

      return {
        id: `${key}_${timestamp}`,
        originalName: file.name,
        fileName,
        fileSize: blob.size,
        mimeType: blob.type,
        width: targetWidth,
        height: targetHeight,
        url,
        uploadedAt: new Date(),
        uploadedBy: userId,
        alt: file.name
      };
    }
  }
  
  /**
   * Upload product image with proper organization
   */
  static async uploadProductImage(
    file: File, 
    productId: string, 
    category: string,
    userId: string,
    options?: {
      alt?: string;
      caption?: string;
      isFeatured?: boolean;
    }
  ): Promise<ImageMetadata> {
    try {
      // Validate file
      this.validateFile(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${productId}_${timestamp}.${fileExtension}`;
      
      // Create storage references
      const originalRef = ref(storage, `${STORAGE_FOLDERS.PRODUCTS}/${category}/${productId}/originals/${fileName}`);
      const thumbnailRef = ref(storage, `${STORAGE_FOLDERS.PRODUCTS}/${category}/${productId}/thumbnails/${fileName}`);
      
      // Upload original image
      const originalSnapshot = await uploadBytes(originalRef, file);
      const originalUrl = await getDownloadURL(originalSnapshot.ref);
      
      // Get image dimensions
      const dimensions = await this.getImageDimensions(file);
      
      // Create thumbnail (optional - if it fails, continue without thumbnail)
      let thumbnailUrl: string | undefined;
      try {
        const thumbnailBlob = await this.createThumbnail(file);
        const thumbnailSnapshot = await uploadBytes(thumbnailRef, thumbnailBlob);
        thumbnailUrl = await getDownloadURL(thumbnailSnapshot.ref);
      } catch (thumbnailError) {
        console.warn('Failed to create thumbnail, continuing without it:', thumbnailError);
        // Continue without thumbnail
      }
      
      // Create image metadata
      const imageMetadata: ImageMetadata = {
        id: `${productId}_${timestamp}`,
        originalName: file.name,
        fileName,
        fileSize: file.size,
        mimeType: file.type,
        width: dimensions.width,
        height: dimensions.height,
        url: originalUrl,
        thumbnailUrl,
        uploadedAt: new Date(),
        uploadedBy: userId,
        alt: options?.alt || file.name,
        caption: options?.caption
      };
      
      return imageMetadata;
      
    } catch (error) {
      console.error('Error uploading product image:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('Unauthorized: Please log in to upload images');
        } else if (error.message.includes('storage/quota-exceeded')) {
          throw new Error('Storage quota exceeded. Please contact support.');
        } else if (error.message.includes('storage/retry-limit-exceeded')) {
          throw new Error('Upload failed. Please try again.');
        } else {
          throw new Error(`Upload failed: ${error.message}`);
        }
      } else {
        throw new Error('Failed to upload image. Please try again.');
      }
    }
  }
  
  /**
   * Upload multiple product images
   */
  static async uploadProductImages(
    files: File[], 
    productId: string, 
    category: string,
    userId: string,
    options?: {
      featuredIndex?: number;
      altTexts?: string[];
      captions?: string[];
    }
  ): Promise<ProductImageStructure> {
    const uploadPromises = files.map((file, index) => 
      this.uploadProductImage(file, productId, category, userId, {
        alt: options?.altTexts?.[index],
        caption: options?.captions?.[index],
        isFeatured: index === options?.featuredIndex
      })
    );
    
    const uploadedImages = await Promise.all(uploadPromises);
    
    const productImages: ProductImageStructure = {
      productId,
      category,
      images: uploadedImages.map(img => ({
        original: img,
        thumbnail: img.thumbnailUrl ? { ...img, url: img.thumbnailUrl } : undefined
      })),
      featuredImage: options?.featuredIndex !== undefined ? uploadedImages[options.featuredIndex] : uploadedImages[0]
    };
    
    return productImages;
  }
  
  /**
   * Upload category image
   */
  static async uploadCategoryImage(
    file: File,
    categorySlug: string,
    userId: string
  ): Promise<ImageMetadata> {
    try {
      this.validateFile(file);
      
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${categorySlug}_${timestamp}.${fileExtension}`;
      
      const categoryRef = ref(storage, `${STORAGE_FOLDERS.CATEGORIES}/${categorySlug}/${fileName}`);
      const snapshot = await uploadBytes(categoryRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      const dimensions = await this.getImageDimensions(file);
      
      return {
        id: `${categorySlug}_${timestamp}`,
        originalName: file.name,
        fileName,
        fileSize: file.size,
        mimeType: file.type,
        width: dimensions.width,
        height: dimensions.height,
        url,
        uploadedAt: new Date(),
        uploadedBy: userId,
        alt: `${categorySlug} category image`
      };
      
    } catch (error) {
      console.error('Error uploading category image:', error);
      throw new Error('Failed to upload category image');
    }
  }
  
  /**
   * Upload blog image
   */
  static async uploadBlogImage(
    file: File,
    blogPostId: string,
    userId: string
  ): Promise<ImageMetadata> {
    try {
      this.validateFile(file);
      
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${blogPostId}_${timestamp}.${fileExtension}`;
      
      const blogRef = ref(storage, `${STORAGE_FOLDERS.BLOG}/${blogPostId}/${fileName}`);
      const snapshot = await uploadBytes(blogRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      const dimensions = await this.getImageDimensions(file);
      
      return {
        id: `${blogPostId}_${timestamp}`,
        originalName: file.name,
        fileName,
        fileSize: file.size,
        mimeType: file.type,
        width: dimensions.width,
        height: dimensions.height,
        url,
        uploadedAt: new Date(),
        uploadedBy: userId,
        alt: file.name
      };
      
    } catch (error) {
      console.error('Error uploading blog image:', error);
      throw new Error('Failed to upload blog image');
    }
  }
  
  /**
   * Upload user avatar
   */
  static async uploadUserAvatar(
    file: File,
    userId: string
  ): Promise<ImageMetadata> {
    try {
      this.validateFile(file);
      
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `avatar_${timestamp}.${fileExtension}`;
      
      const avatarRef = ref(storage, `${STORAGE_FOLDERS.USERS}/${userId}/avatar/${fileName}`);
      const snapshot = await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      const dimensions = await this.getImageDimensions(file);
      
      return {
        id: `avatar_${userId}_${timestamp}`,
        originalName: file.name,
        fileName,
        fileSize: file.size,
        mimeType: file.type,
        width: dimensions.width,
        height: dimensions.height,
        url,
        uploadedAt: new Date(),
        uploadedBy: userId,
        alt: 'User avatar'
      };
      
    } catch (error) {
      console.error('Error uploading user avatar:', error);
      throw new Error('Failed to upload avatar');
    }
  }
  
  /**
   * Delete image from storage
   */
  static async deleteImage(imagePath: string): Promise<void> {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Extract Firebase Storage path from Firebase Storage URL
   */
  static extractStoragePathFromUrl(url: string): string | null {
    try {
      if (!url || !url.includes('butterflyauthentique.in') || !url.includes('o/')) {
        return null;
      }
      
      const urlParts = url.split('?')[0]; // Remove query parameters
      const storagePathMatch = urlParts.match(/o\/([^?]+)/);
      
      if (storagePathMatch) {
        return decodeURIComponent(storagePathMatch[1]);
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting storage path:', error);
      return null;
    }
  }

  /**
   * Delete multiple images from Firebase Storage
   */
  static async deleteImagesFromUrls(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls
      .map(url => this.extractStoragePathFromUrl(url))
      .filter(path => path !== null)
      .map(path => this.deleteImage(path!));
    
    if (deletePromises.length > 0) {
      await Promise.allSettled(deletePromises);
    }
  }
  
  /**
   * Delete all product images
   */
  static async deleteProductImages(productId: string, category: string): Promise<void> {
    try {
      const productFolder = ref(storage, `${STORAGE_FOLDERS.PRODUCTS}/${category}/${productId}`);
      const result = await listAll(productFolder);
      
      const deletePromises = result.items.map(item => deleteObject(item));
      await Promise.all(deletePromises);
      
    } catch (error) {
      console.error('Error deleting product images:', error);
      throw new Error('Failed to delete product images');
    }
  }
  
  /**
   * Get image dimensions
   */
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Create thumbnail from image
   */
  private static async createThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate thumbnail dimensions
        const { width, height } = this.calculateThumbnailDimensions(
          img.width, 
          img.height, 
          IMAGE_CONFIG.THUMBNAIL_WIDTH, 
          IMAGE_CONFIG.THUMBNAIL_HEIGHT
        );
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail'));
            }
          },
          'image/jpeg',
          IMAGE_CONFIG.QUALITY
        );
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Compress canvas output under a target byte size by adjusting quality
   */
  private static async compressToTarget(canvas: HTMLCanvasElement, format: 'image/webp' | 'image/jpeg', maxBytes: number): Promise<Blob> {
    let quality = 0.9;
    let blob: Blob | null = null;
    for (let i = 0; i < 8; i++) {
      blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), format, quality);
      });
      if (!blob) throw new Error('Failed to create image blob');
      if (blob.size <= maxBytes) return blob;
      quality -= 0.1;
      if (quality <= 0.2) break;
    }
    // If still larger, return last blob anyway
    if (!blob) throw new Error('Failed to create image blob');
    return blob;
  }
  
  /**
   * Calculate thumbnail dimensions maintaining aspect ratio
   */
  private static calculateThumbnailDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    };
  }
  
  /**
   * Validate uploaded file
   */
  private static validateFile(file: File): void {
    // Check file size
    if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    // Check file type
    if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images.');
    }
  }
  
  /**
   * Generate optimized image URL for different sizes
   */
  static generateOptimizedUrl(originalUrl: string, width: number, height: number): string {
    // For Firebase Storage, we can append query parameters for optimization
    // This would work with Firebase Extensions or custom image processing
    return `${originalUrl}?w=${width}&h=${height}&q=${IMAGE_CONFIG.QUALITY}`;
  }
  
  /**
   * Get storage path for product images
   */
  static getProductImagePath(productId: string, category: string, fileName: string): string {
    return `${STORAGE_FOLDERS.PRODUCTS}/${category}/${productId}/originals/${fileName}`;
  }
  
  /**
   * Get storage path for product thumbnails
   */
  static getProductThumbnailPath(productId: string, category: string, fileName: string): string {
    return `${STORAGE_FOLDERS.PRODUCTS}/${category}/${productId}/thumbnails/${fileName}`;
  }
}

/**
 * Image optimization utilities
 */
export const ImageOptimization = {
  /**
   * Optimize image for web display
   */
  async optimizeForWeb(file: File, maxWidth: number = 1200): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = this.calculateDimensions(img.width, img.height, maxWidth);
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          'image/webp',
          0.8
        );
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },
  
  /**
   * Calculate optimized dimensions
   */
  calculateDimensions(originalWidth: number, originalHeight: number, maxWidth: number): { width: number; height: number } {
    if (originalWidth <= maxWidth) {
      return { width: originalWidth, height: originalHeight };
    }
    
    const ratio = maxWidth / originalWidth;
    return {
      width: maxWidth,
      height: Math.round(originalHeight * ratio)
    };
  }
};

export default ImageUploadService; 