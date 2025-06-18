import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClientData } from '@/hooks/useClientData';
import { getLLMResponse } from '@/services/chatbotService';

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
  const [menus, setMenus] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
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
      setMenus(agentConfig.flow?.menus || []);
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
      flow: { ...(agentConfig?.flow || {}), menus }
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
          <div>
            <h4 className="font-medium mb-2">Menus</h4>
            {menus.map((m,idx)=>(
              <div key={idx} className="flex space-x-2 mb-1">
                <Input className="flex-1" value={m.label} onChange={e=>setMenus(ms=>ms.map((it,i)=>i===idx?{...it,label:e.target.value}:it))} placeholder="Label" />
                <Input className="flex-1" value={m.response} onChange={e=>setMenus(ms=>ms.map((it,i)=>i===idx?{...it,response:e.target.value}:it))} placeholder="Réponse" />
                <Button variant="destructive" size="sm" onClick={()=>setMenus(ms=>ms.filter((_,i)=>i!==idx))}>X</Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={()=>setMenus([...menus,{label:'',response:''}])}>Ajouter un menu</Button>
          </div>
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
        <div className="dashboard-card p-4 rounded-xl space-y-2">
          <h3 className="font-semibold">Simulateur</h3>
          <div className="h-48 overflow-y-auto border p-2 rounded">
            {messages.map((m,i)=>(
              <div key={i} className={`text-sm my-1 ${m.role==='user'?'text-right':''}`}>
                <span className="px-2 py-1 rounded bg-secondary inline-block max-w-xs">{m.content}</span>
              </div>
            ))}
          </div>
          <form onSubmit={async e=>{e.preventDefault(); if(!inputMsg.trim()) return; const newMsg={role:'user',content:inputMsg}; setMessages(prev=>[...prev,newMsg]); setInputMsg(''); const res=await getLLMResponse(agentConfig.hotel_id, 'simu', form.language || 'fr', inputMsg); setMessages(prev=>[...prev,{role:'assistant',content:res}]);}} className="flex space-x-2">
            <Input className="flex-1" value={inputMsg} onChange={e=>setInputMsg(e.target.value)} />
            <Button type="submit" size="sm">Envoyer</Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default AgentBuilderView;
