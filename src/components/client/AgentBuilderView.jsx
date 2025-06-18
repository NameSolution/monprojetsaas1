import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClientData } from '@/hooks/useClientData';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AgentBuilderView = () => {
  const { agentNodes, saveAgentNode, deleteAgentNode, knowledgeBase, updateKnowledgeBase, deleteKnowledgeItem, loading } = useClientData();
  const [editNode, setEditNode] = useState(null);
  const [data, setData] = useState({ prompt: '', response: '', next_id: '', buttons: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemData, setItemData] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (editNode) {
      setData({
        prompt: editNode.prompt,
        response: editNode.response,
        next_id: editNode.next_id || '',
        buttons: editNode.buttons ? JSON.stringify(editNode.buttons) : ''
      });
    } else {
      setData({ prompt: '', response: '', next_id: '', buttons: '' });
    }
  }, [editNode]);

  const handleSave = async () => {
    let buttons;
    try {
      buttons = data.buttons ? JSON.parse(data.buttons) : null;
    } catch (e) {
      alert('Format des boutons invalide');
      return;
    }
    await saveAgentNode({ id: editNode?.id, ...data, buttons });
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
            <Input placeholder="Boutons (JSON)" value={data.buttons} onChange={(e) => setData({ ...data, buttons: e.target.value })} />
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
                {n.buttons && (
                  <p className="text-xs text-muted-foreground">Boutons: {n.buttons.map(b => b.label).join(', ')}</p>
                )}
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => setEditNode(n)}>Éditer</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteAgentNode(n.id)}>Supprimer</Button>
              </div>
            </div>
          ))}
          {agentNodes.length === 0 && !loading && <p className="text-center text-muted-foreground">Aucune étape définie</p>}
        </div>

        <div className="dashboard-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Base de connaissances</h3>
            <Button size="sm" onClick={() => { setEditingItem(null); setItemData(''); setIsModalOpen(true); }} className="gradient-bg"><Plus className="w-4 h-4 mr-2" />Ajouter</Button>
          </div>
          <div className="space-y-2">
            {knowledgeBase.map(item => (
              <div key={item.id} className="border-b py-2 flex items-center justify-between">
                <p className="text-sm flex-1 mr-2">{item.info}</p>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingItem(item); setItemData(item.info); setIsModalOpen(true); }}><Edit className="w-4 h-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" onClick={() => setItemToDelete(item)}><Trash2 className="w-4 h-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Supprimer?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => { await deleteKnowledgeItem(item.id); setItemToDelete(null); }}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
            {knowledgeBase.length === 0 && !loading && <p className="text-muted-foreground text-center">Aucune information</p>}
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Modifier' : 'Ajouter'} une information</DialogTitle>
            <DialogDescription>Contenu à mémoriser pour le chatbot</DialogDescription>
          </DialogHeader>
          <textarea className="w-full border rounded p-2 mb-4" rows="4" value={itemData} onChange={e => setItemData(e.target.value)} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={async () => { await updateKnowledgeBase({ id: editingItem?.id, info: itemData }); setIsModalOpen(false); }} className="gradient-bg">Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentBuilderView;
