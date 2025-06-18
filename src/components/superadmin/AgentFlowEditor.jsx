import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';

const AgentFlowEditor = () => {
  const { allData, fetchAgentConfig, saveAgentConfig } = useSuperAdminData();
  const hotels = allData.hotels || [];
  const [selectedHotel, setSelectedHotel] = useState(hotels[0]?.id || '');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (selectedHotel) {
      fetchAgentConfig(selectedHotel).then(cfg => {
        if (cfg && cfg.flow) {
          const flow = cfg.flow;
          const n = Object.values(flow).map(n => ({
            id: n.id,
            data: { label: n.message },
            position: { x: n.x || 0, y: n.y || 0 }
          }));
          const e = Object.values(flow)
            .filter(n => n.next)
            .map(n => ({ id: `${n.id}-${n.next}`, source: n.id, target: n.next }));
          setNodes(n);
          setEdges(e);
        } else {
          setNodes([]);
          setEdges([]);
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
        x: node.position.x,
        y: node.position.y
      };
    });
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
        <Button onClick={() => setNodes(n => [...n, { id: `n${n.length+1}`, data: { label: 'Message' }, position: { x: 0, y: 0 } }])}>Ajouter un noeud</Button>
        <Button onClick={handleSave} className="gradient-bg">Sauvegarder</Button>
      </div>
      <div className="h-[500px] border rounded">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={handleConnect} fitView>
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default AgentFlowEditor;
