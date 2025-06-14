

const MOCK_PLANS_DB = [
    { id: 'plan1-uuid', name: 'Essentiel (Simulé)' },
    { id: 'plan2-uuid', name: 'Premium (Simulé)' },
    { id: 'plan3-uuid', name: 'Entreprise (Simulé)' },
];

export const fetchPlans = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...MOCK_PLANS_DB]);
        }, 300);
    });
};
