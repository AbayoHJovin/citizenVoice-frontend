
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AppLayout from "../../components/layout/AppLayout";
import { useAppSelector } from "../../redux/hooks";

const LeaderDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <AppLayout>
      <div className="space-y-6">
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
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                In {user?.administrationScope || 'your area'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requiring your attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">67%</span> resolution rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Citizens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered in your area
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "New team member onboarded", 
                  "Project status updated", 
                  "Budget approval received"
                ].map((update, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{update}</p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "Today" : i === 1 ? "Yesterday" : "3 days ago"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Weekly team meeting", 
                  "Project review", 
                  "Training session"
                ].map((activity, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "Every Monday, 10:00 AM" : i === 1 ? "May 25, 2025" : "June 2, 2025"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeaderDashboard;
