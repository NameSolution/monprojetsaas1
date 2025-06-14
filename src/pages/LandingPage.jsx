
import React from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Lock,
  Cpu,
  Languages,
  Zap,
  BarChart3
} from 'lucide-react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import Contact from '@/components/landing/Contact';

const LandingPage = () => {
  const featuresData = [
    {
      icon: <Server className="w-8 h-8 text-primary" />,
      title: '100% Local & Privé',
      description:
        "Aucune donnée ne quitte vos serveurs. Une IA locale pour une confidentialité totale.",
    },
    {
      icon: <Languages className="w-8 h-8 text-primary" />,
      title: 'Multilingue Intelligent',
      description:
        'Support natif de plusieurs langues avec détection automatique.',
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: 'Sécurité Maximale',
      description:
        'Chiffrement et audit complet des activités.',
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: 'Personnalisation Totale',
      description:
        "Interface, couleurs, logo, réponses. Adaptez tout à votre marque.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: 'Analytics Avancées',
      description:
        "Statistiques détaillées, rapports d'utilisation et insights.",
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: 'Performance Optimisée',
      description:
        'Monitoring temps réel, optimisation et alertes proactives.',
    },
  ];

  const pricingPlansData = [
    {
      name: 'Essentiel',
      price: '10€',
      period: '/mois',
      description: 'La solution parfaite pour démarrer.',
      features: [
        '1 assistant virtuel',
        'Langues illimitées',
        'Base de connaissances',
        'Personnalisation de l\'apparence',
        'Support par email',
        'Statistiques essentielles',
      ],
      popular: true,
    },
    {
      name: 'Sur Mesure',
      price: 'Contactez-nous',
      period: '',
      description: 'Pour les besoins les plus exigeants.',
      features: [
        'Tout du plan Essentiel',
        'Assistants multiples',
        'Support dédié 24/7',
        'Accompagnement à l\'intégration',
        'Fonctionnalités avancées',
      ],
      popular: false,
    },
  ];

  const faqItemsData = [
    {
      question: 'Comment la technologie garantit-elle la confidentialité ?',
      answer:
        "Notre solution s'installe directement sur vos serveurs. Aucune conversation ou donnée client n'est envoyée à des services cloud externes, garantissant une confidentialité et une sécurité maximales.",
    },
    {
      question: 'Mes données sont-elles vraiment sécurisées ?',
      answer:
        'Absolument. En plus de rester sur vos serveurs, nous utilisons un chiffrement AES-256 pour un accès sécurisé à votre tableau de bord.',
    },
    {
      question: "Comment l'assistant apprend-il les spécificités de mon hôtel ?",
      answer:
        'Grâce à un tableau de bord intuitif via une "Base de Connaissances", vous configurez facilement toutes les informations de votre hôtel : services, horaires, tarifs, etc. L\'IA utilise exclusivement ces données pour répondre.',
    },
    {
      question: "L'installation est-elle complexe ?",
      answer:
        "Non, nous fournissons un script d'installation simple pour Windows. En quelques clics, votre assistant virtuel est prêt à fonctionner. Une documentation complète est également fournie.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Features data={featuresData} />
        <Pricing data={pricingPlansData} />
        <FAQ data={faqItemsData} />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
