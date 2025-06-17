import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useSuperAdminData = (resource) => {
  const [hotels, setHotels] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState({
    stats: {
      totalUsers: 0,
      totalHotels: 0,
      totalTickets: 0,
    },
    conversationsData: [],
    plansData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsData, hotelsData, usersData, plansData, ticketsData, analyticsData] = await Promise.all([
        apiService.getClients(),
        apiService.getHotels(),
        apiService.getUsers(),
        apiService.getPlans(),
        apiService.getSupportTickets(),
        apiService.getAnalytics()
      ]);

      setClients(clientsData);
      setHotels(hotelsData);
      setUsers(usersData);
      setPlans(plansData);
      setSupportTickets(ticketsData);
      setAnalytics({
        stats: analyticsData.stats || {},
        conversationsData: analyticsData.conversationsData || [],
        plansData: analyticsData.plansData || []
      });
      setDashboard({
        stats: analyticsData.stats || {},
        revenueData: analyticsData.conversationsData || [],
        recentHotels: hotelsData.slice(0, 4).map(h => ({
          id: h.id,
          name: h.name,
          status: h.status || 'active',
          users: usersData.filter(u => u.hotel_id === h.id).length,
          conversations: 0
        })),
        systemAlerts: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createHotel = async (hotelData) => {
    try {
      const newHotel = await apiService.createHotel(hotelData);
      setHotels(prev => [...prev, newHotel]);
      return newHotel;
    } catch (err) {
      throw err;
    }
  };

  const updateHotel = async (id, hotelData) => {
    try {
      const updatedHotel = await apiService.updateHotel(id, hotelData);
      setHotels(prev => prev.map(hotel => hotel.id === id ? updatedHotel : hotel));
      return updatedHotel;
    } catch (err) {
      throw err;
    }
  };

  const deleteHotel = async (id) => {
    try {
      await apiService.deleteHotel(id);
      setHotels(prev => prev.filter(hotel => hotel.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await apiService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await apiService.updateUser(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const createSupportTicket = async (ticketData) => {
    try {
      const newTicket = await apiService.createSupportTicket(ticketData);
      setSupportTickets(prev => [...prev, newTicket]);
      return newTicket;
    } catch (err) {
      throw err;
    }
  };

  const updateSupportTicket = async (id, ticketData) => {
    try {
      const updatedTicket = await apiService.updateSupportTicket(id, ticketData);
      setSupportTickets(prev => prev.map(ticket => ticket.id === id ? updatedTicket : ticket));
      return updatedTicket;
    } catch (err) {
      throw err;
    }
  };

  const replySupportTicket = async (id, message) => {
    try {
      const updated = await apiService.replySupportTicket(id, message);
      setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, admin_response: message } : t));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const fetchAISettings = async () => {
    try {
      const settings = await apiService.getAISettings();
      return settings;
    } catch (err) {
      throw err;
    }
  };

  const saveAISettings = async (data) => {
    try {
      return await apiService.updateAISettings(data);
    } catch (err) {
      throw err;
    }
  };

  const dataMap = {
    clients,
    hotels,
    users,
    plans,
    supportTickets,
    analytics,
    dashboard,
  };
  const setterMap = {
    clients: setClients,
    hotels: setHotels,
    users: setUsers,
    plans: setPlans,
    supportTickets: setSupportTickets,
    analytics: setAnalytics,
    dashboard: setDashboard,
  };

  return {
    data: dataMap[resource] || null,
    allData: { clients, hotels, users, plans, supportTickets, analytics, dashboard },
    loading,
    error,
    addHotel: createHotel,
    updateHotel,
    deleteHotel,
    addUser: createUser,
    updateUser,
    deleteUser,
    createSupportTicket,
    updateSupportTicket,
    replySupportTicket,
    fetchAISettings,
    saveAISettings,
    refetch: fetchData,
    setData: setterMap[resource],
  };
};
