
import { toast } from '@/components/ui/use-toast';

const MOCK_HOTEL_DATA = {
    'hotel1-uuid': {
        id: 'hotel1-uuid',
        name: 'Hôtel Fantasia (Simulé)',
        slug: 'hotel-fantasia-simule',
        contactEmail: 'contact@fantasia.sim',
        contactName: 'Alice Wonderland',
        notificationEmail: 'notifications@fantasia.sim',
        plan: 'Premium (Simulé)',
        nextInvoiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        themeColor: '#DE3163',
        logoUrl: 'https://via.placeholder.com/100/DE3163/FFFFFF?Text=Fantasia',
        welcomeMessage: {
            fr: "Bienvenue à l'Hôtel Fantasia (Simulé) ! Comment puis-je vous aider ?",
            en: "Welcome to Hotel Fantasia (Simulated)! How can I help you?",
            es: "¡Bienvenido al Hotel Fantasia (Simulado)! ¿Cómo puedo ayudarte?"
        },
        defaultLanguage: 'fr',
        knowledgeBase: [
            { id: 'kb1', theme: 'Horaires Piscine (Simulé)', info: 'La piscine est ouverte de 9h à 18h.', created_at: new Date().toISOString() },
            { id: 'kb2', theme: 'Petit déjeuner (Simulé)', info: 'Le petit déjeuner est servi de 7h à 10h.', created_at: new Date().toISOString() },
        ],
        interactions: [
            { id: 'int1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), input: 'Piscine ?', lang: 'fr', rating: 1 },
            { id: 'int2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), input: 'Breakfast time?', lang: 'en', rating: null },
        ],
        availableLanguages: [
            { code: 'fr', name: 'Français', active: true },
            { code: 'en', name: 'English', active: true },
            { code: 'es', name: 'Español', active: false },
        ]
    }
};

export const fetchInitialHotelProfile = async (userId, hotelId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hotelInfo = MOCK_HOTEL_DATA[hotelId];
      if (!hotelInfo) {
        resolve(null);
        return;
      }
      resolve({
        hotelId: hotelId,
        profile: {
            hotelName: hotelInfo.name,
            contactEmail: hotelInfo.contactEmail,
            contactName: hotelInfo.contactName,
            notificationEmail: hotelInfo.notificationEmail,
            slug: hotelInfo.slug
        },
        subscription: {
            plan: hotelInfo.plan,
            nextInvoice: hotelInfo.nextInvoiceDate
        },
        customization: {
            name: hotelInfo.name,
            welcomeMessage: hotelInfo.welcomeMessage,
            primaryColor: hotelInfo.themeColor,
            logoUrl: hotelInfo.logoUrl,
            defaultLanguage: hotelInfo.defaultLanguage,
        }
      });
    }, 500);
  });
};

export const fetchClientDependentData = async (hotelId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const hotelData = MOCK_HOTEL_DATA[hotelId];
            if (!hotelData) {
                resolve(null);
                return;
            }

            const knowledgeBaseData = hotelData.knowledgeBase.map(item => ({
              id: item.id,
              theme: item.theme,
              info: item.info,
              created_at: item.created_at,
            }));

            const totalConversations = hotelData.interactions.length;
            
            const recentConversationsData = hotelData.interactions.slice(0, 4).map(conv => ({
              id: conv.id,
              language: conv.lang || 'fr',
              time: new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
              theme: conv.input.substring(0, 30) + '...'
            }));
            
            const now = new Date();
            const conversationChartData = Array(7).fill(null).map((_, i) => {
                const day = new Date(now);
                day.setDate(now.getDate() - (6-i));
                const dayString = day.toLocaleDateString('fr-FR', { weekday: 'short' });
                const count = hotelData.interactions.filter(int => new Date(int.timestamp).toDateString() === day.toDateString()).length;
                return { name: dayString.charAt(0).toUpperCase() + dayString.slice(1, 3), conversations: count };
            });

            const themeCounts = hotelData.interactions.reduce((acc, curr) => {
                const theme = curr.input.substring(0, 20); 
                acc[theme] = (acc[theme] || 0) + 1;
                return acc;
            }, {});
            const topThemesData = Object.entries(themeCounts)
                .sort(([,a],[,b]) => b-a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            const analyticsData = { conversationData: conversationChartData, topThemes: topThemesData.length > 0 ? topThemesData : [{name: "Aucune donnée", count:0}] };
            
            resolve({
              stats: { totalConversations },
              recentConversations: recentConversationsData,
              knowledgeBase: knowledgeBaseData,
              analytics: analyticsData,
              availableLanguages: hotelData.availableLanguages,
            });
        }, 700);
    });
};

