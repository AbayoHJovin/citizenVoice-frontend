import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AppLayout from "../../components/layout/AppLayout";
import { useAppSelector } from "../../redux/hooks";
import { AdminSummary, TopLeader, fetchAdminSummary, fetchTopLeaders } from "../../services/adminService";
import { Users, UserCog, User, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [topLeaders, setTopLeaders] = useState<TopLeader[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLeaders, setLoadingLeaders] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderError, setLeaderError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("Error loading admin summary:", err);
      } finally {
        setLoading(false);
      }
    };
    
    const loadTopLeaders = async () => {
      try {
        setLoadingLeaders(true);
        const data = await fetchTopLeaders();
        setTopLeaders(data);
        setLeaderError(null);
      } catch (err) {
        setLeaderError("Failed to load leader analytics. Please try again later.");
        console.error("Error loading top leaders:", err);
      } finally {
        setLoadingLeaders(false);
      }
    };
    
    loadSummary();
    loadTopLeaders();
  }, []);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with user info */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, <span className="font-semibold">{user?.name}</span>! Here's your system overview and administrative controls.
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Total Admins Card */}
          <Card className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-purple-50">
              <CardTitle className="text-sm font-medium text-purple-700">Total Admins</CardTitle>
              <UserCog className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-purple-100"></div>
              ) : (
                <div className="text-2xl font-bold">{summary?.totalAdmins || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                System administrators
              </p>
            </CardContent>
          </Card>
          
          {/* Total Leaders Card */}
          <Card className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-blue-50">
              <CardTitle className="text-sm font-medium text-blue-700">Total Leaders</CardTitle>
              <UserCog className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-blue-100"></div>
              ) : (
                <div className="text-2xl font-bold">{summary?.totalLeaders || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Community leaders
              </p>
            </CardContent>
          </Card>
          
          {/* Total Citizens Card */}
          <Card className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-green-50">
              <CardTitle className="text-sm font-medium text-green-700">Total Citizens</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-green-100"></div>
              ) : (
                <div className="text-2xl font-bold">{summary?.totalCitizens || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Registered citizens
              </p>
            </CardContent>
          </Card>
          
          {/* Total Complaints Card */}
          <Card className="overflow-hidden border-l-4 border-l-gray-500 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-gray-50">
              <CardTitle className="text-sm font-medium text-gray-700">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-gray-100"></div>
              ) : (
                <div className="text-2xl font-bold">{summary?.totalComplaints || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                All submissions
              </p>
            </CardContent>
          </Card>
          
          {/* Pending Complaints Card */}
          <Card className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-amber-50">
              <CardTitle className="text-sm font-medium text-amber-700">Pending Complaints</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-amber-100"></div>
              ) : (
                <div className="text-2xl font-bold">{summary?.totalPending || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting review
              </p>
            </CardContent>
          </Card>
          
          {/* Resolved Complaints Card */}
          <Card className="overflow-hidden border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-emerald-50">
              <CardTitle className="text-sm font-medium text-emerald-700">Resolved Complaints</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-emerald-100"></div>
              ) : (
                <div className="text-2xl font-bold">{summary?.totalResolved || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* User Distribution Card */}
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-6 w-24 animate-pulse rounded bg-gray-100"></div>
                      <div className="h-6 w-12 animate-pulse rounded bg-gray-100"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Citizens</p>
                      <p className="text-xs text-muted-foreground">Regular users</p>
                    </div>
                    <div className="font-medium">{summary?.totalCitizens || 0}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Leaders</p>
                      <p className="text-xs text-muted-foreground">Community leaders</p>
                    </div>
                    <div className="font-medium">{summary?.totalLeaders || 0}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Admins</p>
                      <p className="text-xs text-muted-foreground">System administrators</p>
                    </div>
                    <div className="font-medium">{summary?.totalAdmins || 0}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Complaint Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Complaint Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-6 w-24 animate-pulse rounded bg-gray-100"></div>
                      <div className="h-6 w-12 animate-pulse rounded bg-gray-100"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium leading-none">Pending</p>
                        <p className="text-xs text-muted-foreground">Awaiting review</p>
                      </div>
                    </div>
                    <div className="font-medium">{summary?.totalPending || 0}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium leading-none">Resolved</p>
                        <p className="text-xs text-muted-foreground">Successfully completed</p>
                      </div>
                    </div>
                    <div className="font-medium">{summary?.totalResolved || 0}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium leading-none">Rejected</p>
                        <p className="text-xs text-muted-foreground">Not approved</p>
                      </div>
                    </div>
                    <div className="font-medium">{summary?.totalRejected || 0}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Charts */}
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {/* Complaint Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Complaint Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              {loading ? (
                <div className="h-64 w-64 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full border-4 border-t-[#020240] border-r-[#020240]/70 border-b-[#020240]/40 border-l-[#020240]/10 animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">{error}</div>
              ) : (
                <div className="h-64 w-full max-w-md">
                  <Pie 
                    data={{
                      labels: ['Pending', 'Resolved', 'Rejected'],
                      datasets: [
                        {
                          data: [
                            summary?.totalPending || 0,
                            summary?.totalResolved || 0,
                            summary?.totalRejected || 0
                          ],
                          backgroundColor: [
                            'rgba(245, 158, 11, 0.7)', // amber for pending
                            'rgba(16, 185, 129, 0.7)',  // emerald for resolved
                            'rgba(239, 68, 68, 0.7)'    // red for rejected
                          ],
                          borderColor: [
                            'rgba(245, 158, 11, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(239, 68, 68, 1)'
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
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
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw as number;
                              const total = (summary?.totalPending || 0) + 
                                           (summary?.totalResolved || 0) + 
                                           (summary?.totalRejected || 0);
                              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                              return `${label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Top Leaders Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Most Active Leaders</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              {loadingLeaders ? (
                <div className="h-64 w-full flex items-center justify-center">
                  <div className="h-8 w-full max-w-md bg-gray-200 rounded-md overflow-hidden relative">
                    <div className="h-full bg-[#020240]/20 w-1/3 absolute left-0 top-0 animate-pulse"></div>
                  </div>
                </div>
              ) : leaderError ? (
                <div className="text-center text-red-500 p-4">{leaderError}</div>
              ) : topLeaders.length === 0 ? (
                <div className="text-center text-gray-500 p-4">No leader data available</div>
              ) : (
                <div className="h-64 w-full">
                  <Bar
                    data={{
                      labels: topLeaders.map(leader => leader.name),
                      datasets: [
                        {
                          label: 'Total Responses',
                          data: topLeaders.map(leader => leader.totalResponses),
                          backgroundColor: 'rgba(2, 2, 64, 0.7)',
                          borderColor: 'rgba(2, 2, 64, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            title: function(tooltipItems) {
                              return tooltipItems[0].label;
                            },
                            label: function(context) {
                              const value = context.raw as number;
                              return `Responses: ${value}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          },
                          title: {
                            display: true,
                            text: 'Number of Responses'
                          }
                        },
                        x: {
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
