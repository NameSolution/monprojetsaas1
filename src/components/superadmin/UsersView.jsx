
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, KeyRound, Search, Filter, Save } from 'lucide-react';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/authContext';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UsersView = () => {
    const { data: initialUsers, loading, addUser, updateUser, deleteUser, allData } = useSuperAdminData('users');
    const { resetPassword } = useAuth();
    const [users, setUsers] = useState([]);
    const [hotelsList, setHotelsList] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [currentUserData, setCurrentUserData] = useState({ name: '', email: '', hotel_id: '', role: 'manager', password: '' });
    const [userToDelete, setUserToDelete] = useState(null);


    useEffect(() => {
        if (!loading && initialUsers) {
            setUsers(initialUsers);
        }
        if (allData && allData.hotels) {
            setHotelsList(allData.hotels.map(h => ({id: h.id, name: h.name})));
        }

    }, [initialUsers, loading, allData]);

    const filteredUsers = users?.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.hotel && user.hotel.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    const handleAddUser = () => {
        setEditingUser(null);
        setCurrentUserData({ name: '', email: '', hotel_id: hotelsList[0]?.id || '', role: 'manager', password: '' });
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        const targetHotel = hotelsList.find(h => h.name === user.hotel || h.id === user.hotel_id);
        setCurrentUserData({ name: user.name, email: user.email, hotel_id: targetHotel?.id || '', role: user.role, password: '' });
        setIsModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        if(!userToDelete) return;
        await deleteUser(userToDelete.id);
        setUserToDelete(null);
    };
    
    const handleResetPasswordRequest = async (email) => {
        if(!email) {
            toast({ variant: "destructive", title: "Email manquant", description: "Impossible de réinitialiser le mot de passe sans email."});
            return;
        }
        try {
            await resetPassword(email);
        } catch (error) {
            // Error toast handled by resetPassword in authContext
        }
    };

    const handleSaveUser = async () => {
        if (!currentUserData.email.trim() || (!editingUser && !currentUserData.password.trim()) || !currentUserData.hotel_id ) {
            toast({ variant: "destructive", title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires (email, mot de passe pour nouveau, hôtel)." });
            return;
        }
        if (editingUser) {
            await updateUser(editingUser.id, { role: currentUserData.role, hotel_id: currentUserData.hotel_id, name: currentUserData.name });
        } else {
            await addUser(currentUserData);
        }
        setIsModalOpen(false);
    };

    const handleFilter = () => {
        toast({
            title: "Filtrage des Utilisateurs",
            description: "Cette fonctionnalité sera bientôt disponible.",
        });
    };
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dashboard-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Gestion des Utilisateurs</h2>
                        <p className="text-muted-foreground">Créez des utilisateurs ou réinitialisez des mots de passe.</p>
                    </div>
                    <Button className="gradient-bg" onClick={handleAddUser} disabled={loading || hotelsList.length === 0}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un Utilisateur
                    </Button>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-grow">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Rechercher par nom, email ou hôtel..." 
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
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Nom</th>
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Email</th>
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Hôtel</th>
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Rôle</th>
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Dernière Connexion</th>
                            <th className="text-left text-muted-foreground font-medium py-3 px-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading && filteredUsers.length === 0 ? (
                             Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="border-b border-border/50">
                                    <td className="py-4 px-2" colSpan={6}><Skeleton className="h-6 w-full" /></td>
                                </tr>
                            ))
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/50">
                                    <td className="py-4 px-2 text-foreground">{user.name || 'N/A'}</td>
                                    <td className="py-4 px-2 text-muted-foreground">{user.email}</td>
                                    <td className="py-4 px-2 text-muted-foreground">{user.hotel}</td>
                                    <td className="py-4 px-2 text-muted-foreground">{user.role}</td>
                                    <td className="py-4 px-2 text-muted-foreground">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}</td>
                                    <td className="py-4 px-2">
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => handleResetPasswordRequest(user.email)} title="Réinitialiser mot de passe"><KeyRound className="w-4 h-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={() => handleEditUser(user)} title="Modifier"><Edit className="w-4 h-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="icon" onClick={() => setUserToDelete(user)} title="Supprimer"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-card border-border">
                                                <AlertDialogHeader>
                                                <AlertDialogTitle className="text-foreground">Êtes-vous sûr ?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-muted-foreground">
                                                    Cette action est irréversible et supprimera définitivement l'utilisateur.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel className="text-foreground border-border hover:bg-secondary">Annuler</AlertDialogCancel>
                                                <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {filteredUsers.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-muted-foreground">Aucun utilisateur trouvé.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border">
                    <DialogHeader>
                    <DialogTitle className="text-foreground">{editingUser ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {editingUser ? "Modifiez les informations de l'utilisateur." : "Entrez les informations du nouvel utilisateur."}
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user-name" className="text-right text-foreground">Nom</Label>
                            <Input id="user-name" value={currentUserData.name} onChange={(e) => setCurrentUserData({...currentUserData, name: e.target.value})} className="col-span-3 bg-secondary border-border text-foreground" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user-email" className="text-right text-foreground">Email</Label>
                            <Input id="user-email" type="email" value={currentUserData.email} onChange={(e) => setCurrentUserData({...currentUserData, email: e.target.value})} className="col-span-3 bg-secondary border-border text-foreground" disabled={!!editingUser} />
                        </div>
                        {!editingUser && (
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="user-password" className="text-right text-foreground">Mot de passe</Label>
                                <Input id="user-password" type="password" value={currentUserData.password} onChange={(e) => setCurrentUserData({...currentUserData, password: e.target.value})} className="col-span-3 bg-secondary border-border text-foreground" />
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user-hotel" className="text-right text-foreground">Hôtel</Label>
                             <Select value={currentUserData.hotel_id} onValueChange={(value) => setCurrentUserData({...currentUserData, hotel_id: value})}>
                                <SelectTrigger className="col-span-3 bg-secondary border-border text-foreground">
                                    <SelectValue placeholder="Choisir un hôtel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hotelsList.map(hotel => (
                                        <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
                                    ))}
                                     {hotelsList.length === 0 && <SelectItem value="" disabled>Aucun hôtel disponible</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user-role" className="text-right text-foreground">Rôle</Label>
                            <Select value={currentUserData.role} onValueChange={(value) => setCurrentUserData({...currentUserData, role: value})}>
                                <SelectTrigger className="col-span-3 bg-secondary border-border text-foreground">
                                    <SelectValue placeholder="Choisir un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin Hôtel</SelectItem>
                                    <SelectItem value="manager">Client Hôtel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button onClick={handleSaveUser} className="gradient-bg" disabled={loading}><Save className="w-4 h-4 mr-2" />Sauvegarder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default UsersView;
