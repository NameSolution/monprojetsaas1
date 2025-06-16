
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, MessageSquare, Edit, Trash2, ExternalLink, Filter, Save } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import apiService from '@/services/api';


const TicketStatusBadge = ({ status }) => {
  let variant;
  switch (status?.toLowerCase()) {
    case 'nouveau': variant = 'destructive'; break;
    case 'en cours': variant = 'secondary'; break;
    case 'résolu': variant = 'default'; break;
    case 'fermé': variant = 'outline'; break;
    default: variant = 'outline';
  }
  return <Badge variant={variant} className="capitalize">{status || 'Indéfini'}</Badge>;
};

const SupportTicketsView = () => {
  const { data: tickets, loading, updateTicket, setData: setGlobalTickets } = useSuperAdminData('supportTickets');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTicketData, setCurrentTicketData] = useState({ status: '', internal_notes: '' });
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentTicketData({ status: ticket.status, internal_notes: ticket.internal_notes || '' });
    setIsModalOpen(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    setIsUpdating(true);
    try {
      await updateTicket(selectedTicket.id, { status: currentTicketData.status, internal_notes: currentTicketData.internal_notes });
      setIsModalOpen(false);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur mise à jour', description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;
    setIsDeleting(true);

    try {
      await apiService.deleteSupportTicket(ticketToDelete.id);
      setGlobalTickets(prev => prev.filter(t => t.id !== ticketToDelete.id));
      toast({ title: 'Ticket supprimé' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur de suppression', description: err.message });
    } finally {
      setTicketToDelete(null);
      setIsDeleting(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Tickets de Support</h2>
            <p className="text-muted-foreground">Gérez les demandes d'assistance des utilisateurs.</p>
          </div>
          <Button variant="outline" onClick={() => toast({title: "Filtres", description: "Cette fonctionnalité sera bientôt disponible."})}><Filter className="w-4 h-4 mr-2" />Filtrer</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Sujet</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Demandeur</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Email</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Hôtel</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Statut</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Créé le</th>
                <th className="text-left text-muted-foreground font-medium py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (!tickets || tickets.length === 0) ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-2" colSpan={7}><Skeleton className="h-6 w-full" /></td>
                  </tr>
                ))
              ) : tickets && tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="py-4 px-2 text-foreground font-medium">{ticket.title}</td>
                    <td className="py-4 px-2 text-muted-foreground">{ticket.submitter_name || 'N/A'}</td>
                    <td className="py-4 px-2 text-muted-foreground">{ticket.submitter_email}</td>
                    <td className="py-4 px-2 text-muted-foreground">{ticket.hotels?.name || 'N/A'}</td>
                    <td className="py-4 px-2"><TicketStatusBadge status={ticket.status} /></td>
                    <td className="py-4 px-2 text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleViewTicket(ticket)}><MessageSquare className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setTicketToDelete(ticket)} disabled={isDeleting}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Cette action est irréversible et supprimera définitivement le ticket de support.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-foreground border-border hover:bg-secondary">Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDeleteTicket} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isDeleting}>
                                {isDeleting ? "Suppression..." : "Supprimer"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">Aucun ticket de support pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-lg bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Détails du Ticket: {selectedTicket.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Demandé par {selectedTicket.submitter_name} ({selectedTicket.submitter_email})
                        {selectedTicket.submitter_phone && ` - Tel: ${selectedTicket.submitter_phone}`}
                        {selectedTicket.hotels?.name && ` - Hôtel: ${selectedTicket.hotels.name}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label className="text-foreground">Message du client:</Label>
                        <p className="p-3 bg-secondary rounded-md text-sm text-foreground whitespace-pre-wrap">{selectedTicket.description}</p>
                    </div>
                     <div>
                        <Label htmlFor="ticket-status" className="text-foreground">Statut du ticket:</Label>
                        <Select 
                            value={currentTicketData.status} 
                            onValueChange={(value) => setCurrentTicketData(prev => ({...prev, status: value}))}
                        >
                            <SelectTrigger id="ticket-status" className="bg-secondary border-border text-foreground">
                                <SelectValue placeholder="Choisir un statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Nouveau">Nouveau</SelectItem>
                                <SelectItem value="En cours">En cours</SelectItem>
                                <SelectItem value="Résolu">Résolu</SelectItem>
                                <SelectItem value="Fermé">Fermé</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="internal-notes" className="text-foreground">Notes internes (optionnel):</Label>
                        <Textarea 
                            id="internal-notes" 
                            value={currentTicketData.internal_notes || ''}
                            onChange={(e) => setCurrentTicketData(prev => ({...prev, internal_notes: e.target.value}))}
                            className="bg-secondary border-border text-foreground"
                            placeholder="Ajoutez des notes ici..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleUpdateTicket} className="gradient-bg" disabled={isUpdating}>
                        <Save className="w-4 h-4 mr-2" />
                        {isUpdating ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default SupportTicketsView;
