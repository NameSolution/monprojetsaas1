
import React from 'react';
import { motion } from 'framer-motion';

const Features = ({ data }) => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            <span className="gradient-text">Fonctionnalités</span> Révolutionnaires
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une plateforme complète conçue pour transformer l'expérience client
            de votre hôtel avec la puissance de l'IA locale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feature-card rounded-2xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-blue-500 rounded-full mb-6">
                {React.cloneElement(feature.icon, { className: "w-8 h-8 text-primary-foreground" })}
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
