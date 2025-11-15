import React, { createContext, useContext, useState, useEffect } from 'react';
import { ticketAPI, queueAPI } from '../lib/api';
import { toast } from 'sonner';

const TicketContext = createContext(null);

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
    queue_id: null,
  });

  // Load tickets and queues on mount
  useEffect(() => {
    loadQueues();
    loadTickets();
  }, []);

  // Reload tickets when filters change
  useEffect(() => {
    if (filters.status !== null || filters.queue_id !== null) {
      loadTickets();
    }
  }, [filters]);

  const loadQueues = async () => {
    try {
      const data = await queueAPI.list();
      setQueues(data.queues || []);
    } catch (error) {
      console.error('Failed to load queues:', error);
    }
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketAPI.list(filters);
      setTickets(data.tickets || []);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  // Load ticket details when ticket changes
  useEffect(() => {
    if (selectedTicket) {
      loadTicketDetails(selectedTicket.id);
      // Save to localStorage
      localStorage.setItem('selectedTicketId', selectedTicket.id);
      localStorage.setItem('selectedTicketData', JSON.stringify(selectedTicket));
    } else {
      setTicketDetails(null);
      localStorage.removeItem('selectedTicketId');
      localStorage.removeItem('selectedTicketData');
    }
  }, [selectedTicket]);

  // Restore selected ticket from localStorage on mount
  useEffect(() => {
    const savedTicketId = localStorage.getItem('selectedTicketId');
    const savedTicketData = localStorage.getItem('selectedTicketData');
    
    if (savedTicketId && savedTicketData && tickets.length > 0) {
      try {
        const ticketData = JSON.parse(savedTicketData);
        // Find the ticket in current tickets or use saved data
        const currentTicket = tickets.find(t => t.id === savedTicketId) || ticketData;
        setSelectedTicket(currentTicket);
      } catch (error) {
        console.error('Failed to restore ticket state:', error);
        localStorage.removeItem('selectedTicketId');
        localStorage.removeItem('selectedTicketData');
      }
    }
  }, [tickets]);

  const loadTicketDetails = async (ticketId) => {
    try {
      const data = await ticketAPI.get(ticketId);
      setTicketDetails(data);
    } catch (error) {
      console.error('Failed to load ticket details:', error);
      setSelectedTicket(null);
    }
  };

  const handleTicketUpdate = () => {
    loadTickets();
    if (selectedTicket) {
      loadTicketDetails(selectedTicket.id);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <TicketContext.Provider value={{
      selectedTicket,
      setSelectedTicket,
      ticketDetails,
      handleTicketUpdate,
      tickets,
      queues,
      loading,
      filters,
      handleFilterChange
    }}>
      {children}
    </TicketContext.Provider>
  );
};