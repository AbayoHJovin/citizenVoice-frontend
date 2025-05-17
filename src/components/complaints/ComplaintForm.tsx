import React, { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      setImages(fileArray);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const formData = {
        title: values.title,
        description: values.description,
        images: images.length > 0 ? images : undefined,
      };
      
      if (complaint) {
        // Update existing complaint
        await dispatch(updateComplaint({ id: complaint.id, data: formData })).unwrap();
      } else {
        // Create new complaint
        await dispatch(createComplaint(formData)).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to submit complaint:', error);
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
              
              {images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="text-sm text-gray-500 list-disc pl-5">
                    {images.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
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
