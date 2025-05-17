
import { uploadService, UploadResponse } from '../services/uploadService';
import { toast } from 'react-toastify';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGES = 5;

export interface ImageFile {
  file: File;
  preview: string;
}

export const validateImage = (file: File): string | null => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'File type not supported. Please upload JPEG, PNG, WEBP or GIF.';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Maximum size is 5MB.';
  }
  
  return null;
};

export const uploadImages = async (
  images: ImageFile[]
): Promise<UploadResponse[]> => {
  try {
    const uploadPromises = images.map((image) => uploadService.uploadImage(image.file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    toast.error('Failed to upload one or more images');
    throw error;
  }
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};
