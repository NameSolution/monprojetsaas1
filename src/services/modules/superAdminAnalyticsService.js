

const MOCK_INTERACTIONS = Array.from({length: 100}, (_, i) => ({
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

const MOCK_HOTELS_FOR_ANALYTICS = [
    { plans: { name: 'Essentiel' } },
    { plans: { name: 'Premium' } },
    { plans: { name: 'Essentiel' } },
    { plans: { name: 'Entreprise' } },
    { plans: { name: 'Premium' } },
];

export const fetchSuperAdminAnalyticsData = async (initialConversationsData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const conversationsPerMonth = initialConversationsData.map(item => {
                const monthName = item.month;
                const count = MOCK_INTERACTIONS.filter(int => new Date(int.timestamp).toLocaleDateString('fr-FR', {month:'short'}) === monthName).length;
                return { month: monthName, conversations: Math.floor(count / 2 + Math.random() * 20) }; 
            });

            const planCounts = MOCK_HOTELS_FOR_ANALYTICS.reduce((acc, hotel) => {
                const planName = hotel.plans?.name || 'N/A'; 
                acc[planName] = (acc[planName] || 0) + 1;
                return acc;
            }, {});
            const plansDistribution = Object.entries(planCounts).map(([name, value]) => ({name, value}));

            resolve({ 
                conversationsData: conversationsPerMonth,
                plansData: plansDistribution.length > 0 ? plansDistribution : [{name: 'Aucun', value: 0}],
            });
        }, 800);
    });
};

export const fetchSuperAdminBillingData = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const billingData = MOCK_HOTELS_FOR_ANALYTICS.map((h, index) => ({
                id: `INV-sim-${index}-${new Date().getFullYear()}`,
                hotel: `Hôtel Simulé ${index + 1}`,
                amount: `${(Math.random() * 200 + 50).toFixed(2)}€`, 
                date: new Date(new Date().setMonth(new Date().getMonth() - index)).toLocaleDateString(),
                status: Math.random() > 0.2 ? 'Payée' : 'En attente'
            }));
            resolve(billingData);
        }, 600);
    });
};
