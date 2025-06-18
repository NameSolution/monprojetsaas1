
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/lib/authContext';
import { toast } from '@/components/ui/use-toast';

const LandingPage = lazy(() => import('@/pages/LandingPage.jsx'));
const SuperAdminDashboard = lazy(() => import('@/pages/SuperAdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('@/pages/ClientDashboard.jsx'));
const ChatbotInterface = lazy(() => import('@/pages/ChatbotInterface.jsx'));
const LoginPage = lazy(() => import('@/pages/LoginPage.jsx'));
const HotelInfoPage = lazy(() => import('@/pages/HotelInfoPage.jsx'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <p className="text-foreground">Chargement de la page...</p>
  </div>
);

const ProtectedRouteInner = ({ children, allowedRoles }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    if (location.pathname !== '/login' && location.pathname !== '/') {
      // toast({ variant: "info", title: "Session Expirée", description: "Veuillez vous reconnecter." });
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role ? user.role.trim() : '';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
     if(location.pathname !== "/login" && location.pathname !== "/") {
        toast({ variant: "destructive", title: "Accès Interdit", description: "Vous n'avez pas les droits pour accéder à cette page." });
     }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if ((userRole === 'admin' || userRole === 'manager') && !user.hotel_id) {
    if(location.pathname !== "/login" && location.pathname !== "/") {
        toast({ variant: "destructive", title: "Configuration Requise", description: "Votre compte n'est lié à aucun hôtel. Contactez le support."});
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;
};

const ProtectedRoute = ({ children, allowedRoles }) => (
  <Suspense fallback={<LoadingFallback />}>
    <ProtectedRouteInner allowedRoles={allowedRoles}>
      {children}
    </ProtectedRouteInner>
  </Suspense>
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/superadmin/*" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/client/*"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/bot/:slug" element={<ChatbotInterface />} />
              <Route path="/hotel/:slug" element={<HotelInfoPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
