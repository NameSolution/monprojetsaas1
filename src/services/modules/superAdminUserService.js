
import { toast } from '@/components/ui/use-toast';

let MOCK_USERS_DB = [
    { id: 'superadmin-uuid', name: 'Super Admin', email: 'superadmin@example.com', hotel_id: null, role: 'superadmin', lastLogin: new Date().toISOString() },
    { id: 'clientadmin-uuid', name: 'Client Admin Fantasia', email: 'clientadmin@example.com', hotel_id: 'hotel1-uuid', role: 'admin', lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'clientmanager-uuid', name: 'Client Manager Fjord', email: 'clientmanager@example.com', hotel_id: 'hotel2-uuid', role: 'manager', lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

export const fetchSuperAdminUsers = async (hotels) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const usersWithHotelNames = MOCK_USERS_DB.map(u => {
                const hotel = hotels.find(h => h.id === u.hotel_id);
                return {
                    ...u,
                    hotel: hotel?.name || 'N/A',
                };
            });
            resolve(usersWithHotelNames);
        }, 500);
    });
};

export const addSuperAdminUser = async (userData, hotels, signUpMock) => {
    return new Promise(async (resolve) => {
        setTimeout(async () => {
            try {
                const { email, password, role, hotel_id, name } = userData;
                
                const mockUser = await signUpMock(email, password, name, role, hotel_id);

                const newUser = {
                    id: mockUser.id,
                    name: name || `Utilisateur ${email.split('@')[0]}`,
                    email,
                    hotel_id,
                    role,
                    lastLogin: null 
                };
                MOCK_USERS_DB.push(newUser);
                
                const hotel = hotels.find(h => h.id === newUser.hotel_id);
                toast({ title: "Utilisateur Ajouté (Simulé)" });
                resolve({ ...newUser, hotel: hotel?.name || 'N/A' });
            } catch (error) {
                console.error("Error adding user (simulated):", error);
                toast({ variant: "destructive", title: "Erreur Ajout Utilisateur (Simulé)", description: error.message });
                resolve(null);
            }
        }, 700);
    });
};

export const updateSuperAdminUserProfile = async (userId, userData, hotels) => {
     return new Promise(resolve => {
        setTimeout(() => {
            const userIndex = MOCK_USERS_DB.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                toast({ variant: "destructive", title: "Erreur Modification Utilisateur (Simulé)", description: "Utilisateur non trouvé." });
                resolve(null);
                return;
            }
            MOCK_USERS_DB[userIndex] = { ...MOCK_USERS_DB[userIndex], ...userData };
            const hotel = hotels.find(h => h.id === MOCK_USERS_DB[userIndex].hotel_id);
            toast({ title: "Utilisateur Modifié (Simulé)" });
            resolve({ ...MOCK_USERS_DB[userIndex], hotel: hotel?.name || 'N/A' });
        }, 500);
    });
};

export const deleteSuperAdminUser = async (userId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const initialLength = MOCK_USERS_DB.length;
            MOCK_USERS_DB = MOCK_USERS_DB.filter(u => u.id !== userId);
            if (MOCK_USERS_DB.length < initialLength) {
                toast({ title: "Utilisateur Supprimé (Simulé)" });
                resolve(true);
            } else {
                toast({ variant: "destructive", title: "Erreur Suppression Utilisateur (Simulé)", description: "Utilisateur non trouvé." });
                resolve(false);
            }
        }, 300);
    });
};
