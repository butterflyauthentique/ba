'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  Star,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { ImageUploadService, ImageMetadata, IMAGE_CONFIG } from '@/lib/imageUpload';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  productId?: string;
  category?: string;
  userId: string;
  onImagesUploaded: (images: ImageMetadata[]) => void;
  onImagesRemoved: (imageIds: string[]) => void;
  maxImages?: number;
  allowMultiple?: boolean;
  showThumbnails?: boolean;
  className?: string;
}

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function ImageUploader({
  productId = 'temp',
  category = 'general',
  userId,
  onImagesUploaded,
  onImagesRemoved,
  maxImages = 10,
  allowMultiple = true,
  showThumbnails = true,
  className = ''
}: ImageUploaderProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageMetadata[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Validate file type
      if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }

      // Validate file size
      if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large (max ${IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB)`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Check if adding these files would exceed maxImages
    if (uploadedImages.length + uploadingImages.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Add files to uploading state
    const newUploadingImages: UploadingImage[] = validFiles.map(file => ({
      id: `${Date.now()}_${Math.random()}`,
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingImages(prev => [...prev, ...newUploadingImages]);

    // Upload each file
    validFiles.forEach((file, index) => {
      uploadImage(file, newUploadingImages[index].id);
    });
  }, [uploadedImages.length, uploadingImages.length, maxImages]);

  // Upload single image
  const uploadImage = async (file: File, uploadId: string) => {
    try {
      const imageMetadata = await ImageUploadService.uploadProductImage(
        file,
        productId,
        category,
        userId,
        {
          alt: file.name,
          isFeatured: uploadedImages.length === 0 && featuredImageId === null
        }
      );

      // Update uploading state
      setUploadingImages(prev => 
        prev.map(img => 
          img.id === uploadId 
            ? { ...img, progress: 100, status: 'success' }
            : img
        )
      );

      // Add to uploaded images
      setUploadedImages(prev => {
        const newImages = [...prev, imageMetadata];
        
        // Set as featured if it's the first image
        if (newImages.length === 1) {
          setFeaturedImageId(imageMetadata.id);
        }
        
        return newImages;
      });

      // Notify parent component
      onImagesUploaded([imageMetadata]);

      toast.success(`${file.name} uploaded successfully`);

      // Remove from uploading state after a delay
      setTimeout(() => {
        setUploadingImages(prev => prev.filter(img => img.id !== uploadId));
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      
      setUploadingImages(prev => 
        prev.map(img => 
          img.id === uploadId 
            ? { ...img, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
            : img
        )
      );

      toast.error(`Failed to upload ${file.name}`);
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Remove image
  const removeImage = async (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;

    try {
      // Remove from Firebase Storage
      await ImageUploadService.deleteImage(image.url);
      
      // Remove from local state
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      
      // Update featured image if needed
      if (featuredImageId === imageId) {
        const remainingImages = uploadedImages.filter(img => img.id !== imageId);
        setFeaturedImageId(remainingImages.length > 0 ? remainingImages[0].id : null);
      }

      // Notify parent component
      onImagesRemoved([imageId]);

      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  // Set featured image
  const setFeaturedImage = (imageId: string) => {
    setFeaturedImageId(imageId);
  };

  // Remove uploading image
  const removeUploadingImage = (uploadId: string) => {
    setUploadingImages(prev => prev.filter(img => img.id !== uploadId));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-red-400 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={IMAGE_CONFIG.ALLOWED_TYPES.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">
              Drag and drop images here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPEG, PNG, WebP, AVIF up to {IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB
            </p>
            <p className="text-xs text-gray-500">
              {uploadedImages.length}/{maxImages} images uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Uploading Images */}
      {uploadingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading...</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {uploadingImages.map((uploadingImage) => (
              <div key={uploadingImage.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {uploadingImage.status === 'uploading' && (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                      <p className="text-xs text-gray-500">{uploadingImage.progress}%</p>
                    </div>
                  )}
                  {uploadingImage.status === 'success' && (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  )}
                  {uploadingImage.status === 'error' && (
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-1" />
                      <p className="text-xs text-red-500">Failed</p>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeUploadingImage(uploadingImage.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {uploadingImage.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {uploadedImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={showThumbnails && image.thumbnailUrl ? image.thumbnailUrl : image.url}
                    alt={image.alt || image.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEM2My40MDQ2IDQwIDU0IDQ5LjQwNDYgNTQgNjFDNTQgNzIuNTk1NCA2My40MDQ2IDgyIDc1IDgyQzg2LjU5NTQgODIgOTYgNzIuNTk1NCA5NiA2MUM5NiA0OS40MDQ2IDg2LjU5NTQgNDAgNzUgNDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAxMjBDMjAgMTE4Ljg5NSAyMC44OTU0IDExOCAyMiAxMThIMTI4QzEyOS4xMDUgMTE4IDEzMCAxMTguODk1IDEzMCAxMjBDMTMwIDEyMS4xMDUgMTI5LjEwNSAxMjIgMTI4IDEyMkgyMkMyMC44OTU0IDEyMiAyMCAxMjEuMTA1IDIwIDEyMFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+';
                    }}
                  />
                  
                  {/* Featured Badge */}
                  {featuredImageId === image.id && (
                    <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                      Featured
                    </div>
                  )}
                  
                  {/* Image Number */}
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(image.id)}
                    className={`p-1 rounded-full ${
                      featuredImageId === image.id 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-yellow-50'
                    }`}
                    title="Set as featured"
                  >
                    <Star className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    title="Remove image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                {/* Image Info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {image.originalName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {Math.round(image.fileSize / 1024)}KB • {image.width}×{image.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedImages.length === 0 && uploadingImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No images uploaded yet</p>
          <p className="text-xs">Upload images to showcase your product</p>
        </div>
      )}
    </div>
  );
} 