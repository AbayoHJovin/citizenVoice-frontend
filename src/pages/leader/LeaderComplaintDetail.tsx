import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
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
import { Textarea } from "../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { toast } from "../../components/ui/use-toast";
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
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Send,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { Complaint, changeComplaintStatus } from "../../services/leaderService";
import { createResponse, updateResponse, deleteResponse, ResponseType } from "../../services/responseService";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

// Define the extended Complaint type with responses
interface ComplaintWithResponses extends Complaint {
  responses?: ResponseType[];
}
import axios from "../../services/axiosConfig";
import api from "@/services/api";

const LeaderComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [complaint, setComplaint] = useState<ComplaintWithResponses | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Status update state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Response state
  const [responseError, setResponseError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editResponseText, setEditResponseText] = useState("");
  const [responseToEdit, setResponseToEdit] = useState<ResponseType | null>(null);

  const responseTextareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    console.log("flfddf ")
    console.log("user", user)
  }, [])
  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        setResponseError(null);

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };

  const getLocationString = (complaint: Complaint) => {
    if (!complaint.citizen) return "Unknown location";

    const citizen = complaint.citizen;
    const parts = [];

    if (citizen?.village) parts.push(`${citizen.village} Village`);
    if (citizen?.cell) parts.push(`${citizen.cell} Cell`);
    if (citizen?.sector) parts.push(`${citizen.sector} Sector`);
    if (citizen?.district) parts.push(`${citizen.district} District`);
    if (citizen?.province) parts.push(`${citizen.province} Province`);

    return parts.length > 0 ? parts.join(", ") : "Unknown location";
  };

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

  const handleResponseSubmit = async () => {
    if (!id || !responseMessage.trim()) return;

    try {
      setSubmittingResponse(true);

      if (editingResponseId) {
        await updateResponse(editingResponseId, responseMessage);

        toast({
          title: "Response updated",
          description: "Your response has been successfully updated."
        });
      } else {
        if (!complaint) return;
        await createResponse(complaint.id, responseMessage);
        toast({
          title: "Response added",
          description: "Your response has been successfully added."
        });
      }

      const response = await api.get(`/api/complaints/get-by-id/${id}`);
      setComplaint(response.data);
      setResponseMessage("");
      setEditingResponseId(null);
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleEditResponse = (response: ResponseType) => {
    setResponseToEdit(response);
    setEditResponseText(response.message);
    setEditDialogOpen(true);
  };

  const handleSaveEditedResponse = async () => {
    if (!responseToEdit || !editResponseText.trim()) return;

    setSubmittingResponse(true);
    try {
      await updateResponse(responseToEdit.id, editResponseText);
      toast({
        title: "Response updated",
        description: "Your response has been successfully updated."
      });

      // Refresh complaint data after updating response
      const response = await api.get(`/api/complaints/get-by-id/${id}`);
      setComplaint(response.data);

      // Close the dialog and reset state
      setEditDialogOpen(false);
      setResponseToEdit(null);
      setEditResponseText("");
    } catch (error) {
      console.error("Error updating response:", error);
      toast({
        title: "Error",
        description: "Failed to update your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Handle deleting a response
  const confirmDeleteResponse = (responseId: string) => {
    setResponseToDelete(responseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteResponse = async () => {
    if (!responseToDelete) return;

    setSubmittingResponse(true);
    try {
      await deleteResponse(responseToDelete);
      toast({
        title: "Response deleted",
        description: "The response has been successfully deleted."
      });

      // Refresh complaint data after deleting response
      const response = await api.get(`/api/complaints/get-by-id/${id}`);
      setComplaint(response.data);
    } catch (error) {
      console.error("Error deleting response:", error);
      toast({
        title: "Error",
        description: "Failed to delete the response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingResponse(false);
      setDeleteDialogOpen(false);
      setResponseToDelete(null);
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
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

  // Handle status change confirmation
  const confirmStatusChange = (status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED') => {
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;

    try {
      setStatusUpdateLoading(true);
      const updatedComplaint = await changeComplaintStatus(id, newStatus);

      // Fetch the complete complaint details again to ensure we have all data
      const response = await api.get(`/api/complaints/get-by-id/${id}`);
      setComplaint(response.data);

      // Show success message
      toast({
        title: "Status Updated",
        description: `Complaint status has been updated to ${newStatus.replace('_', ' ').toLowerCase()}.`,
        variant: "default",
      });
    } catch (err: any) {
      // Show error message
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update complaint status.",
        variant: "destructive",
      });
      console.error("Error updating complaint status:", err);
    } finally {
      setStatusUpdateLoading(false);
      setStatusDialogOpen(false);
      setNewStatus(null);
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'RESOLVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Get status dialog title and description
  const getStatusDialogContent = () => {
    if (!newStatus) return { title: "", description: "" };

    switch (newStatus) {
      case 'IN_PROGRESS':
        return {
          title: "Mark as In Progress?",
          description: "This will indicate that you are actively working on addressing this complaint. The citizen will be notified of this status change."
        };
      case 'RESOLVED':
        return {
          title: "Mark as Resolved?",
          description: "This will indicate that this complaint has been successfully addressed. The citizen will be notified that their complaint has been resolved."
        };
      case 'REJECTED':
        return {
          title: "Reject this Complaint?",
          description: "This will indicate that this complaint has been rejected. The citizen will be notified that their complaint was not approved for further action."
        };
      default:
        return {
          title: "Update Status?",
          description: "Are you sure you want to update the status of this complaint? The citizen will be notified of this change."
        };
    }
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
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    onClick={() => confirmStatusChange("IN_PROGRESS")}
                    disabled={statusUpdateLoading}
                  >
                    <Clock className="h-4 w-4" />
                    Mark as In Progress
                  </Button>
                )}

                {(complaint.status === "PENDING" || complaint.status === "IN_PROGRESS") && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    onClick={() => confirmStatusChange("RESOLVED")}
                    disabled={statusUpdateLoading}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Resolved
                  </Button>
                )}

                {(complaint.status === "PENDING" || complaint.status === "IN_PROGRESS") && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
                    onClick={() => confirmStatusChange("REJECTED")}
                    disabled={statusUpdateLoading}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Complaint
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Scroll to the response section
                    document.getElementById('responses-section')?.scrollIntoView({ behavior: 'smooth' });
                    // Focus the textarea
                    responseTextareaRef.current?.focus();
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </Button>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground border-t pt-4">
                Last updated: {formatDate(complaint.updatedAt)}
              </CardFooter>
            </Card>

            {/* Responses/Comments Section */}
            <Card className="md:col-span-2" id="responses-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments & Responses
                </CardTitle>
                <CardDescription>
                  {complaint?.responses && complaint.responses.length > 0
                    ? `${complaint.responses.length} comment${complaint.responses.length !== 1 ? 's' : ''}`
                    : 'No comments yet'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing responses */}
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : responseError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{responseError}</AlertDescription>
                  </Alert>
                ) : complaint?.responses && complaint.responses.length > 0 ? (
                  <div className="space-y-6">
                    {complaint.responses.map((response: ResponseType) => (
                      <div key={response.id} className="relative group">
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
                                <p className="font-medium">{response.responder?.name || 'Unknown User'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatRelativeTime(response.createdAt)}
                                </p>
                              </div>

                              {user?.id === response.responderId && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-36">
                                      <DropdownMenuItem
                                        onClick={() => handleEditResponse(response)}
                                        className="cursor-pointer"
                                      >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => confirmDeleteResponse(response.id)}
                                        className="text-red-600 cursor-pointer"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                            <div className="rounded-md bg-muted/50 p-3">
                              <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                            </div>
                          </div>
                        </div>
                        {complaint?.responses && complaint.responses.indexOf(response) !== complaint.responses.length - 1 && (
                          <Separator className="my-6" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No comments yet. Be the first to add a response.</p>
                  </div>
                )}

                {/* Add new response form */}
                <div className="pt-4">
                  <Textarea
                    ref={responseTextareaRef}
                    placeholder="Add your response..."
                    className="min-h-[100px] mb-2"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    disabled={submittingResponse}
                  />
                  <div className="flex justify-between items-center">
                    {editingResponseId && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingResponseId(null);
                          setResponseMessage('');
                        }}
                        disabled={submittingResponse}
                      >
                        Cancel
                      </Button>
                    )}
                    <div className="ml-auto">
                      <Button
                        onClick={handleResponseSubmit}
                        disabled={!responseMessage.trim() || submittingResponse}
                        className="bg-[#020240] hover:bg-[#020240]/90 flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {submittingResponse
                          ? 'Submitting...'
                          : editingResponseId
                            ? 'Update Response'
                            : 'Send Response'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
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

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {newStatus && getStatusIcon(newStatus)}
              {getStatusDialogContent().title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getStatusDialogContent().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={statusUpdateLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusUpdate}
              disabled={statusUpdateLoading}
              className={`${newStatus === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' :
                newStatus === 'RESOLVED' ? 'bg-green-600 hover:bg-green-700' :
                  newStatus === 'IN_PROGRESS' ? 'bg-blue-600 hover:bg-blue-700' :
                    'bg-[#020240]'}`}
            >
              {statusUpdateLoading ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Response Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Response?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this response? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submittingResponse}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteResponse}
              className="bg-red-600 hover:bg-red-700"
              disabled={submittingResponse}
            >
              {submittingResponse ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Response Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-[#020240]" />
              Edit Response
            </DialogTitle>
            <DialogDescription>
              Make changes to your response below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Edit your response..."
              value={editResponseText}
              onChange={(e) => setEditResponseText(e.target.value)}
              className="min-h-[120px]"
              autoFocus
            />
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditDialogOpen(false)}
              disabled={submittingResponse}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEditedResponse}
              className="bg-[#020240] hover:bg-[#020240]/90"
              disabled={!editResponseText.trim() || submittingResponse}
            >
              {submittingResponse ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
