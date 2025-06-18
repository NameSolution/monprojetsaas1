import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClientData } from '@/hooks/useClientData';

const AgentBuilderView = () => {
  const { agentNodes, saveAgentNode, deleteAgentNode, loading } = useClientData();
  const [editNode, setEditNode] = useState(null);
  const [data, setData] = useState({ prompt: '', response: '', next_id: '' });

  useEffect(() => {
    if (editNode) {
      setData({ prompt: editNode.prompt, response: editNode.response, next_id: editNode.next_id || '' });
    } else {
      setData({ prompt: '', response: '', next_id: '' });
    }
  }, [editNode]);

  const handleSave = async () => {
    await saveAgentNode({ id: editNode?.id, ...data });
    setEditNode(null);
  };

  return (
    <>
      <DashboardHeader title="Agent Builder" subtitle="Définissez les réponses de votre assistant" />
      <main className="p-6 space-y-4">
        <div className="dashboard-card p-4 rounded-xl">
          <h3 className="font-semibold mb-4">{editNode ? 'Modifier' : 'Nouvelle'} étape</h3>
          <div className="space-y-2">
            <Input placeholder="Prompt" value={data.prompt} onChange={(e) => setData({ ...data, prompt: e.target.value })} />
            <textarea className="w-full border rounded p-2" placeholder="Réponse" value={data.response} onChange={(e) => setData({ ...data, response: e.target.value })} />
            <Input placeholder="ID de l'étape suivante" value={data.next_id} onChange={(e) => setData({ ...data, next_id: e.target.value })} />
            <Button onClick={handleSave} className="gradient-bg">Sauvegarder</Button>
            {editNode && <Button variant="outline" onClick={() => setEditNode(null)}>Annuler</Button>}
          </div>
        </div>
        <div className="dashboard-card p-4 rounded-xl">
          <h3 className="font-semibold mb-4">Étapes existantes</h3>
          {agentNodes.map((n) => (
            <div key={n.id} className="border-b py-2 flex items-center justify-between">
              <div>
                <p className="font-medium">{n.prompt}</p>
                <p className="text-sm text-muted-foreground">{n.response}</p>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => setEditNode(n)}>Éditer</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteAgentNode(n.id)}>Supprimer</Button>
              </div>
            </div>
          ))}
          {agentNodes.length === 0 && !loading && <p className="text-center text-muted-foreground">Aucune étape définie</p>}
        </div>
      </main>
    </>
  );
};

export default AgentBuilderView;
