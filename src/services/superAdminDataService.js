
import { toast } from '@/components/ui/use-toast';
import { 
    fetchSuperAdminAnalyticsData as fetchAnalytics,
    fetchSuperAdminBillingData as fetchBilling
} from './modules/superAdminAnalyticsService';
import { 
    fetchSuperAdminHotels as fetchHotelsInternal,
    addSuperAdminHotel as addHotelInternal,
    updateSuperAdminHotel as updateHotelInternal,
    deleteSuperAdminHotel as deleteHotelInternal
} from './modules/superAdminHotelService';
import { 
    fetchPlans as fetchHotelPlansInternal
} from './modules/superAdminPlanService';
import {
    fetchSuperAdminUsers as fetchUsersInternal,
    addSuperAdminUser as addUserInternal,
    updateSuperAdminUserProfile as updateUserProfileInternal,
    deleteSuperAdminUser as deleteUserInternal
} from './modules/superAdminUserService';

// Re-declaring MOCK_DBs here or ensuring they are accessible if they were in a shared mock-data file
const MOCK_HOTELS_DB = [
    { id: 'hotel1-uuid', name: 'Hôtel Fantasia (Simulé)', plan_id: 'plan1-uuid', status: 'active', users: 2, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), slug: 'hotel-fantasia-simule' },
    { id: 'hotel2-uuid', name: 'Le Fjord Bleu (Simulé)', plan_id: 'plan2-uuid', status: 'active', users: 1, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), slug: 'le-fjord-bleu-simule' },
];
const MOCK_USERS_DB = [
    { id: 'superadmin-uuid', name: 'Super Admin', email: 'superadmin@example.com', hotel_id: null, role: 'superadmin', lastLogin: new Date().toISOString() },
    { id: 'clientadmin-uuid', name: 'Client Admin Fantasia', email: 'clientadmin@example.com', hotel_id: 'hotel1-uuid', role: 'admin', lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'clientmanager-uuid', name: 'Client Manager Fjord', email: 'clientmanager@example.com', hotel_id: 'hotel2-uuid', role: 'manager', lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];
const MOCK_INTERACTIONS = Array.from({length: 100}, (_, i) => ({
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));
const MOCK_PLANS_DB = [
    { id: 'plan1-uuid', name: 'Essentiel (Simulé)', price_monthly: 49.99 },
    { id: 'plan2-uuid', name: 'Premium (Simulé)', price_monthly: 99.99 },
    { id: 'plan3-uuid', name: 'Entreprise (Simulé)', price_monthly: 199.99 },
];

let MOCK_SUPPORT_TICKETS_DB = [
    { id: 'ticket1', subject: 'Problème de connexion (Simulé)', submitter_name: 'Jean Dupont', submitter_email: 'jean@example.com', hotel_id: 'hotel1-uuid', status: 'Nouveau', priority: 'Haute', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), message: "Je n'arrive pas à me connecter.", internal_notes: "" },
    { id: 'ticket2', subject: 'Facturation incorrecte (Simulé)', submitter_name: 'Marie Curie', submitter_email: 'marie@example.com', hotel_id: 'hotel2-uuid', status: 'En cours', priority: 'Moyenne', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), message: "Ma dernière facture semble erronée.", internal_notes: "Vérifier contrat." },
];

let MOCK_SYSTEM_SETTINGS_DB = {
    llmConfig: { model: 'gpt-sim', temperature: 0.7, systemPrompt: 'Vous êtes un assistant IA pour hôtels (simulé).' },
    monitoring: { cpu: 25, ram: 40, gpu: 10 },
    platformSettings: {
        stripePublicKey: 'pk_test_simulated_stripe_key',
        smtpSettings: { host: 'smtp.example.sim', port: '587', user: 'simuser', pass: 'simpass' },
        maintenanceMode: false
    }
};


export const fetchSuperAdminDashboardData = async (initialRevenueData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const totalHotels = MOCK_HOTELS_DB.length;
            const activeUsers = MOCK_USERS_DB.length;
            const totalConversations = MOCK_INTERACTIONS.length; 
            const monthlyRevenue = MOCK_HOTELS_DB.reduce((acc, h) => {
                const plan = MOCK_PLANS_DB.find(p => p.id === h.plan_id);
                return acc + (parseFloat(plan?.price_monthly || 0)); 
            }, 0);
            
            const revenueDataPoints = initialRevenueData.map(item => ({
                ...item,
                revenue: Math.floor(Math.random() * monthlyRevenue * 0.5 + monthlyRevenue * 0.2) 
            }));

            resolve({
                stats: { totalHotels, activeUsers, totalConversations, monthlyRevenue },
                revenueData: revenueDataPoints,
                recentHotels: MOCK_HOTELS_DB.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,4).map(h => {
                    const plan = MOCK_PLANS_DB.find(p => p.id === h.plan_id);
                    return {
                        id: h.id,
                        name: h.name, 
                        status: h.status || 'active', 
                        users: h.users || 0, 
                        conversations: Math.floor(Math.random() * 50),
                        plan: plan?.name || 'N/A'
                    };
                }),
                systemAlerts: [ 
                    { type: 'warning', message: 'Utilisation CPU IA modèle (Simulé) : 75%', time: 'Maintenant' },
                    { type: 'info', message: 'Nouvel hôtel "Le Fjord Bleu (Simulé)" créé.', time: '15 min' }
                ]
            });
        }, 1000);
    });
};

