import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useSuperAdminData = () => {
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalInteractions: 0,
    monthlyInteractions: 0,
    weeklyInteractions: 0,
    totalHotels: 0,
    totalTickets: 0,
    openTickets: 0,
    dailyInteractions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsData, usersData, plansData, ticketsData, analyticsData] = await Promise.all([
        apiService.getHotels(),
        apiService.getUsers(),
        apiService.getPlans(),
        apiService.getSupportTickets(),
        apiService.getAnalytics()
      ]);

      setHotels(hotelsData);
      setUsers(usersData);
      setPlans(plansData);
      setSupportTickets(ticketsData);
      setAnalytics(analyticsData);
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

  return {
    hotels,
    users,
    plans,
    supportTickets,
    analytics,
    loading,
    error,
    createHotel,
    updateHotel,
    deleteHotel,
    createUser,
    updateUser,
    deleteUser,
    createSupportTicket,
    updateSupportTicket,
    refetch: fetchData
  };
};