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
  const { createSupportTicket } = useClientData();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium'
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
      setForm({ title: '', description: '', priority: 'medium' });
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
            <div>
              <Label htmlFor="priority" className="text-foreground">Priorité</Label>
              <Select value={form.priority} onValueChange={(value) => setForm(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger id="priority" className="mt-2 bg-background border-border text-foreground">
                  <SelectValue placeholder="Choisir une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={submitting}>
                <Save className="w-4 h-4 mr-2" />{submitting ? 'Envoi...' : 'Envoyer'}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default SupportView;
