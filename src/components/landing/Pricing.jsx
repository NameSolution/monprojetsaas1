
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';

const Pricing = ({ data }) => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            <span className="gradient-text">Tarifs</span> Simples et Transparents
          </h2>
          <p className="text-xl text-muted-foreground">
            Choisissez le plan qui correspond à vos besoins, sans frais cachés.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {data.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`pricing-card flex flex-col rounded-2xl p-8 relative ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-blue-500 text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Recommandé
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8 flex-grow">
                <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'gradient-bg hover:opacity-90'
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  }`}
                  onClick={() => toast({
                    title: 'Contact',
                    description: '🚧 Cette fonctionnalité est en cours de développement !',
                  })}
                >
                  {plan.name === 'Sur Mesure' ? 'Nous Contacter' : 'Choisir ce plan'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-8 text-sm">Pas de période d'essai gratuite pour le moment.</p>
      </div>
    </section>
  );
};

export default Pricing;
