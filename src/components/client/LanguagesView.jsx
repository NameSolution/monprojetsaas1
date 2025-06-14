
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Save, Languages as LanguagesIcon } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const fetchAllSystemLangs = async () => [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Espagnol' },
];

const LanguagesView = () => {
    const { availableLanguages: initialLanguages, loading: clientDataLoading, updateHotelLanguages, hotelId, customization } = useClientData();
    const [managedLanguages, setManagedLanguages] = useState([]);
    const [defaultLanguage, setDefaultLanguage] = useState('');
    const [loading, setLoading] = useState(false);
    const [systemLanguages, setSystemLanguages] = useState([]);

    useEffect(() => {
        const loadSystemLangs = async () => {
            const langs = await fetchAllSystemLangs(); // This should be a mock function now
            setSystemLanguages(langs);
        };
        loadSystemLangs();
    }, []);

    useEffect(() => {
        if (!clientDataLoading && initialLanguages && initialLanguages.length > 0 && systemLanguages.length > 0) {
            const hotelLangsWithNames = initialLanguages.map(hl => {
                const sysLang = systemLanguages.find(sl => sl.code === hl.code);
                return { ...hl, name: sysLang?.name || hl.code };
            });
            setManagedLanguages(hotelLangsWithNames);

            if (customization && customization.defaultLanguage) {
                setDefaultLanguage(customization.defaultLanguage);
            } else if (hotelLangsWithNames.find(l => l.active)) {
                 setDefaultLanguage(hotelLangsWithNames.find(l => l.active).code);
            } else if (hotelLangsWithNames.length > 0) {
                setDefaultLanguage(hotelLangsWithNames[0].code); // Fallback if no active but some configured
            }

        } else if (!clientDataLoading && initialLanguages && initialLanguages.length === 0 && systemLanguages.length > 0) {
            setManagedLanguages(systemLanguages.map(sl => ({...sl, active: sl.code === 'fr'}))); 
            setDefaultLanguage('fr');
        }
    }, [initialLanguages, clientDataLoading, customization, systemLanguages]);

    const handleToggle = (code) => {
        setManagedLanguages(
            managedLanguages.map(lang => 
                lang.code === code ? { ...lang, active: !lang.active } : lang
            )
        );
    };

    const handleSaveLanguages = async () => {
        setLoading(true);
        const activeLangs = managedLanguages.filter(l => l.active);
        if(activeLangs.length === 0) {
            toast({variant: "destructive", title: "Aucune langue active", description: "Veuillez activer au moins une langue."});
            setLoading(false);
            return;
        }
        
        if(!activeLangs.find(l => l.code === defaultLanguage)) {
            toast({variant: "destructive", title: "Langue par défaut inactive", description: "La langue par défaut doit être active."});
            setLoading(false);
            return;
        }

        await updateHotelLanguages(managedLanguages, defaultLanguage);
        setLoading(false);
    };
    
    if ((clientDataLoading || systemLanguages.length === 0) && managedLanguages.length === 0) {
        return (
             <>
                <DashboardHeader 
                    title="Gestion des Langues"
                    subtitle="Chargement des langues..."
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
                title="Gestion des Langues"
                subtitle="Activez ou désactivez les langues pour votre assistant"
            />
            <main className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-card rounded-xl p-6"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-semibold text-foreground flex items-center">
                           <LanguagesIcon className="w-5 h-5 mr-2 text-primary" /> Langues disponibles
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                               <Label htmlFor="default-language-select" className="text-foreground">Langue par défaut:</Label>
                                <Select value={defaultLanguage} onValueChange={setDefaultLanguage} disabled={loading}>
                                    <SelectTrigger id="default-language-select" className="w-[180px] bg-secondary border-border text-foreground">
                                        <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managedLanguages.filter(l => l.active).map(lang => (
                                            <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                                        ))}
                                        {managedLanguages.filter(l => l.active).length === 0 && defaultLanguage && (
                                            <SelectItem value={defaultLanguage} disabled>{managedLanguages.find(l => l.code === defaultLanguage)?.name || defaultLanguage}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button 
                                className="gradient-bg"
                                onClick={handleSaveLanguages}
                                disabled={loading || clientDataLoading}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? "Sauvegarde..." : "Sauvegarder"}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {managedLanguages.length === 0 && !clientDataLoading ? (
                             <p className="text-center text-muted-foreground py-4">Aucune langue trouvée. Contactez le support.</p>
                        ) : (
                            managedLanguages.map(lang => (
                                <div key={lang.code} className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
                                    <div className="flex items-center space-x-4">
                                        <div className={`language-flag ${lang.flag || `flag-${lang.code}`}`}></div>
                                        <span className="text-foreground font-medium">{lang.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor={`lang-${lang.code}`} className="text-muted-foreground text-sm">
                                            {lang.active ? 'Activé' : 'Désactivé'}
                                        </Label>
                                        <Switch
                                            id={`lang-${lang.code}`}
                                            checked={lang.active}
                                            onCheckedChange={() => handleToggle(lang.code)}
                                            disabled={loading || clientDataLoading}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </main>
        </>
    );
};

export default LanguagesView;
