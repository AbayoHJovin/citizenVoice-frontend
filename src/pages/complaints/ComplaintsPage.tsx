import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchUserComplaints, deleteComplaint } from '../../features/complaints/complaintsSlice';
import { Complaint } from '../../services/complaintService';
import AppLayout from '../../components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { format } from 'date-fns';
import StatusBadge from '../../components/complaints/StatusBadge';
import { Loader2, AlertTriangle, X } from 'lucide-react';
import EmptyState from '../../components/complaints/EmptyState';
import ComplaintForm from '../../components/complaints/ComplaintForm';

const ComplaintsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { complaints, isLoading } = useAppSelector((state) => state.complaints);
  
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaintToEdit, setComplaintToEdit] = useState<Complaint | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchUserComplaints());
  }, [dispatch]);
  
  // Filter complaints by status
  const pendingComplaints = complaints.filter(c => c.status === 'PENDING');
  const inProgressComplaints = complaints.filter(c => c.status === 'IN_PROGRESS');
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED');
  const rejectedComplaints = complaints.filter(c => c.status === 'REJECTED');
  
  const handleViewComplaint = (complaint: Complaint) => {
    navigate(`/complaints/${complaint.id}`);
  };
  
  const handleNewComplaint = () => {
    setComplaintToEdit(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditComplaint = (complaint: Complaint) => {
    setComplaintToEdit(complaint);
    setIsFormOpen(true);
    // Close the detail view if it's open
    if (isDetailOpen) {
      setIsDetailOpen(false);
    }
  };
  
  const handleDeleteClick = (complaintId: string) => {
    setComplaintToDelete(complaintId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (complaintToDelete) {
      try {
        await dispatch(deleteComplaint(complaintToDelete)).unwrap();
        // Close dialogs
        setIsDeleteDialogOpen(false);
        setIsDetailOpen(false);
        setComplaintToDelete(null);
      } catch (error) {
        console.error('Failed to delete complaint:', error);
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
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#020240]">My Complaints</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your submitted complaints
            </p>
          </div>
          
          <Button 
            onClick={handleNewComplaint}
            className="mt-4 md:mt-0 bg-[#020240] hover:bg-[#020240]/90"
          >
            Submit New Complaint
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-[#020240]" />
          </div>
        ) : complaints.length === 0 ? (
          <EmptyState onCreateNew={handleNewComplaint} />
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingComplaints.length})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({inProgressComplaints.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedComplaints.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedComplaints.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <ComplaintsList complaints={complaints} onView={handleViewComplaint} onEdit={handleEditComplaint} />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <ComplaintsList complaints={pendingComplaints} onView={handleViewComplaint} onEdit={handleEditComplaint} />
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-0">
              <ComplaintsList complaints={inProgressComplaints} onView={handleViewComplaint} onEdit={handleEditComplaint} />
            </TabsContent>
            
            <TabsContent value="resolved" className="mt-0">
              <ComplaintsList complaints={resolvedComplaints} onView={handleViewComplaint} onEdit={handleEditComplaint} />
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-0">
              <ComplaintsList complaints={rejectedComplaints} onView={handleViewComplaint} onEdit={handleEditComplaint} />
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* We've removed the complaint detail dialog and now navigate to the detail page */}
      
      {/* Complaint Form Dialog */}
      <ComplaintForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        complaint={complaintToEdit}
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

// Complaints List Component
interface ComplaintsListProps {
  complaints: Complaint[];
  onView: (complaint: Complaint) => void;
  onEdit: (complaint: Complaint) => void;
}

const ComplaintsList: React.FC<ComplaintsListProps> = ({ complaints, onView, onEdit }) => {
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
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {complaints.map((complaint) => (
        <div 
          key={complaint.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{truncateText(complaint.title, 40)}</h3>
              <StatusBadge status={complaint.status} />
            </div>
            
            <p className="text-sm text-gray-500 mb-3">
              Submitted on {formatDate(complaint.createdAt)}
            </p>
            
            <p className="text-sm text-gray-700 mb-4">
              {truncateText(complaint.description, 120)}
            </p>
            
            {complaint.images && complaint.images.length > 0 && (
              <div className="flex -space-x-2 mb-4">
                {complaint.images.slice(0, 3).map((image, index) => (
                  <img 
                    key={image.id} 
                    src={image.url} 
                    alt={`Attachment ${index + 1}`} 
                    className="w-8 h-8 rounded-full border border-white object-cover"
                  />
                ))}
                {complaint.images.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                    +{complaint.images.length - 3}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onView(complaint)}
                className="w-full bg-[#020240] hover:bg-[#020240]/90"
              >
                View Complaint
              </Button>
            </div>
            
            {complaint.status === 'PENDING' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(complaint)}
                className="w-full mt-2"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintsPage;
