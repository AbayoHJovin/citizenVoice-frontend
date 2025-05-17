
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AppLayout from "../../components/layout/AppLayout";
import { useAppSelector } from "../../redux/hooks";

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your system overview and administrative controls.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground mt-1">
                +86 since last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground mt-1">
                +42 since yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground mt-1">
                2 require immediate attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Server Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">98.2%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Uptime in the last 30 days
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Citizens</p>
                    <p className="text-xs text-muted-foreground">Regular users</p>
                  </div>
                  <div>1,156</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Leaders</p>
                    <p className="text-xs text-muted-foreground">Team managers</p>
                  </div>
                  <div>84</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Admins</p>
                    <p className="text-xs text-muted-foreground">System administrators</p>
                  </div>
                  <div>8</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent System Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Database backup completed", 
                  "Security patch applied", 
                  "User bulk import", 
                  "System update scheduled"
                ].map((event, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${
                      i === 0 ? "bg-green-500" : 
                      i === 1 ? "bg-blue-500" : 
                      i === 2 ? "bg-yellow-500" : 
                      "bg-primary"
                    } mr-2`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{event}</p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "Today, 03:00 AM" : 
                         i === 1 ? "Yesterday, 11:23 PM" : 
                         i === 2 ? "May 15, 2025, 02:45 PM" : 
                         "May 20, 2025, scheduled"}
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

export default AdminDashboard;
