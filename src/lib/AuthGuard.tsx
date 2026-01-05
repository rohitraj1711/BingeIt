import { useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User is not authenticated - handled by navigation
        // Navigation is handled at app level
      } else if (!requireAuth && user) {
        // User is authenticated - handled by navigation
      }
    }
  }, [user, loading, requireAuth]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};