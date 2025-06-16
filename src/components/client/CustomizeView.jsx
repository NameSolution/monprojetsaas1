
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Bot, Upload, Save, MessageSquare } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { Skeleton } from '@/components/ui/skeleton';

const CustomizeView = () => {
    const { customization: initialCustomization, loading, updateCustomization } = useClientData();
    
    const [chatbotConfig, setChatbotConfig] = useState({
        name: '',
        welcomeMessage: '',
        primaryColor: '#2563EB',
        logoUrl: null,
        logoFile: null 
    });
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if (!loading && initialCustomization) {
            setChatbotConfig(prev => ({
                ...prev,
                name: initialCustomization.name || 'Assistant Virtuel',
                welcomeMessage: initialCustomization.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?',
                primaryColor: initialCustomization.primaryColor || '#2563EB',
                logoUrl: initialCustomization.logoUrl || null
            }));
            if (initialCustomization.logoUrl) {
                setLogoPreview(initialCustomization.logoUrl);
            }
        }
    }, [initialCustomization, loading]);

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({ variant: "destructive", title: "Fichier trop volumineux", description: "La taille du logo ne doit pas dépasser 2Mo." });
                return;
            }
            if (!['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'].includes(file.type)) {
                toast({ variant: "destructive", title: "Format invalide", description: "Veuillez choisir un fichier PNG, JPG, GIF ou SVG." });
                return;
            }
            setChatbotConfig({...chatbotConfig, logoFile: file});
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            toast({ title: "Logo sélectionné", description: file.name });
        }
    };
    
    const handleSaveChanges = async () => {
        await updateCustomization(chatbotConfig);
        setChatbotConfig(prev => ({...prev, logoFile: null})); 
    };

    if (loading) {
        return (
             <>
                <DashboardHeader 
                    title="Personnalisation"
                    subtitle="Chargement de la configuration..."
                />
                <main className="p-6">
                    <Skeleton className="dashboard-card rounded-xl p-6 h-[500px]" />
                </main>
            </>
        );
    }

    return (
        <>
            <DashboardHeader 
                title="Personnalisation"
                subtitle="Adaptez l'apparence de votre chatbot à votre image de marque"
            />
            <main className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-card rounded-xl p-6"
                >
                    <h3 className="text-lg font-semibold text-foreground mb-6">Apparence du Chatbot</h3>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="chatbot-name" className="text-foreground">Nom de l'assistant</Label>
                                <Input
                                    id="chatbot-name"
                                    value={chatbotConfig.name}
                                    onChange={(e) => setChatbotConfig({...chatbotConfig, name: e.target.value})}
                                    className="mt-1 bg-secondary border-border text-foreground"
                                />
                            </div>

                            <div>
                                <Label htmlFor="welcome-message" className="text-foreground">Message d'accueil</Label>
                                <textarea
                                    id="welcome-message"
                                    value={chatbotConfig.welcomeMessage}
                                    onChange={(e) => setChatbotConfig({...chatbotConfig, welcomeMessage: e.target.value})}
                                    className="mt-1 w-full h-24 px-3 py-2 bg-secondary border border-border rounded-md text-foreground resize-none"
                                    placeholder="Message d'accueil personnalisé..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="primary-color" className="text-foreground">Couleur principale</Label>
                                <div className="flex items-center space-x-2 mt-1">
                                <input
                                    id="primary-color"
                                    type="color"
                                    value={chatbotConfig.primaryColor}
                                    onChange={(e) => setChatbotConfig({...chatbotConfig, primaryColor: e.target.value})}
                                    className="w-12 h-10 rounded border-border"
                                />
                                <Input
                                    value={chatbotConfig.primaryColor}
                                    onChange={(e) => setChatbotConfig({...chatbotConfig, primaryColor: e.target.value})}
                                    className="bg-secondary border-border text-foreground"
                                />
                                </div>
                            </div>
                           
                            <div>
                                <Label className="text-foreground">Logo de l'hôtel</Label>
                                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm mb-2">Glissez votre logo ici ou cliquez pour sélectionner</p>
                                    <Input 
                                        id="logo-upload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/gif, image/svg+xml"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => document.getElementById('logo-upload').click()}
                                    >
                                        Choisir un fichier
                                    </Button>
                                    {logoPreview && <img src={logoPreview} alt="Aperçu du logo" className="mt-4 max-h-20 mx-auto object-contain" />}
                                </div>
                            </div>

                            <Button 
                                className="gradient-bg w-full"
                                onClick={handleSaveChanges}
                                disabled={loading}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-foreground font-medium">Aperçu en temps réel</h4>
                            <div className="glass-effect rounded-2xl p-4 max-w-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold"
                                    style={{ backgroundColor: chatbotConfig.primaryColor }}
                                >
                                    {logoPreview ? <img src={logoPreview} alt="Logo" className="w-6 h-6 rounded-full object-cover" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <span className="font-semibold text-foreground text-sm">{chatbotConfig.name}</span>
                                </div>
                                <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4 h-32 overflow-y-auto">
                                <div className="bg-secondary p-3 rounded-lg text-sm text-foreground">
                                {chatbotConfig.welcomeMessage}
                                </div>
                                <div 
                                className="ml-8 p-3 rounded-lg text-sm text-primary-foreground"
                                style={{ backgroundColor: chatbotConfig.primaryColor }}
                                >
                                Bonjour ! Quels sont vos horaires ?
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                type="text"
                                placeholder="Tapez votre message..."
                                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm"
                                />
                                <button 
                                className="p-2 rounded-lg text-primary-foreground"
                                style={{ backgroundColor: chatbotConfig.primaryColor }}
                                >
                                <MessageSquare className="w-4 h-4" />
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </>
    );
};

export default CustomizeView;
