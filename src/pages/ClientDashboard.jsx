import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/authContext';
import { useClientData } from '@/hooks/useClientData';
import {
  Bot,
  Palette,
  BrainCircuit,
  Settings,
  BarChart3,
  QrCode,
  LogOut,
  TestTube,
  BookUser,
  LayoutDashboard,
  Bell,
  Menu,
  Languages as LanguagesIcon,
  LifeBuoy
} from 'lucide-react';

const DashboardView = lazy(() => import('@/components/client/DashboardView'));
const CustomizeView = lazy(() => import('@/components/client/CustomizeView'));
const KnowledgeView = lazy(() => import('@/components/client/IntentsView'));
const QRCodeView = lazy(() => import('@/components/client/QRCodeView'));
const AnalyticsView = lazy(() => import('@/components/client/AnalyticsView'));
const SettingsView = lazy(() => import('@/components/client/SettingsView'));
const LanguagesView = lazy(() => import('@/components/client/LanguagesView'));
const SupportView = lazy(() => import('@/components/client/SupportView'));

const LoadingViewFallback = () => (
  <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
    <p className="text-foreground">Chargement de la vue...</p>
  </div>
);


const ClientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const { profile, loading: clientDataLoading } = useClientData(); 

  const getActiveTab = () => {
    const path = location.pathname.split('/').pop();
    if (['customize', 'knowledge', 'analytics', 'qr-code', 'settings', 'documentation', 'languages', 'support'].includes(path)) {
      return path;
    }
    return 'dashboard';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleTestChatbot = () => {
     if (profile && profile.slug) {
         window.open(`/bot/${profile.slug}`, '_blank');
     } else {
         toast({title: "Slug manquant", description: "Impossible de tester le chatbot sans slug configuré."})
     }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
  }, [sidebarOpen]);

  const Sidebar = () => (
    <div
      className={`w-64 sidebar-nav h-screen fixed left-0 top-0 p-6 flex flex-col z-50 transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Bot className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold gradient-text">HotelBot</span>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
          <span className="sr-only">Fermer</span>
          ✕
        </Button>
      </div>

      <nav className="space-y-2 flex-grow">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
          { id: 'customize', icon: Palette, label: 'Personnalisation', path: '/client/customize' },
          { id: 'knowledge', icon: BrainCircuit, label: 'Base de Connaissances', path: '/client/knowledge' },
          { id: 'languages', icon: LanguagesIcon, label: 'Langues', path: '/client/languages' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/client/analytics' },
          { id: 'qr-code', icon: QrCode, label: 'QR Code & Lien', path: '/client/qr-code' },
          { id: 'settings', icon: Settings, label: 'Paramètres & Compte', path: '/client/settings' },
          { id: 'support', icon: LifeBuoy, label: 'Support', path: '/client/support' },
          { id: 'documentation', icon: BookUser, label: 'Documentation', path: '/client/documentation' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                getActiveTab() === item.id ? 'active' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div>
        <Button 
          variant="outline" 
          className="w-full mb-3"
          onClick={handleTestChatbot}
          disabled={clientDataLoading || !profile?.slug}
        >
          <TestTube className="w-4 h-4 mr-2" />
          Tester le Chatbot
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleLogout}
          disabled={authLoading}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {authLoading ? "Déconnexion..." : "Déconnexion"}
        </Button>
      </div>
    </div>
  );

  if (authLoading || clientDataLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-foreground">Chargement du dashboard client...</p></div>;
  }

  if (!user && !authLoading) { 
    return null; 
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
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingViewFallback />}>
            <Routes location={location} key={location.pathname}>
              <Route path="" element={<DashboardView />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="customize" element={<CustomizeView />} />
              <Route path="knowledge" element={<KnowledgeView />} />
              <Route path="languages" element={<LanguagesView />} />
              <Route path="qr-code" element={<QRCodeView />} />
              <Route path="analytics" element={<AnalyticsView />} />
              <Route path="support" element={<SupportView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="documentation" element={<DocumentationView />} />
              <Route path="*" element={<PlaceholderView title="Page non trouvée" message="Désolé, cette page n'existe pas." />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </div>
  );
};

const PlaceholderView = ({ title, message }) => {
    const location = useLocation();
    const sectionName = title || location.pathname.split('/').pop();
    const defaultMessage = message || "Cette section est en cours de construction et sera bientôt disponible.";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
        >
            <div className="dashboard-card rounded-xl p-8 text-center mt-16">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                   <span className="capitalize">{sectionName}</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                    {defaultMessage}
                </p>
            </div>
        </motion.div>
    )
}

const DocumentationView = () => {
    return (
        <>
            <ClientDashboardHeader 
                title="Documentation"
                subtitle="Guides et ressources pour utiliser HotelBot AI"
            />
            <main className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-card rounded-xl p-6"
                >
                    <h3 className="text-xl font-semibold text-foreground mb-6">Guides d'Utilisation</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-secondary rounded-lg">
                            <h4 className="font-medium text-foreground">Configurer votre Chatbot</h4>
                            <p className="text-sm text-muted-foreground">Apprenez à personnaliser l'apparence et le message d'accueil.</p>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg">
                            <h4 className="font-medium text-foreground">Gérer la Base de Connaissances</h4>
                            <p className="text-sm text-muted-foreground">Comment ajouter et modifier les informations que votre chatbot utilise.</p>
                        </div>
                         <div className="p-4 bg-secondary rounded-lg">
                            <h4 className="font-medium text-foreground">Analyser les Performances</h4>
                            <p className="text-sm text-muted-foreground">Comprendre les statistiques et les rapports d'utilisation.</p>
                        </div>
                         <div className="p-4 bg-secondary rounded-lg">
                            <h4 className="font-medium text-foreground">Gérer les Langues</h4>
                            <p className="text-sm text-muted-foreground">Activer, désactiver et définir la langue par défaut pour votre assistant.</p>
                        </div>
                    </div>
                     <Button className="mt-6" onClick={() => toast({title: "Support Contacté", description:"Notre équipe vous répondra bientôt."})}>Contacter le Support</Button>
                </motion.div>
            </main>
        </>
    );
};

const ClientDashboardHeader = ({ title, subtitle }) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="bg-card/80 backdrop-filter backdrop-blur-lg border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'status-online' : 'status-offline'}`}></div>
            <span className={`text-sm font-medium ${isActive ? 'text-green-500' : 'text-destructive'}`}>
              {isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => toast({ title: "Notifications", description: "Aucune nouvelle notification." })}
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};


export default ClientDashboard;
