
import axios from 'axios';

export interface UploadResponse {
  url: string;
  publicId: string;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'citizen_portal'); // Should be configured in Cloudinary

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },
  
  deleteImage: async (publicId: string): Promise<void> => {
    try {
      await axios.post('/api/cloudinary/delete', { publicId });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  },
};
