
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight, Play, Bot } from 'lucide-react';

const DemoChat = () => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    const demoQuestions = [
        'Quels sont vos horaires ?',
        'Avez-vous une piscine ?',
    ];

    const demoAnswers = {
        'Quels sont vos horaires ?': 'Notre réception est ouverte 24h/24 et 7j/7. Le petit-déjeuner est servi de 7h à 10h30.',
        'Avez-vous une piscine ?': 'Oui ! Nous avons une magnifique piscine extérieure chauffée, ouverte de 6h à 22h.',
    };

    useEffect(() => {
        setMessages([{ type: 'bot', text: 'Bonjour ! Posez-moi une question de démo.' }]);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);


    const handleDemoMessage = (question) => {
        if (isTyping) return;

        setMessages(prev => [...prev, { type: 'user', text: question }]);
        setIsTyping(true);
        
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: demoAnswers[question] }]);
        }, 1500);
    };

    return (
        <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto animate-float">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Bot className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-foreground">Assistant Hôtel</span>
                </div>
                <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
            </div>

            <div ref={chatContainerRef} className="h-48 overflow-y-auto scrollbar-hide space-y-3 mb-4 pr-2">
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-2.5 ${message.type === 'user' ? 'justify-end' : ''}`}
                    >
                        <div
                            className={`p-3 rounded-lg text-sm max-w-[80%] ${
                                message.type === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-secondary text-secondary-foreground rounded-bl-none'
                            }`}
                        >
                            {message.text}
                        </div>
                    </motion.div>
                ))}
                 {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-2.5"
                    >
                        <div className="p-3 rounded-lg bg-secondary text-secondary-foreground rounded-bl-none">
                            <div className="loading-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="space-y-2">
                {demoQuestions.map(q => (
                     <button
                        key={q}
                        onClick={() => handleDemoMessage(q)}
                        disabled={isTyping}
                        className="w-full text-left p-2 text-sm bg-secondary/50 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                    >
                       💬 {q}
                    </button>
                ))}
            </div>
        </div>
    );
};


const Hero = () => {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 hero-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Assistant Virtuel</span>
              <br />
              <span className="text-foreground">100% Local pour Hôtels</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Révolutionnez l'expérience client avec un assistant IA multilingue,
              totalement personnalisable et fonctionnant exclusivement sur vos
              propres serveurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gradient-bg hover:opacity-90 transition-opacity"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Commencer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => toast({ title: "Démo", description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀" })}
              >
                <Play className="w-5 h-5 mr-2" />
                Voir la Démo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <DemoChat />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
