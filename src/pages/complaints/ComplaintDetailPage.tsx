import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchComplaintById, deleteComplaint } from '../../features/complaints/complaintsSlice';
import AppLayout from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import StatusBadge from '../../components/complaints/StatusBadge';
import { AlertTriangle, ArrowLeft, Loader2, X, MessageSquare } from 'lucide-react';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';

const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { selectedComplaint, isLoading } = useAppSelector((state) => state.complaints);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchComplaintById(id));
    }
  }, [dispatch, id]);
  
  const handleEditComplaint = () => {
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (id) {
      try {
        await dispatch(deleteComplaint(id)).unwrap();
        toast.success('Complaint deleted successfully');
        navigate('/complaints');
      } catch (error) {
        console.error('Failed to delete complaint:', error);
        toast.error('Failed to delete complaint');
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };
  
  const handleViewImage = (url: string) => {
    setSelectedImageUrl(url);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  // Format relative time (e.g. "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };
  
  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "UK"; // Unknown
    
    return name
      .split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || "UK";
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#020240]" />
        </div>
      </AppLayout>
    );
  }
  
  if (!selectedComplaint) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">Complaint Not Found</h2>
          <p className="text-gray-500">The complaint you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/complaints')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Complaints
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 -ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => navigate('/complaints')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Complaints
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#020240]">{selectedComplaint.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <StatusBadge status={selectedComplaint.status} />
                <span className="text-sm text-gray-500">
                  Submitted on {formatDate(selectedComplaint.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* <Button 
                variant="outline" 
                onClick={handleEditComplaint}
              >
                Edit Complaint
              </Button> */}
              {selectedComplaint.status === 'PENDING' && (
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteClick}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Complaint content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
          {/* Description section */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-[#020240]">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{selectedComplaint.description}</p>
          </div>
          
          {/* Images section */}
          {selectedComplaint.images && selectedComplaint.images.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 text-[#020240]">Attachments</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedComplaint.images.map((image) => (
                  <div 
                    key={image.id} 
                    className="relative group cursor-pointer rounded-md overflow-hidden"
                    onClick={() => handleViewImage(image.url)}
                  >
                    <img 
                      src={image.url} 
                      alt="Complaint attachment" 
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                      <span className="text-white opacity-0 group-hover:opacity-100 font-medium">View Image</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Responses/Comments Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Responses
              </CardTitle>
              <CardDescription>
                {selectedComplaint.responses && selectedComplaint.responses.length > 0
                  ? `${selectedComplaint.responses.length} comment${selectedComplaint.responses.length !== 1 ? 's' : ''}`
                  : 'No comments yet'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!selectedComplaint.responses || selectedComplaint.responses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>No responses yet from leaders.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedComplaint.responses.map((response) => (
                    <div key={response.id} className="relative">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src="" alt={response.responder?.name || 'Unknown'} />
                          <AvatarFallback className="bg-[#020240] text-white">
                            {getInitials(response.responder?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{response.responder?.name || 'Unknown Leader'}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatRelativeTime(response.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="rounded-md bg-muted/50 p-3">
                            <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                          </div>
                        </div>
                      </div>
                      {selectedComplaint.responses.indexOf(response) !== selectedComplaint.responses.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Additional information */}
          <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
            <p>Last updated: {formatDate(selectedComplaint.updatedAt)}</p>
            <p>Complaint ID: {selectedComplaint.id}</p>
          </div>
        </div>
      </div>
      
      {/* Complaint Form Dialog */}
      <ComplaintForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        complaint={selectedComplaint}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this complaint? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              Once deleted, all information related to this complaint including any attached images will be permanently removed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Viewer Dialog */}
      <Dialog open={!!selectedImageUrl} onOpenChange={() => setSelectedImageUrl(null)}>
        <DialogContent className="sm:max-w-[80vw] p-1 bg-transparent border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImageUrl && (
              <img 
                src={selectedImageUrl} 
                alt="Complaint attachment full view" 
                className="max-w-full max-h-[80vh] object-contain rounded-md"
              />
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setSelectedImageUrl(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ComplaintDetailPage;
