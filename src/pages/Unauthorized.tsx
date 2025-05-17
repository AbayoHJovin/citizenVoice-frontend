
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Shield, Home } from 'lucide-react';

const Unauthorized = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertTitle className="text-xl font-bold text-center">Unauthorized Access</AlertTitle>
          <AlertDescription className="text-center">
            You don't have permission to access this resource.
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            {user?.role === 'CITIZEN' ? 
              'This area is restricted to LEADER or ADMIN roles.' :
            user?.role === 'LEADER' ?
              'This area is restricted to ADMIN roles.' :
              'You do not have the required permissions.'}
          </p>
          
          <Button asChild className="mx-auto">
            <Link to={
              user?.role === 'ADMIN' ? '/admin/dashboard' : 
              user?.role === 'LEADER' ? '/leader/dashboard' : 
              '/dashboard'
            }>
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
