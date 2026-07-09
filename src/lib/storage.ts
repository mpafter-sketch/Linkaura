/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';

/**
 * Compresses an image client-side using HTML Canvas.
 * Keeps aspect ratio intact while resizing to maximum dimensions and adjusting quality.
 */
export function compressImage(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Only compress images of types we expect
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      // Return uncompressed file if format is not supported
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Apply aspect ratio preservation and clamp to constraints
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // fallback
          return;
        }

        // Clean slate and draw
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to a compressed File object
        // Keep PNG as PNG, convert others to JPEG for maximum compression
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Extracts the storage object path from a public Supabase URL.
 * Supports different URL patterns, e.g. /storage/v1/object/public/bucket_name/path/to/file.ext
 */
export function getStoragePathFromUrl(url: string, bucket: 'avatars' | 'covers'): string | null {
  if (!url) return null;
  const matchStr = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(matchStr);
  if (index !== -1) {
    return decodeURIComponent(url.substring(index + matchStr.length));
  }
  return null;
}

/**
 * Uploads a compressed file to a designated Supabase Storage bucket.
 * Automatically handles cleaning up the old file if an oldUrl is provided.
 */
export async function uploadMedia(
  userId: string,
  file: File,
  bucket: 'avatars' | 'covers',
  oldUrl?: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // 1. Compression step
  let fileToUpload = file;
  try {
    fileToUpload = await compressImage(file, 1400, 1400, 0.8);
  } catch (err) {
    console.warn('Image compression failed, proceeding with original file:', err);
  }

  // 2. Format unique name inside user directory to prevent client-side cache and collisions
  const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const filePath = `${userId}/${timestamp}.${fileExt}`;

  // 3. Perform upload with real-time progress callbacks
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: true,
      onUploadProgress: (progress: any) => {
        if (progress.total) {
          const percent = (progress.loaded / progress.total) * 100;
          onProgress?.(Math.round(percent));
        }
      }
    } as any);

  if (uploadError) {
    throw new Error(`Upload to ${bucket} failed: ${uploadError.message}`);
  }

  // 4. Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  // 5. Delete old file if existed and belongs to the same user folder to free up space
  if (oldUrl) {
    try {
      const oldPath = getStoragePathFromUrl(oldUrl, bucket);
      if (oldPath && oldPath.startsWith(`${userId}/`)) {
        // Run asynchronously, do not block the UI on old file cleanup failure
        supabase.storage.from(bucket).remove([oldPath]).catch((cleanupErr) => {
          console.warn('Failed to delete old file from storage:', cleanupErr);
        });
      }
    } catch (err) {
      console.warn('Failed to parse old storage URL for deletion:', err);
    }
  }

  return publicUrl;
}
