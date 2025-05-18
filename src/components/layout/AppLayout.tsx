
import { ReactNode, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Menu, 
  X, 
  Home,
  User,
  Users,
  Settings,
  Shield,
  FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account',
    });
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <a 
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
        closeSidebar();
      }}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h2 className="text-lg font-semibold">Portal</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={closeSidebar}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {user?.role === 'CITIZEN' && (
              <>
                <NavLink href="/dashboard" icon={Home} label="Dashboard" />
                <NavLink href="/complaints" icon={FileText} label="Complaints" />
                <NavLink href="/profile" icon={User} label="My Profile" />
              </>
            )}
            
            {user?.role === 'LEADER' && (
              <>
                <NavLink href="/leader/dashboard" icon={Home} label="Leader Dashboard" />
                <NavLink href="/leader/complaints" icon={FileText} label="Complaints" />
                <NavLink href="/leader/team" icon={Users} label="Team Management" />
                <NavLink href="/profile" icon={User} label="My Profile" />
              </>
            )}
            
            {user?.role === 'ADMIN' && (
              <>
                <NavLink href="/admin/dashboard" icon={Home} label="Admin Dashboard" />
                <NavLink href="/admin/leaders" icon={Users} label="Leaders Management" />
                <NavLink href="/admin/roles" icon={Shield} label="Role Management" />
                <NavLink href="/admin/settings" icon={Settings} label="System Settings" />
                <NavLink href="/profile" icon={User} label="My Profile" />
              </>
            )}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <h1 className="text-lg font-medium ml-2 lg:ml-0">
            {user?.role === 'ADMIN' ? 'Admin Portal' : 
             user?.role === 'LEADER' ? 'Leadership Portal' : 
             'Citizen Portal'}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
