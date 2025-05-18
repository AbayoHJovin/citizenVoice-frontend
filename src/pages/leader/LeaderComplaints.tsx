import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { 
  AlertCircle, 
  MapPin, 
  Calendar, 
  ChevronRight,
  Search,
  Filter,
  X
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { fetchComplaintsInMyRegion, Complaint } from "../../services/leaderService";
import { useAppSelector } from "../../redux/hooks";

const LeaderComplaints = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [selectedAdminScope, setSelectedAdminScope] = useState<string>("");
  
  // Get available administrative scopes based on user's scope
  const [availableScopes, setAvailableScopes] = useState<{label: string, value: string}[]>([]);
  
  // Determine available administrative scopes based on user's scope
  useEffect(() => {
    if (!user) return;
    
    const scopes = [];
    
    // If user is at cell level, they can filter by villages
    if (user.administrationScope === "CELL" && user.cell) {
      // Add an option for all villages in this cell
      scopes.push({ label: "All Villages", value: "ALL" });
      
      // Here you would ideally fetch villages for this cell from your data
      // For now, we'll assume the villages are available in the complaints data
      // This will be populated once complaints are loaded
    }
    
    // If user is at sector level, they can filter by cells
    if (user.administrationScope === "SECTOR" && user.sector) {
      scopes.push({ label: "All Cells", value: "ALL" });
      // Similarly, you would fetch cells for this sector
    }
    
    // If user is at district level, they can filter by sectors
    if (user.administrationScope === "DISTRICT" && user.district) {
      scopes.push({ label: "All Sectors", value: "ALL" });
      // Fetch sectors for this district
    }
    
    // If user is at province level, they can filter by districts
    if (user.administrationScope === "PROVINCE" && user.province) {
      scopes.push({ label: "All Districts", value: "ALL" });
      // Fetch districts for this province
    }
    
    setAvailableScopes(scopes);
  }, [user]);
  
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchComplaintsInMyRegion();
        setComplaints(data);
        setFilteredComplaints(data);
        
        // After loading complaints, extract unique administrative areas for filtering
        if (data.length > 0 && user) {
          // Extract unique areas based on user's administrative scope
          const uniqueAreas = new Set<string>();
          
          if (user.administrationScope === "CELL" && user.cell) {
            // Extract unique villages
            data.forEach(complaint => {
              if (complaint.citizen.village) {
                uniqueAreas.add(complaint.citizen.village);
              }
            });
          } else if (user.administrationScope === "SECTOR" && user.sector) {
            // Extract unique cells
            data.forEach(complaint => {
              if (complaint.citizen.cell) {
                uniqueAreas.add(complaint.citizen.cell);
              }
            });
          } else if (user.administrationScope === "DISTRICT" && user.district) {
            // Extract unique sectors
            data.forEach(complaint => {
              if (complaint.citizen.sector) {
                uniqueAreas.add(complaint.citizen.sector);
              }
            });
          } else if (user.administrationScope === "PROVINCE" && user.province) {
            // Extract unique districts
            data.forEach(complaint => {
              if (complaint.citizen.district) {
                uniqueAreas.add(complaint.citizen.district);
              }
            });
          }
          
          // Add the unique areas to the available scopes
          const newScopes = [...availableScopes];
          Array.from(uniqueAreas).sort().forEach(area => {
            newScopes.push({ label: area, value: area });
          });
          
          setAvailableScopes(newScopes);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load complaints data");
        console.error("Error loading complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadComplaints();
  }, [user]);
  
  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (!complaints.length) return;
    
    let result = [...complaints];
    
    // Filter by search term (complainer name)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(complaint => 
        complaint.citizen.name.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (selectedStatus && selectedStatus !== "all") {
      result = result.filter(complaint => complaint.status === selectedStatus);
    }
    
    // Filter by today's complaints
    if (showTodayOnly) {
      result = result.filter(complaint => {
        const complaintDate = new Date(complaint.createdAt);
        return isToday(complaintDate);
      });
    }
    
    // Filter by administrative scope
    if (selectedAdminScope && selectedAdminScope !== "all" && selectedAdminScope !== "ALL" && user) {
      if (user.administrationScope === "CELL") {
        result = result.filter(complaint => complaint.citizen.village === selectedAdminScope);
      } else if (user.administrationScope === "SECTOR") {
        result = result.filter(complaint => complaint.citizen.cell === selectedAdminScope);
      } else if (user.administrationScope === "DISTRICT") {
        result = result.filter(complaint => complaint.citizen.sector === selectedAdminScope);
      } else if (user.administrationScope === "PROVINCE") {
        result = result.filter(complaint => complaint.citizen.district === selectedAdminScope);
      }
    }
    
    setFilteredComplaints(result);
  }, [complaints, searchTerm, selectedStatus, showTodayOnly, selectedAdminScope, user]);
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setShowTodayOnly(false);
    setSelectedAdminScope("");
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };
  
  // Get location string from complaint
  const getLocationString = (complaint: Complaint) => {
    const citizen = complaint.citizen;
    const parts = [];
    
    if (citizen.village) parts.push(citizen.village);
    if (citizen.cell) parts.push(citizen.cell);
    if (citizen.sector) parts.push(citizen.sector);
    if (citizen.district) parts.push(citizen.district);
    if (citizen.province) parts.push(citizen.province);
    
    return parts.length > 0 ? parts.join(", ") : "Unknown location";
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'RESOLVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Handle view complaint details
  const handleViewComplaint = (complaintId: string) => {
    navigate(`/leader/complaints/${complaintId}`);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Complaints Management</h1>
              <p className="text-muted-foreground mt-2">
                View and manage complaints in your administrative area
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(searchTerm || selectedStatus || showTodayOnly || selectedAdminScope) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
              <Badge className="bg-[#020240]">
                {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search by complainer name */}
              <div className="space-y-2">
                <Label htmlFor="search">Search by Complainer</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Filter by status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filter by administrative scope */}
              {availableScopes.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="adminScope">
                    {user?.administrationScope === "CELL" ? "Village" :
                     user?.administrationScope === "SECTOR" ? "Cell" :
                     user?.administrationScope === "DISTRICT" ? "Sector" :
                     user?.administrationScope === "PROVINCE" ? "District" : "Area"}
                  </Label>
                  <Select value={selectedAdminScope} onValueChange={setSelectedAdminScope}>
                    <SelectTrigger id="adminScope">
                      <SelectValue placeholder="All Areas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {availableScopes.map((scope) => (
                        <SelectItem key={scope.value} value={scope.value}>
                          {scope.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Today's complaints checkbox */}
              <div className="flex items-end space-x-2 h-full pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="todayOnly" 
                    checked={showTodayOnly}
                    onCheckedChange={(checked) => setShowTodayOnly(checked === true)}
                  />
                  <Label htmlFor="todayOnly" className="cursor-pointer">
                    Today's complaints only
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No Complaints Found</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              There are currently no complaints in your area. Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg truncate">{complaint.title}</CardTitle>
                    {getStatusBadge(complaint.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">{getLocationString(complaint)}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">Submitted on {formatDate(complaint.createdAt)}</p>
                    </div>
                    <p className="text-sm line-clamp-2">{complaint.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={() => handleViewComplaint(complaint.id)}
                  >
                    View Complaint
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default LeaderComplaints;
