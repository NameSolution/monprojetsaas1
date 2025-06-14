import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Download, ExternalLink, Copy, Save } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { Skeleton } from '@/components/ui/skeleton';

const QRCodeView = () => {
    const { profile, loading, updateSlug } = useClientData();
    const [currentSlug, setCurrentSlug] = useState('');
    const [chatbotUrl, setChatbotUrl] = useState('');

    useEffect(() => {
        if (!loading && profile.slug) {
            setCurrentSlug(profile.slug);
            setChatbotUrl(`${window.location.origin}/bot/${profile.slug}`);
        }
    }, [profile.slug, loading]);
    
    const handleSaveSlug = async () => {
        if (currentSlug.trim() === profile.slug) {
            toast({ title: "Aucun changement", description: "Le slug est déjà à jour."});
            return;
        }
        await updateSlug(currentSlug);
        // chatbotUrl will update via useEffect
    };
    
    const handleDownloadQR = () => {
        const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(chatbotUrl)}`;
        const link = document.createElement('a');
        link.href = qrAPI;
        link.download = `${currentSlug}-qrcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Téléchargement du QR Code...", description: "Le QR code est en cours de téléchargement." });
    };

     if (loading) {
        return (
             <>
                <DashboardHeader 
                    title="QR Code & Lien Public"
                    subtitle="Chargement..."
                />
                <main className="p-6">
                    <Skeleton className="dashboard-card rounded-xl p-6 h-[300px]" />
                </main>
            </>
        );
    }

    return (
        <>
            <DashboardHeader 
                title="QR Code & Lien Public"
                subtitle="Partagez facilement l'accès à votre assistant virtuel"
            />
            <main className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-card rounded-xl p-6"
                >
                    <h3 className="text-lg font-semibold text-foreground mb-6 components-client-QRCodeView__text-foreground">Votre QR Code et Lien</h3>
                    
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div>
                        <Label className="text-foreground components-client-QRCodeView__text-foreground">Lien public de votre chatbot</Label>
                        <div className="flex items-center space-x-2 mt-2">
                            <Input
                            value={chatbotUrl}
                            readOnly
                            className="bg-secondary border-border text-foreground components-client-QRCodeView__bg-secondary components-client-QRCodeView__border-border components-client-QRCodeView__text-foreground"
                            />
                            <Button 
                            variant="outline"
                            onClick={() => {
                                navigator.clipboard.writeText(chatbotUrl);
                                toast({ title: "Copié", description: "Le lien a été copié dans le presse-papiers !" });
                            }}
                            >
                            <Copy className="w-4 h-4 mr-2" />
                            Copier
                            </Button>
                        </div>
                        </div>

                        <div>
                        <Label htmlFor="slug-input" className="text-foreground components-client-QRCodeView__text-foreground">Slug personnalisé</Label>
                        <div className="flex items-center space-x-2 mt-2">
                            <Input
                                id="slug-input"
                                value={currentSlug}
                                onChange={(e) => setCurrentSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                className="bg-secondary border-border text-foreground components-client-QRCodeView__bg-secondary components-client-QRCodeView__border-border components-client-QRCodeView__text-foreground"
                                placeholder="mon-hotel-slug"
                            />
                            <Button onClick={handleSaveSlug} disabled={loading || currentSlug.trim() === profile.slug}>
                                <Save className="w-4 h-4 mr-2" />
                                Sauvegarder
                            </Button>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1 components-client-QRCodeView__text-muted-foreground">
                            Personnalisez l'URL de votre chatbot (lettres, chiffres et tirets uniquement)
                        </p>
                        </div>

                        <div className="flex space-x-4">
                        <Button 
                            className="gradient-bg"
                            onClick={handleDownloadQR}
                            disabled={!chatbotUrl}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger QR Code
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => window.open(chatbotUrl, '_blank')}
                            disabled={!chatbotUrl}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ouvrir le Chatbot
                        </Button>
                        </div>
                    </div>

                    <div className="text-center">
                        <h4 className="text-foreground font-medium mb-4 components-client-QRCodeView__text-foreground">QR Code</h4>
                        <div className="qr-code-container inline-block p-2 bg-white rounded-md">
                        {chatbotUrl ? 
                            <img-replace alt="QR Code pour accéder au chatbot de l'hôtel" className="w-48 h-48" src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(chatbotUrl)}`} />
                            : <Skeleton className="w-48 h-48" />
                        }
                        </div>
                        <p className="text-muted-foreground text-sm mt-4 components-client-QRCodeView__text-muted-foreground">
                        Scannez ce QR code pour accéder directement au chatbot
                        </p>
                    </div>
                    </div>
                </motion.div>
            </main>
        </>
    );
};

export default QRCodeView;
