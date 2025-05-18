
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import AppLayout from "../../components/layout/AppLayout";
import { useAppSelector } from "../../redux/hooks";
import { 
  fetchLeaderSummary, 
  fetchComplaintsInMyRegion, 
  LeaderSummary, 
  Complaint,
  getAdministrativeAreaString 
} from "../../services/leaderService";
import { Users, AlertCircle, CheckCircle, XCircle, BarChart3, Clock, ChevronRight } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const LeaderDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [summary, setSummary] = useState<LeaderSummary | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLeaderSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Error loading leader summary:", err);
      } finally {
        setLoading(false);
      }
    };
    
    const loadComplaints = async () => {
      try {
        setComplaintsLoading(true);
        setComplaintsError(null);
        const data = await fetchComplaintsInMyRegion();
        setComplaints(data);
      } catch (err: any) {
        setComplaintsError(err.message || "Failed to load complaints data");
        console.error("Error loading complaints:", err);
      } finally {
        setComplaintsLoading(false);
      }
    };
    
    loadSummary();
    loadComplaints();
  }, []);
  
  const administrativeArea = getAdministrativeAreaString(user);
  
  // Get the latest 3 complaints
  const latestComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Prepare data for pie chart
  const getStatusCounts = () => {
    const counts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      REJECTED: 0
    };
    
    complaints.forEach(complaint => {
      counts[complaint.status]++;
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();
  
  const chartData = {
    labels: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    datasets: [
      {
        data: [
          statusCounts.PENDING,
          statusCounts.IN_PROGRESS,
          statusCounts.RESOLVED,
          statusCounts.REJECTED
        ],
        backgroundColor: [
          '#f59e0b', // amber for pending
          '#3b82f6', // blue for in progress
          '#10b981', // green for resolved
          '#ef4444'  // red for rejected
        ],
        borderColor: [
          '#fef3c7',
          '#dbeafe',
          '#d1fae5',
          '#fee2e2'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
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
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Leader Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, <span className="font-semibold">{user?.name}</span>!
          </p>
          {user?.administrationScope && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#020240] text-white">
              {user.administrationScope}
            </div>
          )}
          {administrativeArea && (
            <p className="text-sm mt-2 text-muted-foreground">
              Managing: <span className="font-medium text-[#020240]">{administrativeArea}</span>
            </p>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Summary Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Complaints Card */}
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2 bg-[#020240]/5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                <BarChart3 className="h-4 w-4 text-[#020240]" />
              </div>
              <CardDescription>All statuses</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{summary?.totalComplaints || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                In {user?.administrationScope?.toLowerCase() || 'your area'}
              </p>
            </CardContent>
          </Card>
          
          {/* Pending Complaints Card */}
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2 bg-amber-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <CardDescription>Requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-amber-600">{summary?.totalPending || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.totalPending ? (
                  <span className="text-amber-600 font-medium">
                    {Math.round((summary.totalPending / (summary.totalComplaints || 1)) * 100)}%
                  </span>
                ) : '0%'} of total complaints
              </p>
            </CardContent>
          </Card>
          
          {/* Resolved Complaints Card */}
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2 bg-green-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Resolved Complaints</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <CardDescription>Successfully addressed</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-green-600">{summary?.totalResolved || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.totalResolved ? (
                  <span className="text-green-600 font-medium">
                    {Math.round((summary.totalResolved / (summary.totalComplaints || 1)) * 100)}%
                  </span>
                ) : '0%'} resolution rate
              </p>
            </CardContent>
          </Card>
          
          {/* Rejected Complaints Card */}
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2 bg-red-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Rejected Complaints</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <CardDescription>Not applicable</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-red-600">{summary?.totalRejected || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.totalRejected ? (
                  <span className="text-red-600 font-medium">
                    {Math.round((summary.totalRejected / (summary.totalComplaints || 1)) * 100)}%
                  </span>
                ) : '0%'} of total complaints
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Latest Complaints and Pie Chart Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Latest Complaints Card */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Latest Complaints</CardTitle>
                <div className="text-sm text-muted-foreground">Top 3 most recent</div>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              {complaintsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : complaintsError ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{complaintsError}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {latestComplaints.length > 0 ? (
                    latestComplaints.map((complaint) => (
                      <div key={complaint.id} className="flex items-center border-b pb-2 last:border-0">
                        <div className="flex-shrink-0 mr-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{complaint.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-muted-foreground">{formatDate(complaint.createdAt)}</p>
                            {getStatusBadge(complaint.status)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No complaints available</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/leader/complaints" className="flex items-center justify-center">
                  View All Complaints
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pie Chart Card */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Complaints by Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {complaintsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Skeleton className="h-[200px] w-[200px] rounded-full" />
                </div>
              ) : complaintsError ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{complaintsError}</AlertDescription>
                </Alert>
              ) : (
                <div>
                  {complaints.length > 0 ? (
                    <div className="h-[250px] flex justify-center items-center">
                      <Pie data={chartData} options={chartOptions} />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No complaint data available</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Complaint Distribution Section */}
        <div className="grid gap-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Complaint Distribution</CardTitle>
                <div className="text-sm text-muted-foreground">By status</div>
              </div>
            </CardHeader>
            <CardContent>
              {complaintsLoading ? (
                <div className="space-y-6 py-4">
                  <Skeleton className="h-[120px] w-full rounded-md" />
                </div>
              ) : complaintsError ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{complaintsError}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {complaints.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Pending */}
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                            <p className="text-sm font-medium">Pending</p>
                          </div>
                          <p className="text-sm font-medium">{statusCounts.PENDING}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {complaints.length > 0 ? (
                            <span>{Math.round((statusCounts.PENDING / complaints.length) * 100)}% of total</span>
                          ) : '0% of total'}
                        </div>
                      </div>
                      
                      {/* In Progress */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                            <p className="text-sm font-medium">In Progress</p>
                          </div>
                          <p className="text-sm font-medium">{statusCounts.IN_PROGRESS}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {complaints.length > 0 ? (
                            <span>{Math.round((statusCounts.IN_PROGRESS / complaints.length) * 100)}% of total</span>
                          ) : '0% of total'}
                        </div>
                      </div>
                      
                      {/* Resolved */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                            <p className="text-sm font-medium">Resolved</p>
                          </div>
                          <p className="text-sm font-medium">{statusCounts.RESOLVED}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {complaints.length > 0 ? (
                            <span>{Math.round((statusCounts.RESOLVED / complaints.length) * 100)}% of total</span>
                          ) : '0% of total'}
                        </div>
                      </div>
                      
                      {/* Rejected */}
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                            <p className="text-sm font-medium">Rejected</p>
                          </div>
                          <p className="text-sm font-medium">{statusCounts.REJECTED}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {complaints.length > 0 ? (
                            <span>{Math.round((statusCounts.REJECTED / complaints.length) * 100)}% of total</span>
                          ) : '0% of total'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No complaint data available</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeaderDashboard;
