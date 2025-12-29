// IndexedDB utility for storing workout images
const DB_NAME = 'progress-tracker-images';
const DB_VERSION = 1;
const STORE_NAME = 'workout-images';

let dbPromise = null;

const openDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });

  return dbPromise;
};

// Compress image to target size (~200KB)
export const compressImage = (file, maxSizeKB = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate scaling to reduce dimensions while maintaining aspect ratio
        const maxDimension = 1200;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to hit target size
        let quality = 0.8;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Iteratively reduce quality if needed
        while (dataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve({
          dataUrl,
          width: Math.round(width),
          height: Math.round(height),
          size: Math.round(dataUrl.length / 1.37), // Approximate bytes
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get key for workout images
const getKey = (date) => `workout-${date}-images`;

// Save images for a workout date
export const saveWorkoutImages = async (date, images) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      id: getKey(date),
      date,
      images, // Array of { dataUrl, width, height, timestamp }
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving workout images:', error);
    throw error;
  }
};

// Get images for a workout date
export const getWorkoutImages = async (date) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(getKey(date));
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.images : []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting workout images:', error);
    return [];
  }
};

// Delete all images for a workout date
export const deleteWorkoutImages = async (date) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(getKey(date));
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting workout images:', error);
    throw error;
  }
};

// Delete a single image from a workout
export const deleteWorkoutImage = async (date, imageIndex) => {
  try {
    const images = await getWorkoutImages(date);
    if (images.length > imageIndex) {
      images.splice(imageIndex, 1);
      if (images.length === 0) {
        await deleteWorkoutImages(date);
      } else {
        await saveWorkoutImages(date, images);
      }
    }
    return images;
  } catch (error) {
    console.error('Error deleting workout image:', error);
    throw error;
  }
};

// Add image(s) to a workout (max 3)
export const addWorkoutImages = async (date, newImages) => {
  try {
    const existingImages = await getWorkoutImages(date);
    const combined = [...existingImages, ...newImages].slice(0, 3); // Max 3 images
    await saveWorkoutImages(date, combined);
    return combined;
  } catch (error) {
    console.error('Error adding workout images:', error);
    throw error;
  }
};
