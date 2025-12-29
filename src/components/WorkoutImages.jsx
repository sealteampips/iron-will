import { useState, useEffect, useRef } from 'react';
import { Camera, X, Loader2, Maximize2, Upload } from 'lucide-react';
import {
  getWorkoutImages,
  addWorkoutImages,
  deleteWorkoutImage,
  compressImage,
} from '../utils/imageStorage';

export default function WorkoutImages({ date }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  // Load images on mount
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const storedImages = await getWorkoutImages(date);
        setImages(storedImages);
      } catch (error) {
        console.error('Error loading images:', error);
      }
      setLoading(false);
    };
    loadImages();
  }, [date]);

  // Auto-hide error toast
  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  const processFiles = async (files) => {
    // Filter for image files only
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setErrorToast('No valid image files found');
      return;
    }

    // Check how many more images we can add
    const remainingSlots = 3 - images.length;
    if (remainingSlots <= 0) {
      setErrorToast('Maximum 3 images per workout. Remove an image to add more.');
      return;
    }

    if (imageFiles.length > remainingSlots) {
      setErrorToast(
        `Only ${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} remaining. ${imageFiles.length - remainingSlots} image${imageFiles.length - remainingSlots > 1 ? 's' : ''} skipped.`
      );
    }

    const filesToProcess = imageFiles.slice(0, remainingSlots);
    setUploading(true);

    try {
      const compressedImages = await Promise.all(
        filesToProcess.map(async (file) => {
          const compressed = await compressImage(file);
          return {
            ...compressed,
            timestamp: new Date().toISOString(),
          };
        })
      );

      const updatedImages = await addWorkoutImages(date, compressedImages);
      setImages(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrorToast('Error uploading images. Please try again.');
    }

    setUploading(false);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    await processFiles(files);

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const updatedImages = await deleteWorkoutImage(date, index);
      setImages(updatedImages);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  const canAddMore = images.length < 3;

  return (
    <div
      onDragEnter={canAddMore ? handleDragEnter : undefined}
      onDragLeave={canAddMore ? handleDragLeave : undefined}
      onDragOver={canAddMore ? handleDragOver : undefined}
      onDrop={canAddMore ? handleDrop : undefined}
      className="relative"
    >
      <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">
        Workout Photos
      </label>

      {/* Drop Zone Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-900/30 border-2 border-dashed border-blue-400 rounded-lg">
          <div className="text-center">
            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-300 font-medium">Drop photos here</p>
            <p className="text-blue-400/70 text-sm">
              {3 - images.length} slot{3 - images.length !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorToast && (
        <div className="absolute top-0 left-0 right-0 z-20 px-3 py-2 bg-red-600 text-white text-sm rounded-lg shadow-lg animate-pulse">
          {errorToast}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-700 group"
            >
              <img
                src={img.dataUrl}
                alt={`Workout photo ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setFullscreenImage(img)}
              />
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setFullscreenImage(img)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="View full size"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Button / Drop Zone Hint */}
      {canAddMore && (
        <div
          className={`transition-all duration-200 ${
            isDragging ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Add Photo {images.length > 0 && `(${3 - images.length} remaining)`}
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Drag & drop or click to add · Images are compressed and stored locally
          </p>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={fullscreenImage.dataUrl}
            alt="Full size workout photo"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
