import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { useAppDispatch } from '../../redux/hooks';
import { createComplaint } from '../../features/complaints/complaintsSlice';

const CreateComplaintPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Form validation schema with translations
  const formSchema = z.object({
    title: z.string()
      .min(5, t('createComplaint.validation.title.min'))
      .max(100, t('createComplaint.validation.title.max')),
    description: z.string()
      .min(20, t('createComplaint.validation.description.min'))
      .max(1000, t('createComplaint.validation.description.max')),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

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
        toast.warning(t('createComplaint.toast.invalidImages'));
      }
      
      // Show warning if files were limited
      if (limitedFiles.length < validFiles.length) {
        toast.warning(t('createComplaint.toast.maxImagesReached'));
      }
      
      setImages(limitedFiles);
      
      // Create preview URLs for the images
      const newPreviewUrls = limitedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  // Remove an image
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const formData = {
        title: values.title,
        description: values.description,
        images: images.length > 0 ? images : undefined,
      };
      
      await dispatch(createComplaint(formData)).unwrap();
      toast.success(t('createComplaint.toast.success'));
      
      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      // Navigate back to the dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Failed to submit complaint:', error);
      toast.error(error.response?.data?.message || t('createComplaint.toast.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#020240]">{t('createComplaint.header.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('createComplaint.header.description')}
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
                    <FormLabel className="text-lg font-medium">{t('createComplaint.form.title.label')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('createComplaint.form.title.placeholder')} 
                        className="h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t('createComplaint.form.title.description')}
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
                    <FormLabel className="text-lg font-medium">{t('createComplaint.form.description.label')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('createComplaint.form.description.placeholder')} 
                        className="min-h-[200px] resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t('createComplaint.form.description.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel className="text-lg font-medium" htmlFor="images">
                  {t('createComplaint.form.images.label')}
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
                  {t('createComplaint.form.images.description')}
                </FormDescription>
              </div>
              
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">{t('createComplaint.form.selectedImages')}:</h3>
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
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting}
                >
                  {t('createComplaint.form.buttons.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#020240] hover:bg-[#020240]/90 px-8"
                >
                  {isSubmitting ? t('createComplaint.form.buttons.submitting') : t('createComplaint.form.buttons.submit')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateComplaintPage;
