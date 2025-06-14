
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Plus, Edit, Trash2, BrainCircuit, Save } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
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

const KnowledgeView = () => {
    const { knowledgeBase: initialKnowledgeBase, loading, updateKnowledgeBase, deleteKnowledgeItem } = useClientData();
    const [knowledgeBase, setKnowledgeBase] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [currentItemData, setCurrentItemData] = useState({ theme: '', info: '' });
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        if (!loading && initialKnowledgeBase) {
            setKnowledgeBase(initialKnowledgeBase);
        }
    }, [initialKnowledgeBase, loading]);

    const handleAddItem = () => {
        setEditingItem(null);
        setCurrentItemData({ theme: '', info: '' });
        setIsModalOpen(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setCurrentItemData({ theme: item.theme, info: item.info });
        setIsModalOpen(true);
    };

    const confirmDeleteItem = async () => {
        if(!itemToDelete) return;
        await deleteKnowledgeItem(itemToDelete.id);
        setItemToDelete(null);
    };

    const handleSaveItem = async () => {
        if (!currentItemData.info.trim()) { 
            toast({ variant: "destructive", title: "Information requise", description: "Veuillez remplir le champ information." });
            return;
        }

        const itemToSave = {
            id: editingItem ? editingItem.id : null,
            info: currentItemData.info 
        };
        
        await updateKnowledgeBase(itemToSave);
        setIsModalOpen(false);
        setCurrentItemData({ theme: '', info: '' });
        setEditingItem(null);
    };


    return (
        <>
            <DashboardHeader 
                title="Base de Connaissances"
                subtitle="Alimentez la mémoire de votre assistant avec les informations de votre hôtel."
            />
            <main className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-card rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-foreground flex items-center">
                            <BrainCircuit className="w-5 h-5 mr-2 text-purple-500" />
                            Mémoire de l'assistant
                        </h3>
                        <Button 
                            className="gradient-bg"
                            onClick={handleAddItem}
                            disabled={loading}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une information
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-secondary rounded-lg p-4 border border-border flex items-center space-x-4">
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                     <Skeleton className="h-8 w-8 rounded-md" />
                                     <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            ))
                        ) : (
                            knowledgeBase.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-secondary rounded-lg p-4 border border-border"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-4">
                                            <h4 className="text-foreground font-medium mb-1">{item.theme || `Info ID: ${item.id}`}</h4>
                                            <p className="text-muted-foreground text-sm truncate hover:whitespace-normal">{item.info}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => handleEditItem(item)}><Edit className="w-4 h-4" /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => setItemToDelete(item)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-card border-border">
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-foreground">Êtes-vous sûr ?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-muted-foreground">
                                                        Cette action est irréversible et supprimera définitivement cette information.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel className="text-foreground border-border hover:bg-secondary">Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                         {knowledgeBase.length === 0 && !loading && (
                            <p className="text-center text-muted-foreground py-4">Aucune information dans la base de connaissances. Commencez par en ajouter une !</p>
                        )}
                    </div>
                </motion.div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-card border-border">
                        <DialogHeader>
                        <DialogTitle className="text-foreground">{editingItem ? "Modifier l'information" : "Ajouter une information"}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {editingItem ? "Modifiez les détails ci-dessous." : "Remplissez les détails de la nouvelle information."}
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="info" className="text-right text-foreground pt-2">
                                Information
                                </Label>
                                <textarea id="info" value={currentItemData.info} onChange={(e) => setCurrentItemData({...currentItemData, info: e.target.value})} className="col-span-3 h-32 p-2 bg-secondary border border-border rounded-md text-foreground resize-none" placeholder="Ex: Le petit-déjeuner est servi de 7h à 10h."/>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleSaveItem} className="gradient-bg"><Save className="w-4 h-4 mr-2" />Sauvegarder</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </>
    );
};

export default KnowledgeView;
