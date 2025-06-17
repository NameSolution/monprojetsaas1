const API_BASE = '/api/chatbot';

export const fetchHotelConfigBySlug = async (slug) => {
  const res = await fetch(`${API_BASE}/hotel/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch hotel config');
  return res.json();
};

export const getLLMResponse = async (hotelId, sessionId, lang, prompt) => {
  const res = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hotel_id: hotelId, session_id: sessionId, lang, prompt })
  });
  const data = await res.json();
  return data.response;
};

export const logInteraction = async (hotelId, sessionId, lang, input, output) => {
  await fetch(`${API_BASE}/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hotel_id: hotelId, session_id: sessionId, lang, input, output })
  });
};

export const submitInteractionRating = async (interactionId, ratingValue) => {
  await fetch(`${API_BASE}/interactions/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interaction_id: interactionId, rating: ratingValue })
  });
};
