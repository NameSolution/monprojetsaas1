import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Skeleton } from '@/components/ui/skeleton';

const InteractionsView = () => {
  const { data: interactions, loading, fetchInteractions } = useSuperAdminData('interactions');

  useEffect(() => {
    fetchInteractions();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dashboard-card rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">Logs des Interactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-1">Date</th>
                <th className="text-left py-2 px-1">Question</th>
                <th className="text-left py-2 px-1">Réponse</th>
                <th className="text-left py-2 px-1">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {loading && (!interactions || interactions.length === 0) ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-1" colSpan={4}><Skeleton className="h-6 w-full" /></td>
                  </tr>
                ))
              ) : interactions && interactions.length > 0 ? (
                interactions.map(int => (
                  <tr key={int.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="py-2 px-1 text-muted-foreground">{new Date(int.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-1 text-foreground max-w-xs truncate" title={int.user_input}>{int.user_input}</td>
                    <td className="py-2 px-1 text-foreground max-w-xs truncate" title={int.bot_response}>{int.bot_response}</td>
                    <td className="py-2 px-1 text-center">{int.feedback ?? ''}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center py-4 text-muted-foreground" colSpan={4}>Aucune interaction</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractionsView;
