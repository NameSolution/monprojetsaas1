import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/client/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, LifeBuoy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useClientData } from '@/hooks/useClientData';

const SupportView = () => {
  const { createSupportTicket, supportTickets } = useClientData();
  const [form, setForm] = useState({
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast({ variant: 'destructive', title: 'Champs requis', description: 'Veuillez remplir le sujet et la description.' });
      return;
    }
    setSubmitting(true);
    try {
      await createSupportTicket(form);
      toast({ title: 'Ticket envoyé', description: "Nous reviendrons vers vous bientôt." });
      setForm({ title: '', description: '' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DashboardHeader title="Support" subtitle="Envoyez une demande d'assistance" />
      <main className="p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card rounded-xl p-6 max-w-3xl mx-auto">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-foreground">Sujet</Label>
              <Input id="title" className="mt-2 bg-background border-border text-foreground" value={form.title} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea id="description" rows={4} className="mt-2 bg-background border-border text-foreground" value={form.description} onChange={handleChange} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={submitting}>
                <Save className="w-4 h-4 mr-2" />{submitting ? 'Envoi...' : 'Envoyer'}
              </Button>
            </div>
          </div>
        </motion.div>

        {supportTickets && supportTickets.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card rounded-xl p-6 max-w-3xl mx-auto mt-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center"><LifeBuoy className="w-5 h-5 mr-2" />Vos Tickets</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 px-2 text-left text-muted-foreground">Sujet</th>
                    <th className="py-2 px-2 text-left text-muted-foreground">Statut</th>
                    <th className="py-2 px-2 text-left text-muted-foreground">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map(t => (
                    <tr key={t.id} className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground">{t.title}</td>
                      <td className="py-2 px-2 text-muted-foreground capitalize">{t.status}</td>
                      <td className="py-2 px-2 text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
};

export default SupportView;
