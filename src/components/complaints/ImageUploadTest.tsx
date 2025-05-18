import React, { useState } from 'react';
import api from '../../services/axiosConfig';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';

const ImageUploadTest: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('title', 'Test Complaint');
      formData.append('description', 'This is a test complaint to verify image uploads are working correctly. This description is at least 20 characters long to satisfy validation.');
      
      files.forEach(file => {
        formData.append('images', file);
      });

        console.log('Sending test upload with files:');
      files.forEach((file, i) => {
        console.log(`File ${i + 1}: ${file.name} (${file.type}, ${file.size} bytes)`);
      });

      console.log('FormData entries:');
      console.log('FormData entries:');
      for (const pair of (formData as any).entries()) {
        console.log(`${pair[0]}: ${pair[1] instanceof File ? `${pair[1].name} (${pair[1].type})` : pair[1]}`);
      }

      const response = await api.post('/api/complaints/add', formData, {
        withCredentials: true,
      });

      setResult({
        success: true,
        data: response.data
      });
      
      toast.success('Test upload successful!');
    } catch (error: any) {
      console.error('Test upload failed:', error);
      
      setResult({
        success: false,
        error: error.response?.data || error.message
      });
      
      toast.error(`Test upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white">
      <h2 className="text-lg font-bold mb-4">Image Upload Test</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Images</label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Selected: {files.length} file(s)
          </p>
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <p className="text-xs truncate max-w-[80px]">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isUploading || files.length === 0}
          className="bg-[#020240] hover:bg-[#020240]/90"
        >
          {isUploading ? 'Uploading...' : 'Test Upload'}
        </Button>
      </form>

      {result && (
        <div className="mt-4 p-3 rounded border">
          <h3 className="font-medium">{result.success ? 'Success' : 'Error'}</h3>
          <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ImageUploadTest;
