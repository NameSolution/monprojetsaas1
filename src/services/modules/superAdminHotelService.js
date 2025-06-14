
import { toast } from '@/components/ui/use-toast';

let MOCK_HOTELS_DB = [
    { id: 'hotel1-uuid', name: 'Hôtel Fantasia (Simulé)', plan_id: 'plan1-uuid', status: 'active', users: 2, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), slug: 'hotel-fantasia-simule' },
    { id: 'hotel2-uuid', name: 'Le Fjord Bleu (Simulé)', plan_id: 'plan2-uuid', status: 'active', users: 1, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), slug: 'le-fjord-bleu-simule' },
];

const DEFAULT_HOTEL_WELCOME_MESSAGE = (hotelName) => JSON.stringify({
    "fr": `Bienvenue à ${hotelName} ! Comment puis-je vous aider ?`,
    "en": `Welcome to ${hotelName}! How can I help you?`,
    "es": `¡Bienvenido a ${hotelName}! ¿Cómo puedo ayudarte?`
});

export const fetchSuperAdminHotels = async (plans) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const hotelsWithPlanNames = MOCK_HOTELS_DB.map(h => {
                const plan = plans.find(p => p.id === h.plan_id);
                return {
                    ...h,
                    plan: plan?.name || 'N/A',
                    created: h.created_at
                };
            });
            resolve(hotelsWithPlanNames);
        }, 500);
    });
};

export const addSuperAdminHotel = async (hotelData, plans, signUpMock) => {
    return new Promise(async (resolve) => {
        setTimeout(async () => {
            try {
                const { name, plan_id, status } = hotelData;
                const tempEmail = `client-${name.toLowerCase().replace(/\s+/g, '').substring(0,10)}${Math.floor(Math.random()*1000)}@hotelbot.example.com`;
                
                const mockUser = await signUpMock(tempEmail, `Pwd${Math.random().toString(36).slice(-8)}!`, `Client ${name}`, 'manager', null);

                const newHotel = { 
                    id: `hotel-${Date.now()}`,
                    name, 
                    slug: name.toLowerCase().replace(/\s+/g, '-').substring(0,20) + `-${Math.random().toString(36).slice(-4)}`, 
                    plan_id, 
                    status, 
                    user_id: mockUser.id, 
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    theme_color: '#2563EB',
                    welcome_message: DEFAULT_HOTEL_WELCOME_MESSAGE(name),
                    contact_email: tempEmail,
                    contact_name: `Client ${name}`,
                    default_lang_code: 'fr',
                    users: 1 
                };
                MOCK_HOTELS_DB.push(newHotel);
                
                const plan = plans.find(p => p.id === newHotel.plan_id);
                toast({ title: "Hôtel Ajouté (Simulé)", description: `${newHotel.name} a été créé. Email client: ${tempEmail}` });
                resolve({ ...newHotel, plan: plan?.name || 'N/A', created: newHotel.created_at });
            } catch (error) {
                console.error("Error adding hotel (simulated):", error);
                toast({ variant: "destructive", title: "Erreur Ajout Hôtel (Simulé)", description: error.message });
                resolve(null);
            }
        }, 800);
    });
};

export const updateSuperAdminHotel = async (hotelId, hotelData, plans) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const hotelIndex = MOCK_HOTELS_DB.findIndex(h => h.id === hotelId);
            if (hotelIndex === -1) {
                toast({ variant: "destructive", title: "Erreur Modification Hôtel (Simulé)", description: "Hôtel non trouvé." });
                resolve(null);
                return;
            }
            MOCK_HOTELS_DB[hotelIndex] = { ...MOCK_HOTELS_DB[hotelIndex], ...hotelData, updated_at: new Date().toISOString() };
            const plan = plans.find(p => p.id === MOCK_HOTELS_DB[hotelIndex].plan_id);
            toast({ title: "Hôtel Modifié (Simulé)" });
            resolve({ ...MOCK_HOTELS_DB[hotelIndex], plan: plan?.name || 'N/A', created: MOCK_HOTELS_DB[hotelIndex].created_at });
        }, 600);
    });
};

export const deleteSuperAdminHotel = async (hotelId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const initialLength = MOCK_HOTELS_DB.length;
            MOCK_HOTELS_DB = MOCK_HOTELS_DB.filter(h => h.id !== hotelId);
            if (MOCK_HOTELS_DB.length < initialLength) {
                toast({ title: "Hôtel Supprimé (Simulé)", description: "L'hôtel et les utilisateurs associés (simulés) ont été supprimés." });
                resolve(true);
            } else {
                toast({ variant: "destructive", title: "Erreur Suppression Hôtel (Simulé)", description: "Hôtel non trouvé." });
                resolve(false);
            }
        }, 400);
    });
};
