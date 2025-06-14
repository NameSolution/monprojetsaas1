
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Save, Key, Mail, Power } from 'lucide-react';

const SuperAdminSettingsView = () => {
    const [settings, setSettings] = useState({
        stripeApiKey: '', 
        smtpHost: '',
        smtpPort: '',
        smtpUser: '',
        smtpPass: '',
        maintenanceMode: false,
    });

    const handleSave = () => {
        toast({ 
            title: "Sauvegarde des Paramètres", 
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀"
        });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dashboard-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Paramètres Généraux</h2>
                <div className="space-y-8 max-w-2xl">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Key className="w-5 h-5 mr-2 text-purple-500" />
                            Clés d'API
                        </h3>
                        <div className="space-y-4 p-4 bg-secondary rounded-lg">
                            <Label htmlFor="stripe-key" className="text-foreground">Clé publique Stripe</Label>
                            <Input
                                id="stripe-key"
                                type="password"
                                value={settings.stripeApiKey}
                                onChange={(e) => setSettings({ ...settings, stripeApiKey: e.target.value })}
                                className="bg-background border-border text-foreground"
                                placeholder="pk_test_xxxxxxxxxxxx"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-primary" />
                            Paramètres Email (SMTP)
                        </h3>
                         <div className="space-y-4 p-4 bg-secondary rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="smtp-host" className="text-foreground">Hôte SMTP</Label>
                                    <Input id="smtp-host" type="text" value={settings.smtpHost} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} className="bg-background border-border text-foreground" placeholder="smtp.example.com"/>
                                </div>
                                <div>
                                    <Label htmlFor="smtp-port" className="text-foreground">Port SMTP</Label>
                                    <Input id="smtp-port" type="text" value={settings.smtpPort} onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })} className="bg-background border-border text-foreground" placeholder="587"/>
                                </div>
                            </div>
                             <div>
                                <Label htmlFor="smtp-user" className="text-foreground">Utilisateur SMTP</Label>
                                <Input id="smtp-user" type="text" value={settings.smtpUser} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} className="bg-background border-border text-foreground" placeholder="utilisateur@example.com"/>
                            </div>
                             <div>
                                <Label htmlFor="smtp-pass" className="text-foreground">Mot de passe SMTP</Label>
                                <Input id="smtp-pass" type="password" value={settings.smtpPass} onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })} className="bg-background border-border text-foreground" placeholder="••••••••"/>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Power className="w-5 h-5 mr-2 text-destructive" />
                            Maintenance
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                            <Label htmlFor="maintenance-mode" className="text-foreground font-medium">Activer le mode maintenance</Label>
                            <Switch
                                id="maintenance-mode"
                                checked={settings.maintenanceMode}
                                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                            />
                        </div>
                         {settings.maintenanceMode && <p className="text-xs text-destructive mt-2">Attention: Le mode maintenance rendra l'application inaccessible aux clients.</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button className="gradient-bg" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder les paramètres
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SuperAdminSettingsView;
