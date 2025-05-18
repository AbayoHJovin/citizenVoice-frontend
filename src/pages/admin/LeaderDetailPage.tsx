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
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, Mail, MapPin, User, Shield, Calendar } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { Leader, fetchLeaderById } from "../../services/adminService";

const LeaderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [leader, setLeader] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadLeaderDetails = async () => {
      if (!id) {
        setError("Leader ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchLeaderById(id);
        setLeader(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load leader details. Please try again.");
        console.error("Error loading leader details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderDetails();
  }, [id]);
  
  const handleBack = () => {
    navigate("/admin/leaders");
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get full location string
  const getLocationString = (leader: Leader) => {
    const parts = [
      leader.province,
      leader.district,
      leader.sector,
      leader.cell,
      leader.village
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(" / ") : "N/A";
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Leader Details</h1>
              <p className="text-muted-foreground mt-2">
                View detailed information about the leader
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 flex items-center gap-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leaders
            </Button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#020240]"></div>
          </div>
        ) : leader ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Personal details of the leader</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="text-lg font-semibold">{leader.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="text-lg">{leader.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Administrative Scope</p>
                    <p className="text-lg">{leader.adminstrationScope || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="text-lg">{formatDate(leader.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Location Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location Information</CardTitle>
                <CardDescription>Geographical jurisdiction of the leader</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#020240] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Location</p>
                    <p className="text-lg">{getLocationString(leader)}</p>
                  </div>
                </div>
                
                {leader.province && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Province</p>
                      <p>{leader.province}</p>
                    </div>
                    
                    {leader.district && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">District</p>
                        <p>{leader.district}</p>
                      </div>
                    )}
                    
                    {leader.sector && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sector</p>
                        <p>{leader.sector}</p>
                      </div>
                    )}
                    
                    {leader.cell && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Cell</p>
                        <p>{leader.cell}</p>
                      </div>
                    )}
                    
                    {leader.village && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Village</p>
                        <p>{leader.village}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Actions Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Leader Actions</CardTitle>
                <CardDescription>Manage this leader account</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Leader
                </Button>
                
                <Button variant="destructive" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                  Delete Leader
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-semibold text-muted-foreground">Leader not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleBack}
            >
              Return to Leaders List
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default LeaderDetailPage;
