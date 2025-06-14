import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useClientData = () => {
  const [hotel, setHotel] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalInteractions: 0,
    monthlyInteractions: 0,
    weeklyInteractions: 0,
    dailyInteractions: []
  });
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelData, analyticsData, ticketsData] = await Promise.all([
        apiService.getMyHotel(),
        apiService.getAnalytics(),
        apiService.getSupportTickets()
      ]);

      setHotel(hotelData);
      setAnalytics(analyticsData);
      setSupportTickets(ticketsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateHotel = async (hotelData) => {
    try {
      const updatedHotel = await apiService.updateHotel(hotel.id, hotelData);
      setHotel(updatedHotel);
      return updatedHotel;
    } catch (err) {
      throw err;
    }
  };

  const createSupportTicket = async (ticketData) => {
    try {
      const newTicket = await apiService.createSupportTicket({
        ...ticketData,
        hotel_id: hotel.id
      });
      setSupportTickets(prev => [...prev, newTicket]);
      return newTicket;
    } catch (err) {
      throw err;
    }
  };

  return {
    hotel,
    analytics,
    supportTickets,
    loading,
    error,
    updateHotel,
    createSupportTicket,
    refetch: fetchData
  };
};