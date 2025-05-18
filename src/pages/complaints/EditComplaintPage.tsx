import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import AppLayout from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchComplaintById, updateComplaint } from '../../features/complaints/complaintsSlice';
import { Complaint, Image } from '../../services/complaintService';

// Form validation schema
const formSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
});

const EditComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { selectedComplaint, isLoading } = useAppSelector((state) => state.complaints);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Image[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: selectedComplaint?.title || '',
      description: selectedComplaint?.description || '',
    },
  });

  // Fetch complaint data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchComplaintById(id));
    }
  }, [dispatch, id]);

  // Update form values when complaint data is loaded
  useEffect(() => {
    if (selectedComplaint) {
      form.reset({
        title: selectedComplaint.title,
        description: selectedComplaint.description,
      });
      
      if (selectedComplaint.images && selectedComplaint.images.length > 0) {
        setExistingImages(selectedComplaint.images);
      }
    }
  }, [selectedComplaint, form]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Validate file types
      const validFiles = fileArray.filter(file => {
        const isValid = file.type.startsWith('image/');
        return isValid;
      });
      
      // Limit to 5 images as per backend configuration
      const limitedFiles = validFiles.slice(0, 5);
      
      // Show warning if files were filtered out
      if (validFiles.length < fileArray.length) {
        toast.warning('Some files were not added because they are not valid images.');
      }
      
      // Show warning if files were limited
      if (limitedFiles.length < validFiles.length) {
        toast.warning(`Only the first 5 images were added. Maximum of 5 images allowed.`);
      }
      
      setImages(limitedFiles);
      
      // Create preview URLs for the images
      const newPreviewUrls = limitedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  // Remove a new image
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Remove an existing image
  const handleRemoveExistingImage = (imageId: string) => {
    setImagesToRemove(prev => [...prev, imageId]);
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id || !selectedComplaint) {
      toast.error('Complaint not found');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formData = {
        title: values.title,
        description: values.description,
        images: images.length > 0 ? images : undefined,
        imagesToRemove: imagesToRemove.length > 0 ? imagesToRemove : undefined,
      };
      
      await dispatch(updateComplaint({ id, data: formData })).unwrap();
      toast.success('Complaint updated successfully!');
      
      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      // Navigate back to the dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Failed to update complaint:', error);
      toast.error(error.response?.data?.message || 'Failed to update complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#020240]"></div>
        </div>
      </AppLayout>
    );
  }

  if (!selectedComplaint && !isLoading) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Complaint not found</h2>
            <p className="mt-2 text-gray-600">The complaint you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="mt-4 bg-[#020240] hover:bg-[#020240]/90"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#020240]">Edit Complaint</h1>
          <p className="text-gray-600 mt-2">
            Update the details of your complaint below.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Complaint Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E.g., Road damage in Kigali sector" 
                        className="h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a clear and concise title that summarizes your complaint.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe your complaint in detail. Include relevant information such as location, date, and people involved." 
                        className="min-h-[200px] resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your complaint (minimum 20 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel className="text-lg font-medium" htmlFor="images">
                  Attach New Images (Optional)
                </FormLabel>
                <Input 
                  id="images" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="h-12"
                />
                <FormDescription>
                  You can attach up to 5 images to support your complaint.
                </FormDescription>
              </div>
              
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">New Images:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {existingImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Existing Images:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {existingImages.map((image) => (
                      !imagesToRemove.includes(image.id) && (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                            <img 
                              src={image.url} 
                              alt="Existing attachment"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#020240] hover:bg-[#020240]/90 px-8"
                >
                  {isSubmitting ? 'Updating...' : 'Update Complaint'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditComplaintPage;
