import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const AgentHistoryView = () => {
  const { allData, fetchAgentVersions } = useSuperAdminData();
  const hotels = allData.hotels || [];
  const [selectedHotel, setSelectedHotel] = useState(hotels[0]?.id || '');
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    if (selectedHotel) {
      fetchAgentVersions(selectedHotel).then(setVersions).catch(() => {});
    }
  }, [selectedHotel]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="space-y-4">
        <Select value={selectedHotel} onValueChange={setSelectedHotel}>
          <SelectTrigger className="bg-secondary border-border w-60">
            <SelectValue placeholder="Choisir un hôtel" />
          </SelectTrigger>
          <SelectContent>
            {hotels.map(h => (
              <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-1 text-left">Date</th>
              <th className="py-2 px-1 text-left">Version ID</th>
            </tr>
          </thead>
          <tbody>
            {versions.map(v => (
              <tr key={v.id} className="border-b border-border/50">
                <td className="py-2 px-1">{new Date(v.created_at).toLocaleString()}</td>
                <td className="py-2 px-1 font-mono text-xs">{v.id}</td>
              </tr>
            ))}
            {versions.length === 0 && (
              <tr>
                <td colSpan={2} className="py-4 text-center text-muted-foreground">Aucune version</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AgentHistoryView;
