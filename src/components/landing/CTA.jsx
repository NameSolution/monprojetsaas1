
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Prêt à <span className="gradient-text">Révolutionner</span>
            <br />
            Votre Service Client ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez les hôtels qui ont déjà transformé leur expérience client
            avec HotelBot AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-bg hover:opacity-90 transition-opacity"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Voir les tarifs
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Demander une démo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
