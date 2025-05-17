
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AppLayout from "../../components/layout/AppLayout";
import { useAppSelector } from "../../redux/hooks";

const LeaderDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Team Leader Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your team and responsibilities.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 since last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                -3 since last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground mt-1">
                1 approaching deadline
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5% from previous quarter
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
