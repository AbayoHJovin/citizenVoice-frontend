import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { 
  AlertCircle, 
  MapPin, 
  Calendar, 
  User,
  Mail,
  ArrowLeft,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { Complaint } from "../../services/leaderService";
import axios from "../../services/axiosConfig";
import api from "@/services/api";

const LeaderComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/api/complaints/get-by-id/${id}`);
        setComplaint(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load complaint details");
        console.error("Error loading complaint details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchComplaintDetail();
    }
  }, [id]);
  
  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };
  
  // Get location string from complaint
  const getLocationString = (complaint: Complaint) => {
    const citizen = complaint.citizen;
    const parts = [];
    
    if (citizen.village) parts.push(`${citizen.village} Village`);
    if (citizen.cell) parts.push(`${citizen.cell} Cell`);
    if (citizen.sector) parts.push(`${citizen.sector} Sector`);
    if (citizen.district) parts.push(`${citizen.district} District`);
    if (citizen.province) parts.push(`${citizen.province} Province`);
    
    return parts.length > 0 ? parts.join(", ") : "Unknown location";
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'RESOLVED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const handleBack = () => {
    navigate("/leader/complaints");
  };
  
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewerOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeImageViewer = () => {
    setImageViewerOpen(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  const navigateImages = (direction: 'next' | 'prev') => {
    if (!complaint?.images) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === complaint.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? complaint.images.length - 1 : prev - 1
      );
    }
  };
  
  // Handle keyboard navigation for the image viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageViewerOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeImageViewer();
          break;
        case 'ArrowLeft':
          navigateImages('prev');
          break;
        case 'ArrowRight':
          navigateImages('next');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageViewerOpen, complaint]);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Complaint Details</h1>
              <p className="text-muted-foreground mt-2">
                View detailed information about this complaint
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 flex items-center gap-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Complaints
            </Button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : complaint ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Complaint Information Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-xl">{complaint.title}</CardTitle>
                    <CardDescription>Complaint ID: {complaint.id.substring(0, 8)}</CardDescription>
                  </div>
                  {getStatusBadge(complaint.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submitted On</p>
                    <p className="text-base">{formatDate(complaint.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base">{getLocationString(complaint)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submitted By</p>
                    <p className="text-base">{complaint.citizen.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    <p className="text-base">{complaint.citizen.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Complaint Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{complaint.description}</p>
              </CardContent>
            </Card>
            
            {/* Complaint Images Card */}
            {complaint.images && complaint.images.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Attached Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {complaint.images.map((image, index) => (
                      <div 
                        key={image.id} 
                        className="overflow-hidden rounded-md border cursor-pointer"
                        onClick={() => openImageViewer(index)}
                      >
                        <img 
                          src={image.url} 
                          alt={`Complaint image ${index + 1}`}
                          className="h-48 w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Action Buttons Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage this complaint</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {complaint.status === "PENDING" && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Mark as In Progress
                  </Button>
                )}
                
                {(complaint.status === "PENDING" || complaint.status === "IN_PROGRESS") && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    Mark as Resolved
                  </Button>
                )}
                
                {(complaint.status === "PENDING" || complaint.status === "IN_PROGRESS") && (
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Reject Complaint
                  </Button>
                )}
                
                <Button variant="outline">
                  Add Comment
                </Button>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground border-t pt-4">
                Last updated: {formatDate(complaint.updatedAt)}
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Complaint Not Found</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              The complaint you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleBack}
            >
              Return to Complaints List
            </Button>
          </div>
        )}
      </div>
      
      {/* Full Screen Image Viewer Modal */}
      {imageViewerOpen && complaint?.images && complaint.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
          {/* Close button */}
          <button 
            onClick={closeImageViewer}
            className="absolute top-4 right-4 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all z-10"
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Image container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
            <img 
              src={complaint.images[currentImageIndex].url}
              alt={`Complaint image ${currentImageIndex + 1} (full view)`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>
          
          {/* Navigation buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button 
              onClick={() => navigateImages('prev')}
              className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {complaint.images.length}
            </div>
            <button 
              onClick={() => navigateImages('next')}
              className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default LeaderComplaintDetail;