export const updateClientKnowledgeBaseItem = async (hotelId, newItem, currentKnowledgeBase) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const hotelData = MOCK_HOTEL_DATA[hotelId];
            if (!hotelData) {
                toast({ variant: "destructive", title: "Erreur (Simulée)", description: "Hôtel non trouvé." });
                resolve(null);
                return;
            }
            if (newItem.id) { 
                const index = hotelData.knowledgeBase.findIndex(item => item.id === newItem.id);
                if (index !== -1) {
                    hotelData.knowledgeBase[index] = { ...hotelData.knowledgeBase[index], info: newItem.info, theme: newItem.info.substring(0,50) + "..." };
                    toast({ title: "Information modifiée (Simulée)" });
                    resolve({ knowledgeBase: hotelData.knowledgeBase.map(kb => ({...kb})) });
                } else {
                    resolve(null);
                }
            } else { 
                const createdItem = { id: `kb${Date.now()}`, theme: newItem.info.substring(0,50) + "...", info: newItem.info, created_at: new Date().toISOString() };
                hotelData.knowledgeBase.push(createdItem);
                toast({ title: "Information ajoutée (Simulée)" });
                resolve({ knowledgeBase: hotelData.knowledgeBase.map(kb => ({...kb})) });
            }
        }, 500);
    });
};

export const deleteClientKnowledgeBaseItem = async (hotelId, itemId) => {
     return new Promise((resolve) => {
        setTimeout(() => {
            const hotelData = MOCK_HOTEL_DATA[hotelId];
            if (!hotelData) {
                toast({ variant: "destructive", title: "Erreur (Simulée)", description: "Hôtel non trouvé." });
                resolve(false);
                return;
            }
            const initialLength = hotelData.knowledgeBase.length;
            hotelData.knowledgeBase = hotelData.knowledgeBase.filter(item => item.id !== itemId);
            if (hotelData.knowledgeBase.length < initialLength) {
                toast({ title: "Information supprimée (Simulée)" });
                resolve(true);
            } else {
                resolve(false);
            }
        }, 300);
    });
};

export const updateClientHotelCustomization = async (hotelId, config) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const hotelData = MOCK_HOTEL_DATA[hotelId];
            if (!hotelData) {
                toast({ variant: "destructive", title: "Erreur (Simulée)", description: "Hôtel non trouvé." });
                resolve(null);
                return;
            }

            hotelData.name = config.name;
            hotelData.welcomeMessage = config.welcomeMessage;
            hotelData.themeColor = config.primaryColor;
            
            if (config.logoFile) {
                hotelData.logoUrl = URL.createObjectURL(config.logoFile); 
                toast({ title: "Logo mis à jour (Prévisualisation locale)" });
            }

            toast({ title: "Personnalisation sauvegardée (Simulée)"});
            resolve({ 
                customization: {
                    name: hotelData.name,
                    welcomeMessage: hotelData.welcomeMessage,
                    primaryColor: hotelData.themeColor,
                    logoUrl: hotelData.logoUrl,
                    defaultLanguage: hotelData.defaultLanguage
                }
            });
        }, 800);
    });
};

export const updateClientHotelProfile = async (hotelId, profileUpdates) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const hotelData = MOCK_HOTEL_DATA[hotelId];
            if (!hotelData) {
                toast({ variant: "destructive", title: "Erreur (Simulée)", description: "Hôtel non trouvé." });
                resolve(null);
                return;
            }
            hotelData.name = profileUpdates.hotelName;
            hotelData.contactEmail = profileUpdates.contactEmail;
            hotelData.contactName = profileUpdates.contactName;
            hotelData.notificationEmail = profileUpdates.notificationEmail;
            
            toast({title: "Profil mis à jour (Simulé)"});
            resolve({
                 profile: {
                    hotelName: hotelData.name,
                    contactEmail: hotelData.contactEmail,
                    contactName: hotelData.contactName,
                    notificationEmail: hotelData.notificationEmail,
                    slug: hotelData.slug, 
                }
            });
        }, 500);
    });
};

export const updateClientHotelSlug = async (hotelId, newSlug, currentSlug) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const hotelData = MOCK_HOTEL_DATA[hotelId];
            if (!hotelData) {
                toast({ variant: "destructive", title: "Erreur (Simulée)", description: "Hôtel non trouvé." });
                resolve(null);
                return;
            }
            if (currentSlug === newSlug) {
                toast({ title: "Aucun changement", description: "Le slug est déjà à jour."});
                resolve({ slug: currentSlug });
                return;
            }
            const isSlugTaken = Object.values(MOCK_HOTEL_DATA).some(h => h.id !== hotelId && h.slug === newSlug);
            if (isSlugTaken) {
                toast({variant: "destructive", title: "Slug Indisponible (Simulé)", description: "Ce slug est déjà utilisé."});
                resolve(null);
                return;
            }
            hotelData.slug = newSlug;
            toast({title: "Slug mis à jour (Simulé)", description: `Nouveau lien: /bot/${newSlug}`});
            resolve({ slug: newSlug });
        }, 600);
    });
};

export const updateClientHotelLanguagesList = async (hotelId, updatedLanguages, newDefaultLanguage) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const hotelData = MOCK_HOTEL_DATA[hotelId];
            if (!hotelData) {
                toast({ variant: "destructive", title: "Erreur (Simulée)", description: "Hôtel non trouvé." });
                resolve(null);
                return;
            }
            hotelData.availableLanguages = updatedLanguages.map(lang => ({...lang}));
            hotelData.defaultLanguage = newDefaultLanguage;
            
            toast({ title: "Langues sauvegardées (Simulée)" });
            resolve({ availableLanguages: hotelData.availableLanguages, defaultLanguage: hotelData.defaultLanguage });
        }, 500);
    });
};
