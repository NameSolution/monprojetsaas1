
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, HardDrive, Clock, Save, Download, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this shadcn component
import { Slider } from '@/components/ui/slider'; // Assuming you have this shadcn component

const SystemView = () => {
    const [cpuData, setCpuData] = useState(Array.from({ length: 10 }, (_, i) => ({ name: `-${9 - i}s`, usage: Math.floor(Math.random() * (60 - 20) + 20) })));
    const [currentCpuUsage, setCurrentCpuUsage] = useState(cpuData[cpuData.length - 1].usage);

    useEffect(() => {
        const interval = setInterval(() => {
            const newUsage = Math.floor(Math.random() * (60 - 20) + 20);
            setCurrentCpuUsage(newUsage);
            setCpuData(prevData => {
                const newData = [...prevData.slice(1), { name: '0s', usage: newUsage }];
                return newData.map((d, i) => ({ ...d, name: `-${9 - i}s` }));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);


    const [settings, setSettings] = useState({
        systemPrompt: "Tu es un assistant virtuel pour un hôtel. Sois concis, poli et professionnel. Ne réponds qu'aux questions relatives à l'hôtel.",
        temperature: 0.5,
    });

    const handleSaveConfig = () => {
        toast({ title: "Configuration sauvegardée", description: "Les paramètres de l'IA ont été mis à jour." });
    };
    
    const handleCreateBackup = () => {
        toast({ title: "Sauvegarde en cours...", description: "La sauvegarde complète du système a démarré." });
    };

    const handleRestoreBackup = () => {
        // This would typically open a file dialog
        toast({ title: "Restauration", description: "Sélectionnez un fichier de sauvegarde pour restaurer." });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="metric-card rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                        <Cpu className="w-10 h-10 text-green-500 components-superadmin-SystemView__text-green-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Utilisation CPU IA</p>
                            <p className="text-2xl font-bold text-foreground">{currentCpuUsage}%</p>
                        </div>
                    </div>
                </div>
                <div className="metric-card rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                        <HardDrive className="w-10 h-10 text-primary components-superadmin-SystemView__text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Utilisation RAM IA</p>
                            <p className="text-2xl font-bold text-foreground">8.2 / 16 GB</p>
                        </div>
                    </div>
                </div>
                <div className="metric-card rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                        <Clock className="w-10 h-10 text-yellow-500 components-superadmin-SystemView__text-yellow-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Latence moyenne</p>
                            <p className="text-2xl font-bold text-foreground">1.2s</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 components-superadmin-SystemView__text-foreground">Utilisation CPU en temps réel</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={cpuData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} cursor={{fill: 'hsl(var(--accent))'}}/>
                        <Line type="monotone" dataKey="usage" name="CPU" stroke="hsl(145 63% 49%)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="dashboard-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 components-superadmin-SystemView__text-foreground">Configuration globale de l'IA</h3>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="systemPrompt" className="text-foreground font-medium components-superadmin-SystemView__text-foreground">Prompt Système Global</Label>
                        <Textarea
                            id="systemPrompt"
                            value={settings.systemPrompt}
                            onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                            className="mt-2 w-full h-24 p-3 bg-secondary border-border rounded-md text-foreground resize-none components-superadmin-SystemView__bg-secondary components-superadmin-SystemView__border-border components-superadmin-SystemView__text-foreground"
                        />
                    </div>
                    <div>
                        <Label className="text-foreground font-medium components-superadmin-SystemView__text-foreground">Température ({settings.temperature})</Label>
                        <Slider 
                            defaultValue={[settings.temperature]} 
                            max={1} 
                            step={0.1} 
                            onValueChange={(value) => setSettings({...settings, temperature: value[0]})}
                            className="w-full mt-2"
                        />
                    </div>
                    <Button className="gradient-bg" onClick={handleSaveConfig}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder la configuration
                    </Button>
                </div>
            </div>
            
             <div className="dashboard-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 components-superadmin-SystemView__text-foreground">Sauvegarde & Restauration</h3>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={handleCreateBackup}>
                        <Download className="w-4 h-4 mr-2" />
                        Créer une sauvegarde complète
                    </Button>
                     <Button variant="outline" onClick={handleRestoreBackup}>
                        <Upload className="w-4 h-4 mr-2" />
                        Restaurer depuis une sauvegarde
                    </Button>
                </div>
             </div>
        </motion.div>
    );
};

export default SystemView;
