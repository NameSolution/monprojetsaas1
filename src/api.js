const api = async (endpoint, options = {}) => {
  const res = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

export default api;
