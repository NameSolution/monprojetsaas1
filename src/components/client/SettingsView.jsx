
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Save, Bell, User, CreditCard } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsView = () => {
    const { profile: initialProfile, subscription: initialSubscription, loading, updateProfile } = useClientData();
    
    const [profile, setProfile] = useState({ hotelName: '', contactEmail: '', contactName: '', notificationEmail: '' });
    const [subscription, setSubscription] = useState({ plan: '', nextInvoice: '' });

    useEffect(() => {
        if (!loading && initialProfile && initialSubscription) {
            setProfile({
                hotelName: initialProfile.hotelName || '',
                contactEmail: initialProfile.contactEmail || '',
                contactName: initialProfile.contactName || '',
                notificationEmail: initialProfile.notificationEmail || ''
            });
            setSubscription({
                plan: initialSubscription.plan || '',
                nextInvoice: initialSubscription.nextInvoice || ''
            });
        }
    }, [initialProfile, initialSubscription, loading]);
    
    const handleProfileChange = (e) => {
        setProfile({...profile, [e.target.id]: e.target.value });
    };

    const handleSaveProfile = async () => {
        await updateProfile(profile);
    };
    
    const handleManageSubscription = () => {
        toast({ 
            title: "Gestion de l'abonnement", 
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀"
        });
    };

    if (loading) {
        return (
            <>
                <DashboardHeader 
                    title="Paramètres"
                    subtitle="Chargement de vos informations..."
                />
                <main className="p-6">
                    <div className="dashboard-card rounded-xl p-6 max-w-4xl mx-auto space-y-8">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <DashboardHeader 
                title="Paramètres"
                subtitle="Gérez les informations de votre compte et votre abonnement"
            />
            <main className="p-6">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-card rounded-xl p-6 max-w-4xl mx-auto"
                >
                    <div className="space-y-12">
                        <div>
                             <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-primary" />
                                Informations du Compte
                            </h3>
                            <div className="p-6 bg-secondary rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="hotelName" className="text-foreground">Nom de l'hôtel</Label>
                                    <Input id="hotelName" value={profile.hotelName} onChange={handleProfileChange} className="mt-2 bg-background border-border text-foreground" />
                                </div>
                                <div>
                                    <Label htmlFor="contactEmail" className="text-foreground">Email de contact principal</Label>
                                    <Input id="contactEmail" type="email" value={profile.contactEmail} onChange={handleProfileChange} className="mt-2 bg-background border-border text-foreground" />
                                </div>
                                <div>
                                    <Label htmlFor="contactName" className="text-foreground">Nom du contact principal</Label>
                                    <Input id="contactName" value={profile.contactName} onChange={handleProfileChange} className="mt-2 bg-background border-border text-foreground" />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button onClick={handleSaveProfile} disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? "Sauvegarde..." : "Sauvegarder"}</Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                                Abonnement
                            </h3>
                            <div className="p-6 bg-secondary rounded-lg">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-muted-foreground">Plan actuel</p>
                                        <p className="text-2xl font-bold text-foreground flex items-center">{subscription.plan || 'N/A'} <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-600">Actif</span></p>
                                    </div>
                                    <div>
                                         <p className="text-muted-foreground">Prochaine facture</p>
                                        <p className="font-semibold text-foreground">{subscription.nextInvoice || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Button variant="outline" onClick={handleManageSubscription}>Gérer l'abonnement</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div>
                             <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <Bell className="w-5 h-5 mr-2 text-yellow-500" />
                                Notifications
                            </h3>
                            <div className="p-6 bg-secondary rounded-lg space-y-4">
                                <Label htmlFor="notificationEmail" className="text-foreground">Email pour les rapports et alertes</Label>
                                <Input
                                    id="notificationEmail"
                                    type="email"
                                    value={profile.notificationEmail}
                                    onChange={handleProfileChange}
                                    className="bg-background border-border text-foreground"
                                />
                                <p className="text-xs text-muted-foreground">Vous recevrez des rapports d'utilisation et des alertes importantes à cette adresse.</p>
                                <div className="flex justify-end">
                                    <Button onClick={handleSaveProfile} disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? "Sauvegarde..." : "Sauvegarder"}</Button>
                                </div>
                            </div>
                        </div>

                    </div>
                 </motion.div>
            </main>
        </>
    );
};

export default SettingsView;
