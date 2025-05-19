import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Complaint } from '../../services/complaintService';
import StatusBadge from './StatusBadge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useAppDispatch } from '../../redux/hooks';
import { deleteComplaint } from '../../features/complaints/complaintsSlice';

interface ComplaintCardProps {
  complaint: Complaint;
  onEdit?: (complaint: Complaint) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onEdit }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  
  const handleDelete = () => {
    if (window.confirm(t('complaintCard.deleteConfirmation'))) {
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
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };


  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 break-words" title={complaint.title}>
            {complaint.title}
          </CardTitle>
          <StatusBadge status={complaint.status} className="flex-shrink-0" />
        </div>
        <p className="text-xs text-gray-500">
          {t('complaintCard.submittedOn')} {formatDate(complaint.createdAt)}
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-700 mb-3 line-clamp-3 sm:line-clamp-4 md:line-clamp-3 lg:line-clamp-4" title={complaint.description}>
          {complaint.description}
        </div>
        
        {complaint.images && complaint.images.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-500 mb-1">{t('complaintCard.attachments')}:</p>
            <div className="flex flex-wrap gap-1.5">
              {complaint.images.slice(0, 5).map((image, index) => (
                <div 
                  key={image.id || index} 
                  className="relative group overflow-hidden"
                >
                  <img 
                    src={image.url}
                    alt={`Attachment ${index + 1}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded border border-gray-200 transition-transform hover:scale-105"
                    onClick={() => window.open(image.url, '_blank')}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200"></div>
                </div>
              ))}
              {complaint.images.length > 5 && (
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-xs text-gray-500">
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex justify-between text-xs font-medium text-[#020240] hover:bg-[#020240]/10"
              >
                <span>{t('complaintCard.responseFromAuthority')}</span>
                <span className="transition-transform duration-200">
                  {isResponseOpen ? '▲' : '▼'}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pt-2">
              <div className="text-sm line-clamp-6 sm:line-clamp-none" title={complaint.response.message}>
                {complaint.response.message}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('complaintCard.receivedOn')} {formatDate(complaint.response.timestamp)}
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
            onClick={() => onEdit ? onEdit(complaint) : navigate(`/complaints/edit/${complaint.id}`)}
            className="text-xs"
          >
            {t('complaintCard.actions.edit')}
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            className="text-xs"
          >
            {t('complaintCard.actions.delete')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ComplaintCard;