export const fetchSuperAdminHotels = async () => {
    const plans = await fetchHotelPlansInternal();
    return fetchHotelsInternal(plans);
};
export const addSuperAdminHotel = async (hotelData, authContextSignUp) => {
    const plans = await fetchHotelPlansInternal();
    return addHotelInternal(hotelData, plans, authContextSignUp);
};
export const updateSuperAdminHotel = async (hotelId, hotelData) => {
    const plans = await fetchHotelPlansInternal();
    return updateHotelInternal(hotelId, hotelData, plans);
};
export const deleteSuperAdminHotel = deleteHotelInternal;

export const fetchSuperAdminUsers = async () => {
    const hotels = await fetchHotelsInternal(await fetchHotelPlansInternal());
    return fetchUsersInternal(hotels);
};
export const addSuperAdminUser = async (userData, authContextSignUp) => {
    const hotels = await fetchHotelsInternal(await fetchHotelPlansInternal());
    return addUserInternal(userData, hotels, authContextSignUp);
};
export const updateSuperAdminUserProfile = async (userId, userData) => {
    const hotels = await fetchHotelsInternal(await fetchHotelPlansInternal());
    return updateUserProfileInternal(userId, userData, hotels);
};
export const deleteSuperAdminUser = deleteUserInternal;

export const fetchSuperAdminAnalyticsData = fetchAnalytics;
export const fetchSuperAdminBillingData = fetchBilling;

export const fetchPlans = fetchHotelPlansInternal;


export const fetchSystemSettings = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(MOCK_SYSTEM_SETTINGS_DB)));
        }, 400);
    });
};

export const updateSystemSettings = async (settings) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (settings.llmConfig) MOCK_SYSTEM_SETTINGS_DB.llmConfig = { ...MOCK_SYSTEM_SETTINGS_DB.llmConfig, ...settings.llmConfig };
            if (settings.platformSettings) MOCK_SYSTEM_SETTINGS_DB.platformSettings = { ...MOCK_SYSTEM_SETTINGS_DB.platformSettings, ...settings.platformSettings };
            toast({ title: "Paramètres Système Mis à Jour (Simulé)" });
            resolve(true);
        }, 600);
    });
};

export const fetchSupportTickets = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const ticketsWithHotelNames = MOCK_SUPPORT_TICKETS_DB.map(t => {
                const hotel = MOCK_HOTELS_DB.find(h => h.id === t.hotel_id);
                return { ...t, hotels: hotel ? { name: hotel.name } : null };
            });
            resolve(ticketsWithHotelNames);
        }, 500);
    });
};

export const updateSupportTicket = async (ticketId, updates) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const ticketIndex = MOCK_SUPPORT_TICKETS_DB.findIndex(t => t.id === ticketId);
            if (ticketIndex === -1) {
                toast({ variant: "destructive", title: "Erreur Mise à Jour Ticket (Simulé)", description: "Ticket non trouvé." });
                resolve(null);
                return;
            }
            MOCK_SUPPORT_TICKETS_DB[ticketIndex] = { ...MOCK_SUPPORT_TICKETS_DB[ticketIndex], ...updates, updated_at: new Date().toISOString() };
            
            const hotel = MOCK_HOTELS_DB.find(h => h.id === MOCK_SUPPORT_TICKETS_DB[ticketIndex].hotel_id);
            toast({ title: "Ticket Mis à Jour (Simulé)" });
            resolve({ ...MOCK_SUPPORT_TICKETS_DB[ticketIndex], hotels: hotel ? { name: hotel.name } : null });
        }, 400);
    });
};

export const deleteSupportTicket = async (ticketId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const initialLength = MOCK_SUPPORT_TICKETS_DB.length;
            MOCK_SUPPORT_TICKETS_DB = MOCK_SUPPORT_TICKETS_DB.filter(t => t.id !== ticketId);
            if (MOCK_SUPPORT_TICKETS_DB.length < initialLength) {
                toast({ title: "Ticket Supprimé (Simulé)" });
                resolve(true);
            } else {
                toast({ variant: "destructive", title: "Erreur Suppression Ticket (Simulé)", description: "Ticket non trouvé." });
                resolve(false);
            }
        }, 300);
    });
};
