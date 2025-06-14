
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/client/DashboardHeader';
import { 
  Palette, 
  MessageSquare, 
  QrCode,
  Eye,
  TestTube,
  TrendingUp,
  BrainCircuit,
  Languages
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClientData } from '@/hooks/useClientData';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardView = () => {
  const { stats, recentConversations, profile, loading } = useClientData();

  const handleViewConversation = (convId) => {
    toast({
        title: "Voir Conversation",
        description: `🚧 Affichage des détails pour la conversation ID: ${convId} - fonctionnalité à venir ! 🚀`,
    });
  };

  if (loading) {
      return (
          <>
            <DashboardHeader 
                title="Dashboard Principal"
                subtitle="Chargement des données..."
            />
            <main className="p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-28 rounded-xl" />
                        <Skeleton className="h-28 rounded-xl" />
                    </div>
                     <div className="grid lg:grid-cols-3 gap-6">
                        <Skeleton className="h-48 rounded-xl" />
                        <Skeleton className="h-48 rounded-xl lg:col-span-2" />
                    </div>
                </div>
            </main>
          </>
      )
  }

  return (
    <>
      <DashboardHeader 
        title="Dashboard Principal"
        subtitle={profile.hotelName || "Assistant virtuel"}
      />
      <main className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="metric-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversations (Total)</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalConversations.toLocaleString()}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
    
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="metric-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Base de connaissances</p>
                  <p className="text-lg font-bold text-foreground">Prête</p>
                   <p className="text-sm text-muted-foreground mt-1">
                    Accessible via l'onglet dédié
                  </p>
                </div>
                <BrainCircuit className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>
          </div>
    
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="dashboard-card rounded-xl p-6 lg:col-span-1"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-primary" />
                Actions Rapides
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-20 flex-col"><Link to="/client/customize"><Palette className="w-6 h-6 mb-2" />Personnaliser</Link></Button>
                <Button asChild variant="outline" className="h-20 flex-col"><Link to="/client/knowledge"><BrainCircuit className="w-6 h-6 mb-2" />Connaissances</Link></Button>
                <Button asChild variant="outline" className="h-20 flex-col"><Link to="/client/languages"><Languages className="w-6 h-6 mb-2" />Langues</Link></Button>
                <Button asChild variant="outline" className="h-20 flex-col"><Link to="/client/qr-code"><QrCode className="w-6 h-6 mb-2" />QR Code</Link></Button>
                <Button variant="outline" className="h-20 flex-col col-span-2" onClick={() => window.open(`/bot/${profile.slug || 'default-slug'}`, '_blank')}><TestTube className="w-6 h-6 mb-2" />Tester le Chatbot</Button>
              </div>
            </motion.div>
    
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="dashboard-card rounded-xl p-6 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                    Conversations Récentes
                  </h3>
                  <Button asChild variant="outline" size="sm"><Link to="/client/analytics">Voir tout</Link></Button>
              </div>
              {recentConversations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-muted-foreground font-medium py-3">Langue</th>
                        <th className="text-left text-muted-foreground font-medium py-3">Heure</th>
                        <th className="text-left text-muted-foreground font-medium py-3">Thème principal</th>
                        <th className="text-left text-muted-foreground font-medium py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentConversations.map((conv) => (
                        <tr key={conv.id} className="border-b border-border/50">
                          <td className="py-4">
                            <div className={`language-flag flag-${conv.language} inline-block mr-2`}></div>
                            <span className="text-foreground">{conv.language.toUpperCase()}</span>
                          </td>
                          <td className="py-4 text-foreground">{conv.time}</td>
                          <td className="py-4 text-foreground">{conv.theme}</td>
                          <td className="py-4">
                            <Button variant="outline" size="sm" onClick={() => handleViewConversation(conv.id)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucune conversation récente.</p>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardView;
