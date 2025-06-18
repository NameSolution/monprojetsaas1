import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { getLLMResponse } from '@/services/chatbotService';

const AgentFlowEditor = () => {
  const { allData, fetchAgentConfig, saveAgentConfig } = useSuperAdminData();
  const hotels = allData.hotels || [];
  const [selectedHotel, setSelectedHotel] = useState(hotels[0]?.id || '');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [agentConfig, setAgentConfig] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    if (selectedHotel) {
      fetchAgentConfig(selectedHotel).then(cfg => {
        if (cfg && cfg.flow) {
          const flow = cfg.flow;
          const n = Object.values(flow).map(n => ({
            id: n.id,
            data: { label: n.message, type: n.type || 'text', slot: n.slot || '', options: n.options || '', api: n.api || '', cond: n.cond || '' },
            position: { x: n.x || 0, y: n.y || 0 }
          }));
          const e = Object.values(flow)
            .filter(n => n.next)
            .map(n => ({ id: `${n.id}-${n.next}`, source: n.id, target: n.next }));
          setNodes(n);
          setEdges(e);
          setAgentConfig(cfg);
        } else {
          setNodes([]);
          setEdges([]);
          setAgentConfig(null);
        }
      });
    }
  }, [selectedHotel]);

  const handleConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const handleSave = () => {
    const flow = {};
    nodes.forEach((node) => {
      const next = edges.find((e) => e.source === node.id);
      flow[node.id] = {
        id: node.id,
        message: node.data.label,
        next: next ? next.target : null,
        type: node.data.type,
        slot: node.data.slot,
        options: node.data.options,
        api: node.data.api,
        cond: node.data.cond,
        x: node.position.x,
        y: node.position.y
      };
    });

    const startId = nodes[0]?.id;
    if (!startId) return;
    const visited = new Set();
    const stack = new Set();
    const adj = {};
    nodes.forEach(n => { adj[n.id] = edges.filter(e=>e.source===n.id).map(e=>e.target); });
    let hasCycle = false;
    function dfs(id){
      if(stack.has(id)){ hasCycle=true; return; }
      if(visited.has(id)) return;
      visited.add(id); stack.add(id);
      (adj[id]||[]).forEach(dfs);
      stack.delete(id);
    }
    dfs(startId);
    if(hasCycle || visited.size !== nodes.length){
      alert('Flow invalide: boucle ou noeuds inaccessibles');
      return;
    }

    saveAgentConfig(selectedHotel, { flow });
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center space-x-4">
        <Select value={selectedHotel} onValueChange={setSelectedHotel}>
          <SelectTrigger className="bg-secondary border-border text-foreground w-60">
            <SelectValue placeholder="Choisir un hôtel" />
          </SelectTrigger>
          <SelectContent>
            {hotels.map(h => (
              <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setNodes(n => [...n, { id: `n${n.length+1}`, data: { label: 'Message', type: 'text', slot:'', options:'', api:'', cond:'' }, position: { x: 0, y: 0 } }])}>Ajouter un noeud</Button>
        <Button onClick={handleSave} className="gradient-bg">Sauvegarder</Button>
      </div>
      <div className="h-[500px] border rounded">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={handleConnect} onNodeClick={(_,node)=>setSelectedNodeId(node.id)} fitView>
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      {selectedNodeId && (
        <div className="space-y-2 p-4 border rounded">
          <h4 className="font-semibold">Éditer le noeud {selectedNodeId}</h4>
          <Select
            value={nodes.find(n=>n.id===selectedNodeId)?.data.type || 'text'}
            onValueChange={val => setNodes(n=>n.map(node=>node.id===selectedNodeId?{...node,data:{...node.data,type:val}}:node))}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['text','question','choice','api','condition','end'].map(t=>(
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Message"
            value={nodes.find(n=>n.id===selectedNodeId)?.data.label || ''}
            onChange={e=>setNodes(n=>n.map(node=>node.id===selectedNodeId?{...node,data:{...node.data,label:e.target.value}}:node))}
          />
          {['question'].includes(nodes.find(n=>n.id===selectedNodeId)?.data.type) && (
            <Input placeholder="Variable" value={nodes.find(n=>n.id===selectedNodeId)?.data.slot||''} onChange={e=>setNodes(n=>n.map(node=>node.id===selectedNodeId?{...node,data:{...node.data,slot:e.target.value}}:node))} />
          )}
          {['choice'].includes(nodes.find(n=>n.id===selectedNodeId)?.data.type) && (
            <Input placeholder="Options a|b" value={nodes.find(n=>n.id===selectedNodeId)?.data.options||''} onChange={e=>setNodes(n=>n.map(node=>node.id===selectedNodeId?{...node,data:{...node.data,options:e.target.value}}:node))} />
          )}
          {['api'].includes(nodes.find(n=>n.id===selectedNodeId)?.data.type) && (
            <Input placeholder="API URL" value={nodes.find(n=>n.id===selectedNodeId)?.data.api||''} onChange={e=>setNodes(n=>n.map(node=>node.id===selectedNodeId?{...node,data:{...node.data,api:e.target.value}}:node))} />
          )}
          {['condition'].includes(nodes.find(n=>n.id===selectedNodeId)?.data.type) && (
            <Input placeholder="Condition JS" value={nodes.find(n=>n.id===selectedNodeId)?.data.cond||''} onChange={e=>setNodes(n=>n.map(node=>node.id===selectedNodeId?{...node,data:{...node.data,cond:e.target.value}}:node))} />
          )}
        </div>
      )}
      <div className="space-y-2 p-4 border rounded">
        <h4 className="font-semibold">Simulateur</h4>
        <div className="h-48 overflow-y-auto border p-2 rounded">
          {messages.map((m,i)=>(
            <div key={i} className={`text-sm my-1 ${m.role==='user'?'text-right':''}`}>
              <span className="px-2 py-1 rounded bg-secondary inline-block max-w-xs">{m.content}</span>
            </div>
          ))}
        </div>
        <form onSubmit={async e=>{e.preventDefault(); if(!inputMsg.trim()) return; const msg={role:'user',content:inputMsg}; setMessages(prev=>[...prev,msg]); setInputMsg(''); const lang=agentConfig?.language||'fr'; const res=await getLLMResponse(selectedHotel,'editor',lang,inputMsg); setMessages(prev=>[...prev,{role:'assistant',content:res}]);}} className="flex space-x-2">
          <Input className="flex-1" value={inputMsg} onChange={e=>setInputMsg(e.target.value)} />
          <Button type="submit" size="sm">Envoyer</Button>
        </form>
      </div>
    </div>
  );
};

export default AgentFlowEditor;
