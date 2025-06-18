import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClientData } from '@/hooks/useClientData';

const AgentBuilderView = () => {
  const { agentConfig, saveAgentConfig, knowledgeBase, updateKnowledgeBase, deleteKnowledgeItem, loading } = useClientData();
  const [form, setForm] = useState({
    name: '',
    persona: '',
    language: '',
    greeting: '',
    modules: [],
    memoryVars: ''
  });
  const [editingItem, setEditingItem] = useState(null);
  const [itemData, setItemData] = useState('');

  useEffect(() => {
    if (agentConfig) {
      setForm({
        name: agentConfig.name || '',
        persona: agentConfig.persona || '',
        language: agentConfig.language || '',
        greeting: agentConfig.greeting || '',
        modules: agentConfig.modules || [],
        memoryVars: (agentConfig.memory_vars || []).join(',')
      });
    }
  }, [agentConfig]);

  const handleSave = async () => {
    const payload = {
      ...form,
      memory_vars: form.memoryVars
        .split(',')
        .map(v => v.trim())
        .filter(v => v),
      modules: form.modules,
      flow: agentConfig?.flow || {}
    };
    await saveAgentConfig(payload);
  };

  return (
    <>
      <DashboardHeader title="Agent Builder" subtitle="Configurez votre assistant" />
      <main className="p-6 space-y-4">
        <div className="dashboard-card p-4 rounded-xl space-y-2">
          <Input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Persona" value={form.persona} onChange={e => setForm({ ...form, persona: e.target.value })} />
          <Input placeholder="Langue" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} />
          <Input placeholder="Message d'accueil" value={form.greeting} onChange={e => setForm({ ...form, greeting: e.target.value })} />
          <div className="flex space-x-4">
            {['weather','booking','menu','checkin'].map(mod => (
              <label key={mod} className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.modules.includes(mod)}
                  onChange={e => {
                    const checked = e.target.checked;
                    setForm(prev => ({
                      ...prev,
                      modules: checked
                        ? [...prev.modules, mod]
                        : prev.modules.filter(m => m !== mod)
                    }));
                  }}
                />
                <span>{mod}</span>
              </label>
            ))}
          </div>
          <Input
            placeholder="Variables (ex: nom, date)"
            value={form.memoryVars}
            onChange={e => setForm({ ...form, memoryVars: e.target.value })}
          />
          <Button onClick={handleSave} className="gradient-bg">Sauvegarder</Button>
        </div>
        <div className="dashboard-card p-4 rounded-xl">
          <h3 className="font-semibold mb-4">Base de connaissances</h3>
          {knowledgeBase.map(item => (
            <div key={item.id} className="border-b py-2 flex items-center justify-between">
              <p className="text-sm flex-1 mr-2">{item.info}</p>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => { setEditingItem(item); setItemData(item.info); }}>Éditer</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteKnowledgeItem(item.id)}>Supprimer</Button>
              </div>
            </div>
          ))}
          {knowledgeBase.length === 0 && !loading && <p className="text-muted-foreground text-center">Aucune information</p>}
        </div>
        {editingItem && (
          <div className="dashboard-card p-4 rounded-xl space-y-2">
            <textarea className="w-full border rounded p-2" rows="3" value={itemData} onChange={e => setItemData(e.target.value)} />
            <div className="space-x-2">
              <Button onClick={() => { updateKnowledgeBase({ id: editingItem.id, info: itemData }); setEditingItem(null); }} className="gradient-bg">Enregistrer</Button>
              <Button variant="outline" onClick={() => setEditingItem(null)}>Annuler</Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AgentBuilderView;
