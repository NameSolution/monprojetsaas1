import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useClientData = () => {
  const [profile, setProfile] = useState(null);
  const [customization, setCustomization] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [supportTickets, setSupportTickets] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [hotelId, setHotelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const hotelPromise = apiService
        .getMyHotel()
        .catch((err) => {
          console.error('getMyHotel failed:', err);
          setError('hotel');
          return null;
        });
      const analyticsPromise = apiService
        .getAnalytics()
        .catch((err) => {
          console.error('getAnalytics failed:', err);
          return {};
        });
      const ticketsPromise = apiService
        .getSupportTickets()
        .catch((err) => {
          console.error('getSupportTickets failed:', err);
          return [];
        });

      const [hotelData, analyticsData, ticketsData] = await Promise.all([
        hotelPromise,
        analyticsPromise,
        ticketsPromise,
      ]);

      if (hotelData) {
        setHotelId(hotelData.id);
        setProfile({
          hotelName: hotelData.name,
          contactEmail: hotelData.contact_email,
          contactName: hotelData.contact_name,
          notificationEmail: hotelData.contact_email,
          slug: hotelData.slug
        });
        setCustomization({
          name: hotelData.name,
          welcomeMessage: hotelData.welcome_message,
          primaryColor: hotelData.theme_color,
          logoUrl: hotelData.logo_url,
          defaultLanguage: hotelData.default_lang_code
        });
        if (hotelData.languages) {
          setAvailableLanguages(hotelData.languages);
        }
      }

      setAnalytics(analyticsData || {});
      setSupportTickets(ticketsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateProfile = async (profileData) => {
    if (!hotelId) return null;
    try {
      const updated = await apiService.updateHotel(hotelId, {
        name: profileData.hotelName,
        contact_name: profileData.contactName,
        contact_email: profileData.contactEmail
      });
      setProfile(prev => ({ ...prev, ...profileData }));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const updateCustomization = async (config) => {
    if (!hotelId) return null;
    try {
      const updated = await apiService.updateHotel(hotelId, {
        name: config.name,
        welcome_message: config.welcomeMessage,
        theme_color: config.primaryColor,
        logo_url: config.logoUrl,
        default_lang_code: config.defaultLanguage
      });
      setCustomization(prev => ({ ...prev, ...config }));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const updateHotelLanguages = async (langs, defaultLang) => {
    if (!hotelId) return null;
    try {
      const updated = await apiService.updateHotel(hotelId, {
        default_lang_code: defaultLang
      });
      setAvailableLanguages(langs);
      setCustomization(prev => ({ ...prev, defaultLanguage: defaultLang }));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const createSupportTicket = async (ticketData) => {
    try {
      const newTicket = await apiService.createSupportTicket({
        ...ticketData,
        hotel_id: hotelId
      });
      setSupportTickets(prev => [...prev, newTicket]);
      return newTicket;
    } catch (err) {
      throw err;
    }
  };

  // Temporary placeholders for knowledge base management
  const updateKnowledgeBase = async () => {
    console.warn('updateKnowledgeBase not implemented');
    return null;
  };

  const deleteKnowledgeItem = async () => {
    console.warn('deleteKnowledgeItem not implemented');
    return null;
  };

  return {
    profile,
    customization,
    analytics,
    knowledgeBase,
    supportTickets,
    availableLanguages,
    hotelId,
    loading,
    error,
    updateProfile,
    updateCustomization,
    updateHotelLanguages,
    createSupportTicket,
    updateKnowledgeBase,
    deleteKnowledgeItem,
    refetch: fetchData
  };
};
