
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Bot, Send, Languages, X, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchHotelConfigBySlug, getLLMResponse, logInteraction, submitInteractionRating } from '@/services/chatbotService';

const ChatbotInterface = () => {
  const { slug } = useParams();
  const messagesEndRef = useRef(null);
  
  const [hotelConfig, setHotelConfig] = useState({
      name: 'Assistant Hôtelier',
      primaryColor: 'hsl(var(--primary))', 
      welcomeMessage: 'Bonjour ! Comment puis-je vous assister ?',
      logoUrl: null,
      id: null, 
      defaultLanguage: 'fr',
  });
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLanguageSelectorOpen, setLanguageSelectorOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ code: 'fr', name: 'Français', flag: 'flag-fr' });
  const [sessionId, setSessionId] = useState(null);
  const [interactionToRate, setInteractionToRate] = useState(null);

  const availableLanguages = [
    { code: 'fr', name: 'Français', flag: 'flag-fr' },
    { code: 'en', name: 'English', flag: 'flag-en' },
    { code: 'es', name: 'Español', flag: 'flag-es' },
    { code: 'de', name: 'Deutsch', flag: 'flag-de' },
  ];

  useEffect(() => {
    setSessionId(crypto.randomUUID()); 
    
    const loadHotelConfig = async () => {
        if(!slug) {
          toast({variant: "destructive", title: "Erreur", description: "Slug de l'hôtel manquant."});
          setLoadingConfig(false);
          return;
        }
        setLoadingConfig(true);
        const config = await fetchHotelConfigBySlug(slug);
        
        if (!config || !config.id) {
            console.error("Error fetching hotel config or hotel not found (simulated)");
            toast({variant: "destructive", title: "Erreur", description: "Configuration du chatbot introuvable (simulé)."});
            setHotelConfig(prev => ({...prev, id: null, name: "Chatbot Indisponible", welcomeMessage: "Ce chatbot n'est pas configuré."}));
        } else {
            const defaultLang = availableLanguages.find(l => l.code === config.defaultLanguage) || availableLanguages[0];
            setHotelConfig({
                id: config.id,
                name: config.name || 'Assistant Hôtelier',
                primaryColor: config.themeColor || 'hsl(var(--primary))',
                welcomeMessage: config.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?',
                logoUrl: config.logoUrl,
                defaultLanguage: defaultLang.code,
            });
            setCurrentLanguage(defaultLang);
        }
        setLoadingConfig(false);
    };
    loadHotelConfig();
  }, [slug]);

  useEffect(() => {
    if (!loadingConfig && hotelConfig.welcomeMessage && hotelConfig.id) {
      setMessages([]); 
      setIsTyping(true);
      setTimeout(() => {
        const welcomeText = typeof hotelConfig.welcomeMessage === 'string' ? hotelConfig.welcomeMessage : (hotelConfig.welcomeMessage[currentLanguage.code] || hotelConfig.welcomeMessage['fr'] || "Bienvenue !");
        setMessages([{ type: 'bot', text: welcomeText, id: `bot-welcome-${Date.now()}` }]);
        setIsTyping(false);
      }, 500);
    } else if (!loadingConfig && !hotelConfig.id) {
        setMessages([{ type: 'bot', text: "Ce chatbot n'est pas configuré. Veuillez contacter l'administrateur.", id: `bot-error-${Date.now()}` }]);
    }
  }, [loadingConfig, hotelConfig.welcomeMessage, currentLanguage.code, hotelConfig.id]); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !hotelConfig.id || !sessionId) return;

    const userMessage = { type: 'user', text: input, id: `user-${Date.now()}` };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    setInteractionToRate(null);

    try {
      const botResponseText = await getLLMResponse(hotelConfig.id, sessionId, currentLanguage.code, currentInput);
      
      const botMessageId = `bot-${Date.now()}`;
      const botResponse = { type: 'bot', text: botResponseText, id: botMessageId };
      setMessages(prev => [...prev, botResponse]);

      const interactionId = await logInteraction(hotelConfig.id, sessionId, currentLanguage.code, currentInput, botResponseText);

      if (interactionId) {
          setInteractionToRate(interactionId);
      }

    } catch (error) {
        console.error("Error sending message or getting LLM response (simulated):", error);
        toast({ variant: "destructive", title: "Erreur de communication (Simulée)", description: error.message });
        const botErrorResponse = { type: 'bot', text: "Oups, une erreur est survenue. Veuillez réessayer.", id: `bot-error-${Date.now()}` };
        setMessages(prev => [...prev, botErrorResponse]);
    } finally {
        setIsTyping(false);
    }
  };
  
  const handleRating = async (interactionId, ratingValue) => {
      if (!interactionId) return;
      try {
          await submitInteractionRating(interactionId, ratingValue);
          toast({ title: "Merci !", description: "Votre avis a été enregistré (simulé)."});
          setInteractionToRate(null); 
      } catch (error) {
          console.error("Error submitting rating (simulated):", error);
          toast({variant: "destructive", title: "Erreur", description: "Impossible d'enregistrer votre avis (simulé)."});
      }
  };

  const selectLanguage = (lang) => {
    setCurrentLanguage(lang);
    setLanguageSelectorOpen(false);
  }

  if (loadingConfig) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 chat-container">
             <motion.div 
                className="w-full max-w-lg h-[90vh] flex flex-col bg-card rounded-2xl shadow-2xl border border-border"
            >
                <Skeleton className="h-20 w-full rounded-t-2xl rounded-b-none" />
                <div className="flex-1 p-6 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-10 w-1/2 ml-auto" />
                    <Skeleton className="h-10 w-3/4" />
                </div>
                <Skeleton className="h-24 w-full rounded-b-2xl rounded-t-none" />
            </motion.div>
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 chat-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg h-[90vh] flex flex-col bg-card rounded-2xl shadow-2xl border border-border"
      >
        <div 
            className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border pages-ChatbotInterface__primaryColor" 
            style={{ backgroundColor: hotelConfig.primaryColor, borderTopLeftRadius: 'calc(var(--radius) - 1px)', borderTopRightRadius: 'calc(var(--radius) - 1px)' }}
        >
          <div className="flex items-center space-x-3">
            {hotelConfig.logoUrl ? 
                <img-replace src={hotelConfig.logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover border-2 border-white/50" />
                : <Bot className="w-8 h-8 text-primary-foreground" />
            }
            <div>
              <p className="font-bold text-primary-foreground">{hotelConfig.name}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <p className="text-xs text-primary-foreground/80">En ligne</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20" onClick={() => setLanguageSelectorOpen(prev => !prev)}>
              <Languages className="w-5 h-5" />
            </Button>
            <AnimatePresence>
                {isLanguageSelectorOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 w-48 bg-card/90 backdrop-blur-md rounded-lg p-2 z-10 border border-border shadow-lg"
                    >
                        {availableLanguages.map(lang => (
                            <button key={lang.code} onClick={() => selectLanguage(lang)} className={`w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md text-sm ${currentLanguage.code === lang.code ? 'bg-accent font-semibold' : ''}`}>
                                <span className={`language-flag ${lang.flag}`}></span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: message.type === 'user' ? 10 : -10, x: message.type === 'user' ? 10 : -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                     hotelConfig.logoUrl ? 
                     <img-replace src={hotelConfig.logoUrl} alt="Bot" className="w-8 h-8 rounded-full object-cover flex-shrink-0" /> 
                     : <Bot className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                )}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'message-user rounded-br-none'
                      : 'message-bot rounded-bl-none'
                  }`}
                   style={message.type === 'user' ? { backgroundColor: hotelConfig.primaryColor, color: 'hsl(var(--primary-foreground))' } : {}}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.type === 'user' && <User className="w-8 h-8 text-muted-foreground flex-shrink-0" />}
              </motion.div>
            ))}
             {interactionToRate && (
                 <motion.div
                    initial={{ opacity: 0, y: 10}}
                    animate={{ opacity: 1, y: 0}}
                    className="flex justify-center items-center space-x-2 pt-2"
                 >
                    <p className="text-xs text-muted-foreground">Cette réponse était-elle utile ?</p>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleRating(interactionToRate, 1)}>
                        <ThumbsUp className="h-4 w-4 text-green-500"/>
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleRating(interactionToRate, -1)}>
                        <ThumbsDown className="h-4 w-4 text-red-500"/>
                    </Button>
                 </motion.div>
             )}
          </AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2 justify-start"
            >
               {hotelConfig.logoUrl ? 
                <img-replace src={hotelConfig.logoUrl} alt="Bot Typing" className="w-8 h-8 rounded-full object-cover flex-shrink-0" /> 
                : <Bot className="w-8 h-8 text-muted-foreground flex-shrink-0" />}
              <div className="message-bot rounded-bl-none p-3">
                <div className="loading-dots text-muted-foreground">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 p-4 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question ici..."
              className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              autoComplete="off"
              disabled={isTyping || !hotelConfig.id}
            />
            <Button type="submit" size="icon" style={{ backgroundColor: hotelConfig.primaryColor }} className="text-primary-foreground" disabled={isTyping || !input.trim() || !hotelConfig.id}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Powered by <Link to="/" className="font-bold gradient-text">HotelBot AI</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotInterface;
