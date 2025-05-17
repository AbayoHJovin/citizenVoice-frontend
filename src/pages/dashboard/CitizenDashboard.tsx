
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AppLayout from "../../components/layout/AppLayout";
import { useAppSelector } from "../../redux/hooks";

const CitizenDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Citizen Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, <span className="font-semibold">{user?.name}</span>!
          </p>
          
          {/* Display location information if available */}
          
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Services Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 new services
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 unread messages
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Document submitted", "Request approved", "Profile updated"].map((activity, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{activity}</p>
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
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Community Meeting", "Resource Fair", "Town Hall"].map((event, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{event}</p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "May 21, 2025" : i === 1 ? "May 28, 2025" : "June 3, 2025"}
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

export default CitizenDashboard;
