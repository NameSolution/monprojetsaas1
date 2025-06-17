
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Hotel, Users, MessageSquare, DollarSign, AlertTriangle, Eye, Edit } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Skeleton } from "@/components/ui/skeleton";

const SuperAdminDashboardView = () => {
  const { data, loading } = useSuperAdminData('dashboard');

  const handleViewHotelDetails = (hotelId) => {
    toast({
        title: "Voir Détails Hôtel",
        description: `🚧 Affichage des détails pour l'hôtel ID: ${hotelId} - fonctionnalité à venir ! 🚀`,
    });
  };

  const handleEditHotel = (hotelId) => {
    toast({
        title: "Modifier Hôtel",
        description: `🚧 Modification de l'hôtel ID: ${hotelId} - fonctionnalité à venir ! 🚀`,
    });
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const { stats, revenueData, recentHotels, systemAlerts } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="metric-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Hôtels Actifs</p><p className="text-2xl font-bold text-foreground">{stats.totalHotels}</p></div>
            <Hotel className="w-8 h-8 text-primary" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="metric-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Utilisateurs Actifs</p><p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p></div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="metric-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Conversations</p><p className="text-2xl font-bold text-foreground">{stats.totalConversations ? stats.totalConversations.toLocaleString() : 0}</p></div>
            <MessageSquare className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="metric-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Revenus Mensuels</p><p className="text-2xl font-bold text-foreground">{stats.monthlyRevenue ? stats.monthlyRevenue.toLocaleString() : 0}€</p></div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="dashboard-card rounded-xl p-6 lg:col-span-2">
           <h3 className="text-lg font-semibold text-foreground mb-4">Évolution des revenus (6 derniers mois)</h3>
           <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `${value/1000}k€`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} cursor={{fill: 'hsl(var(--accent))'}} />
                    <Line type="monotone" dataKey="revenue" name="Revenus" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="dashboard-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />Alertes Système</h3>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${ alert.type === 'error' ? 'bg-destructive' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-primary'}`}></div>
                <div className="flex-1"><p className="text-foreground text-sm">{alert.message}</p><p className="text-muted-foreground text-xs mt-1">Il y a {alert.time}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center"><Hotel className="w-5 h-5 mr-2 text-primary" />Hôtels Récemment Actifs</h3>
          <Button asChild variant="outline" size="sm"><Link to="/superadmin/hotels">Voir tout</Link></Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground font-medium py-3">Nom</th>
                <th className="text-left text-muted-foreground font-medium py-3">Statut</th>
                <th className="text-left text-muted-foreground font-medium py-3">Utilisateurs</th>
                <th className="text-left text-muted-foreground font-medium py-3">Conversations</th>
                <th className="text-left text-muted-foreground font-medium py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentHotels.map((hotel) => (
                <tr key={hotel.id} className="border-b border-border/50 hover:bg-secondary/50">
                  <td className="py-4 text-foreground">{hotel.name}</td>
                  <td className="py-4"><span className={`px-2 py-1 rounded-full text-xs ${hotel.status === 'active' ? 'bg-green-500/20 text-green-600' : 'bg-destructive/20 text-destructive'}`}>{hotel.status === 'active' ? 'Actif' : 'Suspendu'}</span></td>
                  <td className="py-4 text-muted-foreground">{hotel.users}</td>
                  <td className="py-4 text-muted-foreground">{hotel.conversations}</td>
                  <td className="py-4"><div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewHotelDetails(hotel.id)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditHotel(hotel.id)}><Edit className="w-4 h-4" /></Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminDashboardView;
