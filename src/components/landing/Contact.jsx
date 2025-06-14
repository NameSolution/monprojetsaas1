
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Send } from 'lucide-react';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Message envoyé !",
            description: "Merci, nous vous recontacterons très bientôt.",
        });
        e.target.reset();
    };

    return (
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
                        Contactez-<span className="gradient-text">nous</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Une question, une demande de démo ? N'hésitez pas.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-effect rounded-2xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="name" className="text-foreground">Votre nom</Label>
                                <Input id="name" type="text" required className="mt-2 bg-secondary border-border text-foreground" />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-foreground">Votre email</Label>
                                <Input id="email" type="email" required className="mt-2 bg-secondary border-border text-foreground" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="subject" className="text-foreground">Sujet</Label>
                            <Input id="subject" type="text" required className="mt-2 bg-secondary border-border text-foreground" />
                        </div>
                        <div>
                            <Label htmlFor="message" className="text-foreground">Votre message</Label>
                            <textarea
                                id="message"
                                required
                                className="mt-2 w-full h-32 px-3 py-2 bg-secondary border border-border rounded-md text-foreground resize-none"
                            />
                        </div>
                        <div className="text-right">
                            <Button type="submit" className="gradient-bg">
                                <Send className="w-4 h-4 mr-2" />
                                Envoyer le message
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
