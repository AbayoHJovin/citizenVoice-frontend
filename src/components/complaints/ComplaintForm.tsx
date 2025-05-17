import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Complaint } from '../../services/complaintService';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useAppDispatch } from '../../redux/hooks';
import { createComplaint, updateComplaint } from '../../features/complaints/complaintsSlice';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters'),
});

interface ComplaintFormProps {
  isOpen: boolean;
  onClose: () => void;
  complaint?: Complaint;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ isOpen, onClose, complaint }) => {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{id: string, url: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  
  // Set existing images when complaint changes
  useEffect(() => {
    if (complaint?.images && complaint.images.length > 0) {
      setExistingImages(complaint.images.map(img => ({ id: img.id, url: img.url })));
    } else {
      setExistingImages([]);
    }
    // Reset images to remove when complaint changes
    setImagesToRemove([]);
  }, [complaint]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: complaint?.title || '',
      description: complaint?.description || '',
    },
  });
  
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
    }
  };
  
  const handleRemoveExistingImage = (imageId: string) => {
    setImagesToRemove(prev => [...prev, imageId]);
  };

  const handleRemoveNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const formData = {
        title: values.title,
        description: values.description,
        images: images.length > 0 ? images : undefined,
        imagesToRemove: imagesToRemove.length > 0 ? imagesToRemove : undefined
      };
      
      if (complaint) {
        // Update existing complaint
        await dispatch(updateComplaint({ id: complaint.id, data: formData })).unwrap();
        toast.success('Complaint updated successfully!');
      } else {
        // Create new complaint
        await dispatch(createComplaint(formData)).unwrap();
        toast.success('Complaint submitted successfully!');
      }
      
      // Reset form state
      setImages([]);
      setImagesToRemove([]);
      form.reset();
      onClose();
    } catch (error: any) {
      console.error('Failed to submit complaint:', error);
      toast.error(error.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{complaint ? 'Edit Complaint' : 'Submit New Complaint'}</DialogTitle>
          <DialogDescription>
            {complaint 
              ? 'Update the details of your complaint below.' 
              : 'Fill out the form below to submit a new complaint.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief title of your complaint" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a clear and concise title for your complaint.
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed description of your complaint" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your complaint in detail. Include relevant information such as location, date, and people involved.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel htmlFor="images">Attach Images (Optional)</FormLabel>
              <Input 
                id="images" 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can attach up to 5 images to support your complaint.
              </p>
              
              {/* Display existing images */}
              {existingImages.length > 0 && !imagesToRemove.includes(existingImages[0].id) && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Current images:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.filter(img => !imagesToRemove.includes(img.id)).map((img) => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.url} 
                          alt="Attached image" 
                          className="w-20 h-20 object-cover rounded border border-gray-200" 
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display newly selected images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">New images to upload:</p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${index}`} 
                          className="w-20 h-20 object-cover rounded border border-gray-200" 
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-[80px]">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#020240] hover:bg-[#020240]/90"
              >
                {isSubmitting 
                  ? (complaint ? 'Updating...' : 'Submitting...') 
                  : (complaint ? 'Update Complaint' : 'Submit Complaint')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintForm;
