
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Eye, Edit, Trash2, Search, Filter, Save } from 'lucide-react';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const HotelsView = ({ onClose }) => {
    const { data: initialHotels, loading, addHotel, updateHotel, deleteHotel } = useSuperAdminData('hotels');
    const [hotels, setHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [currentHotelData, setCurrentHotelData] = useState({ name: '', default_lang_code: 'en' });
    const [hotelToDelete, setHotelToDelete] = useState(null);

    useEffect(() => {
        if (!loading && initialHotels) {
            setHotels(initialHotels);
        }
    }, [initialHotels, loading]);

    // No plan management in the simplified schema

    const filteredHotels = hotels?.filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleAddHotel = () => {
        setEditingHotel(null);
        setCurrentHotelData({ name: '', default_lang_code: 'en' });
        setIsModalOpen(true);
    };

    const handleEditHotel = (hotel) => {
        setEditingHotel(hotel);
        setCurrentHotelData({
            name: hotel.name,
            default_lang_code: hotel.default_lang_code || 'en'
        });
        setIsModalOpen(true);
    };

    const confirmDeleteHotel = async () => {
        if(!hotelToDelete) return;
        await deleteHotel(hotelToDelete.id);
        setHotelToDelete(null);
    };

    const handleSaveHotel = async () => {
        if (!currentHotelData.name.trim()) {
            toast({ variant: "destructive", title: "Nom requis", description: "Veuillez entrer un nom pour l'hôtel." });
            return;
        }
        const dataToSave = {
            name: currentHotelData.name,
            default_lang_code: currentHotelData.default_lang_code || 'en'
        };

        try {
            if (editingHotel) {
                await updateHotel(editingHotel.id, dataToSave);
            } else {
                await addHotel(dataToSave);
            }
            setIsModalOpen(false);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erreur', description: err.message });
        }
    };

    const handleViewHotelDetails = (hotel) => {
        toast({
            title: `Détails de l'hôtel: ${hotel.name}`,
            description: `🚧 Fonctionnalité d'affichage complet à venir ! 🚀`,
        });
    };
    
    const handleFilter = () => {
        toast({
            title: "Filtrage des Hôtels",
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀",
        });
    };
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dashboard-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-foreground">Gestion des Hôtels</h2>
                        <p className="text-muted-foreground">Ajoutez, modifiez ou suspendez des comptes hôtels.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {onClose && (
                            <Button size="sm" variant="secondary" onClick={onClose}>Fermer</Button>
                        )}
                        <Button className="gradient-bg" onClick={handleAddHotel} disabled={loading}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un Hôtel
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-grow">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Rechercher par nom..." 
                            className="pl-10 bg-secondary border-border text-foreground" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={handleFilter}><Filter className="w-4 h-4 mr-2" />Filtrer</Button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-border">
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Nom de l'hôtel</th>
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading && filteredHotels.length === 0 ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-border/50">
                                    <td className="py-4 px-2"><Skeleton className="h-6 w-3/4" /></td>
                                    <td className="py-4 px-2"><Skeleton className="h-8 w-24" /></td>
                                </tr>
                            ))
                        ) : (
                            filteredHotels.map((hotel) => (
                                <tr key={hotel.id} className="border-b border-border/50 hover:bg-secondary/50">
                                <td className="py-4 px-2 text-foreground">{hotel.name}</td>
                                <td className="py-4 px-2">
                                    <div className="flex space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => handleViewHotelDetails(hotel)}><Eye className="w-4 h-4" /></Button>
                                    <Button variant="outline" size="icon" onClick={() => handleEditHotel(hotel)}><Edit className="w-4 h-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={() => setHotelToDelete(hotel)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-card border-border">
                                            <AlertDialogHeader>
                                            <AlertDialogTitle className="text-foreground">Êtes-vous sûr ?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-muted-foreground">
                                                Cette action est irréversible et supprimera définitivement l'hôtel et ses utilisateurs associés.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel className="text-foreground border-border hover:bg-secondary">Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={confirmDeleteHotel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    </div>
                                </td>
                                </tr>
                            ))
                        )}
                        {filteredHotels.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-muted-foreground">Aucun hôtel trouvé.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border">
                    <DialogHeader>
                    <DialogTitle className="text-foreground">{editingHotel ? "Modifier l'Hôtel" : "Ajouter un Hôtel"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {editingHotel ? "Modifiez les informations de l'hôtel." : "Entrez les informations du nouvel hôtel."}
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hotel-name" className="text-right text-foreground">Nom</Label>
                            <Input id="hotel-name" value={currentHotelData.name} onChange={(e) => setCurrentHotelData({...currentHotelData, name: e.target.value})} className="col-span-3 bg-secondary border-border text-foreground" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button onClick={handleSaveHotel} className="gradient-bg" disabled={loading}><Save className="w-4 h-4 mr-2" />Sauvegarder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default HotelsView;
