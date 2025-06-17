
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/authContext';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { 
  Shield, 
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  Users,
  BarChart3,
  CreditCard,
  Server,
  Settings as SettingsIcon,
  LifeBuoy,
  Menu
} from 'lucide-react';

const SuperAdminDashboardView = lazy(() => import('@/components/superadmin/SuperAdminDashboardView'));
const ClientsView = lazy(() => import('@/components/superadmin/ClientsView'));
const SystemView = lazy(() => import('@/components/superadmin/SystemView'));
const SuperAdminAnalyticsView = lazy(() => import('@/components/superadmin/AnalyticsView'));
const SuperAdminBillingView = lazy(() => import('@/components/superadmin/BillingView'));
const SuperAdminSettingsView = lazy(() => import('@/components/superadmin/SettingsView'));
const SupportTicketsView = lazy(() => import('@/components/superadmin/SupportTicketsView')); 

const LoadingViewFallback = () => (
  <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
    <p className="text-foreground">Chargement de la vue...</p>
  </div>
);

const SuperAdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const { data: supportTicketsData, loading: ticketsLoading } = useSuperAdminData('supportTickets');
  const [notifications, setNotifications] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!ticketsLoading && supportTicketsData) {
        const newTicketsCount = supportTicketsData.filter(ticket => ticket.status === 'Nouveau').length;
        setNotifications(newTicketsCount);
    }
  }, [supportTicketsData, ticketsLoading]);


  const getActiveTab = () => {
    const path = location.pathname.split('/').pop();
    if (['clients', 'analytics', 'billing', 'system', 'settings', 'support-tickets'].includes(path)) {
      return path;
    }
    return 'dashboard';
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login'); 
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(!searchTerm.trim()) {
        toast({title: "Recherche vide", description: "Veuillez entrer un terme à rechercher."});
        return;
    }
    toast({
        title: "Recherche en cours...",
        description: `🚧 Recherche pour "${searchTerm}" - fonctionnalité à venir ! 🚀`,
    });
  };

  const Sidebar = () => (
    <div
      className={`w-64 sidebar-nav h-screen fixed left-0 top-0 p-6 flex flex-col z-50 transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-bold gradient-text">Super Admin</span>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
          <span className="sr-only">Fermer</span>
          ✕
        </Button>
      </div>

      <nav className="space-y-2 flex-grow">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin' },
          { id: 'clients', icon: Users, label: 'Hôtels & Utilisateurs', path: '/superadmin/clients' },
          { id: 'support-tickets', icon: LifeBuoy, label: 'Support Tickets', path: '/superadmin/support-tickets', badge: notifications > 0 ? notifications : null },
          { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/superadmin/analytics' },
          { id: 'billing', icon: CreditCard, label: 'Facturation', path: '/superadmin/billing' },
          { id: 'system', icon: Server, label: 'Système IA', path: '/superadmin/system' },
          { id: 'settings', icon: SettingsIcon, label: 'Paramètres', path: '/superadmin/settings' }
        ].map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg text-left ${
              getActiveTab() === item.id ? 'active' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div>
         <div className="mb-4 text-center">
            <p className="text-sm font-medium text-foreground">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground">Super Administrateur</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleLogout}
          disabled={authLoading} 
        >
          <LogOut className="w-4 h-4 mr-2" />
          {authLoading ? "Chargement..." : "Déconnexion"}
        </Button>
      </div>
    </div>
  );

  const Header = () => (
    <div className="bg-card/80 backdrop-filter backdrop-blur-lg border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </form>

        <div className="flex items-center space-x-4">
          <Link to="/superadmin/support-tickets">
            <Button 
              variant="outline" 
              size="icon"
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
  
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-foreground">Chargement du dashboard Super Admin...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-primary-foreground p-2 rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="md:ml-64">
        <Header />
        <main className="p-6">
           <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingViewFallback />}>
                <Routes location={location} key={location.pathname}>
                <Route index element={<SuperAdminDashboardView />} />
                <Route path="clients" element={<ClientsView />} />
                <Route path="support-tickets" element={<SupportTicketsView />} />
                <Route path="system" element={<SystemView />} />
                <Route path="analytics" element={<SuperAdminAnalyticsView />} />
              <Route path="billing" element={<SuperAdminBillingView />} />
              <Route path="settings" element={<SuperAdminSettingsView />} />
              <Route path="*" element={<div className="text-center py-10">Page non trouvée</div>} />
                </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
