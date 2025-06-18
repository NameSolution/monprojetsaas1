
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Save, Download, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';

const SystemView = () => {
    const { fetchAISettings, saveAISettings } = useSuperAdminData();

    const [settings, setSettings] = useState({
        systemPrompt: '',
        temperature: 0.5,
        apiUrl: '',
        apiKey: '',
        model: ''
    });

    useEffect(() => {
        fetchAISettings().then(res => {
            setSettings(prev => ({
                ...prev,
                apiUrl: res.ai_api_url,
                apiKey: res.ai_api_key,
                model: res.ai_model
            }));
        }).catch(() => {});
    }, []);

    const handleSaveConfig = async () => {
        try {
            await saveAISettings({ ai_api_url: settings.apiUrl, ai_api_key: settings.apiKey, ai_model: settings.model });
            toast({ title: 'Configuration sauvegardée' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erreur', description: err.message });
        }
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
                    <div>
                        <Label htmlFor="apiUrl" className="text-foreground font-medium">API URL</Label>
                        <Input id="apiUrl" value={settings.apiUrl} onChange={(e) => setSettings({...settings, apiUrl: e.target.value})} className="mt-2 bg-secondary border-border text-foreground" />
                    </div>
                    <div>
                        <Label htmlFor="apiKey" className="text-foreground font-medium">Clé API</Label>
                        <Input id="apiKey" value={settings.apiKey} onChange={(e) => setSettings({...settings, apiKey: e.target.value})} className="mt-2 bg-secondary border-border text-foreground" />
                    </div>
                    <div>
                        <Label htmlFor="model" className="text-foreground font-medium">Modèle</Label>
                        <Input id="model" value={settings.model} onChange={(e) => setSettings({...settings, model: e.target.value})} className="mt-2 bg-secondary border-border text-foreground" />
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
