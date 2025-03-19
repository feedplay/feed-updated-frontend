import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import { useAuth } from './contexts/authContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
]);
