import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Skeleton } from '@/components/ui/skeleton';
import HotelsView from './HotelsView';
import UsersView from './UsersView';

const ClientsView = () => {
  const { data: clients, loading } = useSuperAdminData('clients');

  const [showHotels, setShowHotels] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dashboard-card rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Aperçu Clients</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Hotel</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Slug</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Utilisateur</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Email</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading && (!clients || clients.length === 0) ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-2 px-2"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-2 px-2"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-2 px-2"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-2 px-2"><Skeleton className="h-4 w-40" /></td>
                    <td className="py-2 px-2"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              ) : (
                clients && clients.map(client => (
                  <tr key={client.hotel_id} className="border-b border-border">
                    <td className="py-2 px-2">{client.hotel_name}</td>
                    <td className="py-2 px-2">{client.slug}</td>
                    <td className="py-2 px-2">{client.user_name}</td>
                    <td className="py-2 px-2">{client.email}</td>
                    <td className="py-2 px-2">{client.status || 'active'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showHotels ? (
        <div className="relative">
          <button onClick={() => setShowHotels(false)} className="absolute right-4 top-4 text-muted-foreground">Fermer</button>
          <HotelsView />
        </div>
      ) : (
        <button className="mb-4 underline" onClick={() => setShowHotels(true)}>Ouvrir gestion des hôtels</button>
      )}
      <div className="my-8" />
      {showUsers ? (
        <div className="relative">
          <button onClick={() => setShowUsers(false)} className="absolute right-4 top-4 text-muted-foreground">Fermer</button>
          <UsersView />
        </div>
      ) : (
        <button className="mb-4 underline" onClick={() => setShowUsers(true)}>Ouvrir gestion des utilisateurs</button>
      )}
    </motion.div>
  );
};

export default ClientsView;
