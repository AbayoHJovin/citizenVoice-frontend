import React, { useState } from 'react';
import { format } from 'date-fns';
import { Complaint } from '../../services/complaintService';
import StatusBadge from './StatusBadge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useAppDispatch } from '../../redux/hooks';
import { deleteComplaint } from '../../features/complaints/complaintsSlice';

interface ComplaintCardProps {
  complaint: Complaint;
  onEdit: (complaint: Complaint) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onEdit }) => {
  const dispatch = useAppDispatch();
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      dispatch(deleteComplaint(complaint.id));
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{complaint.title}</CardTitle>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="text-xs text-gray-500">
          Submitted on {formatDate(complaint.createdAt)}
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 mb-3">
          {truncateText(complaint.description, 150)}
        </p>
        
        {complaint.images && complaint.images.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Attachments:</p>
            <div className="flex flex-wrap gap-1">
              {complaint.images.slice(0, 5).map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`Attachment ${index + 1}`}
                  className="w-12 h-12 object-cover rounded border border-gray-200"
                />
              ))}
              {complaint.images.length > 5 && (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-xs text-gray-500">
                  +{complaint.images.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
        
        {complaint.response && (
          <Collapsible
            open={isResponseOpen}
            onOpenChange={setIsResponseOpen}
            className="mt-4 border rounded-md p-2 bg-[#020240]/5"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full flex justify-between text-xs">
                <span>Response from authority</span>
                <span>{isResponseOpen ? '▲' : '▼'}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pt-2">
              <p className="text-sm">{complaint.response.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                Received on {formatDate(complaint.response.timestamp)}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      
      {complaint.status === 'PENDING' && (
        <CardFooter className="pt-2 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(complaint)}
            className="text-xs"
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            className="text-xs"
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ComplaintCard;
