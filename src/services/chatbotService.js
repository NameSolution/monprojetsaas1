
import { toast } from '@/components/ui/use-toast';

const MOCK_CHATBOT_HOTEL_CONFIGS = {
    'hotel-fantasia-simule': {
        id: 'hotel1-uuid',
        name: 'Hôtel Fantasia (Simulé)',
        themeColor: '#DE3163',
        welcomeMessage: {
            fr: "Bienvenue à l'Hôtel Fantasia (Simulé) ! Comment puis-je vous aider ?",
            en: "Welcome to Hotel Fantasia (Simulated)! How can I help you?",
            es: "¡Bienvenido al Hotel Fantasia (Simulado)! ¿Cómo puedo ayudarte?"
        },
        logoUrl: 'https://via.placeholder.com/100/DE3163/FFFFFF?Text=Fantasia',
        defaultLanguage: 'fr',
        knowledge: {
            "horaires piscine": "La piscine est ouverte de 9h à 18h.",
            "petit déjeuner": "Le petit déjeuner est servi de 7h à 10h dans notre salle de restaurant.",
            "wifi": "Le WiFi est gratuit. Connectez-vous au réseau 'FantasiaGuest' avec le mot de passe 'fantasia2025'."
        }
    },
    'le-fjord-bleu-simule': {
        id: 'hotel2-uuid',
        name: 'Le Fjord Bleu (Simulé)',
        themeColor: '#3B82F6',
        welcomeMessage: {
            fr: "Salutations du Fjord Bleu (Simulé) ! Que puis-je pour vous ?",
            en: "Greetings from Le Fjord Bleu (Simulated)! What can I do for you?",
        },
        logoUrl: 'https://via.placeholder.com/100/3B82F6/FFFFFF?Text=FjordBleu',
        defaultLanguage: 'en',
        knowledge: {
            "parking": "Nous disposons d'un parking gratuit pour nos clients.",
            "animaux": "Les animaux de compagnie sont acceptés avec un supplément de 15€ par nuit.",
            "check-out": "L'heure de départ est fixée à 11h00."
        }
    }
};

export const fetchHotelConfigBySlug = async (slug) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const config = MOCK_CHATBOT_HOTEL_CONFIGS[slug];
            if (config) {
                resolve(config);
            } else {
                resolve(null); 
            }
        }, 500);
    });
};

export const getLLMResponse = async (hotelId, sessionId, lang, prompt) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const hotelConfig = Object.values(MOCK_CHATBOT_HOTEL_CONFIGS).find(h => h.id === hotelId);
            let response = "Désolé, je n'ai pas compris votre demande (réponse simulée).";

            if (hotelConfig && hotelConfig.knowledge) {
                const lowerPrompt = prompt.toLowerCase();
                for (const keyword in hotelConfig.knowledge) {
                    if (lowerPrompt.includes(keyword)) {
                        response = hotelConfig.knowledge[keyword] + " (Réponse simulée)";
                        break;
                    }
                }
            }
            
            if (prompt.toLowerCase().includes("bonjour") || prompt.toLowerCase().includes("hello")) {
                response = hotelConfig?.welcomeMessage?.[lang] || hotelConfig?.welcomeMessage?.['fr'] || "Bonjour ! (Simulé)";
            } else if (prompt.toLowerCase().includes("merci") || prompt.toLowerCase().includes("thanks")) {
                response = lang === 'fr' ? "De rien ! (Simulé)" : "You're welcome! (Simulated)";
            }

            resolve(response);
        }, 700 + Math.random() * 500); 
    });
};

export const logInteraction = async (hotelId, sessionId, lang, input, output) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Interaction Logged (Simulated):", { hotelId, sessionId, lang, input, output });
            const interactionId = `interaction-${Date.now()}`;
            resolve(interactionId);
        }, 100);
    });
};

export const submitInteractionRating = async (interactionId, ratingValue) => {
     return new Promise(resolve => {
        setTimeout(() => {
            console.log("Rating Submitted (Simulated):", { interactionId, ratingValue });
            resolve(true);
        }, 100);
    });
};
