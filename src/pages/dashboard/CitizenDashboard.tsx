
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AppLayout from "../../components/layout/AppLayout";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUserComplaints } from "../../features/complaints/complaintsSlice";
import { Complaint } from "../../services/complaintService";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import EmptyState from "../../components/complaints/EmptyState";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const CitizenDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { complaints, isLoading } = useAppSelector((state) => state.complaints);
  
  useEffect(() => {
    dispatch(fetchUserComplaints());
  }, [dispatch]);
  
  const handleEditComplaint = (complaint: Complaint) => {
    navigate(`/complaints/edit/${complaint.id}`);
  };
  
  const handleNewComplaint = () => {
    navigate('/complaints/create');
  };
  
  // Filter complaints by status
  const pendingComplaints = complaints.filter(c => c.status === 'PENDING');
  const inProgressComplaints = complaints.filter(c => c.status === 'IN_PROGRESS');
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED');
  const rejectedComplaints = complaints.filter(c => c.status === 'REJECTED');
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with user info */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#020240]">{t('citizenDashboard.header.title')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('citizenDashboard.header.welcome')} <span className="font-semibold">{user?.name}</span>!
              </p>
              
              {/* Location information */}
              {user?.province && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t('citizenDashboard.header.location')}: {user.province}{user.district ? `, ${user.district}` : ''}
                  {user.sector ? `, ${user.sector}` : ''}
                  {user.cell ? `, ${user.cell}` : ''}
                  {user.village ? `, ${user.village}` : ''}
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleNewComplaint}
              className="mt-4 md:mt-0 bg-[#020240] hover:bg-[#020240]/90"
            >
              {t('citizenDashboard.header.submitButton')}
            </Button>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('citizenDashboard.stats.total.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('citizenDashboard.stats.total.subtitle')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('citizenDashboard.stats.pending.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingComplaints.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('citizenDashboard.stats.pending.subtitle')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('citizenDashboard.stats.inProgress.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressComplaints.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('citizenDashboard.stats.inProgress.subtitle')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('citizenDashboard.stats.resolved.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedComplaints.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('citizenDashboard.stats.resolved.subtitle')}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Complaints listing */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{t('citizenDashboard.complaints.title')}</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#020240]"></div>
            </div>
          ) : complaints.length === 0 ? (
            <EmptyState onCreateNew={handleNewComplaint} />
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t('citizenDashboard.complaints.tabs.all')} ({complaints.length})</TabsTrigger>
                <TabsTrigger value="pending">{t('citizenDashboard.complaints.tabs.pending')} ({pendingComplaints.length})</TabsTrigger>
                <TabsTrigger value="in-progress">{t('citizenDashboard.complaints.tabs.inProgress')} ({inProgressComplaints.length})</TabsTrigger>
                <TabsTrigger value="resolved">{t('citizenDashboard.complaints.tabs.resolved')} ({resolvedComplaints.length})</TabsTrigger>
                <TabsTrigger value="rejected">{t('citizenDashboard.complaints.tabs.rejected')} ({rejectedComplaints.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {complaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      onEdit={handleEditComplaint} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {pendingComplaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      onEdit={handleEditComplaint} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="in-progress" className="mt-0">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {inProgressComplaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      onEdit={handleEditComplaint} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resolved" className="mt-0">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {resolvedComplaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      onEdit={handleEditComplaint} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-0">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {rejectedComplaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      onEdit={handleEditComplaint} 
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CitizenDashboard;
