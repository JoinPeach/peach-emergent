import React, { createContext, useContext, useState, useEffect } from 'react';
import { ticketAPI } from '../lib/api';

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
    
    if (savedTicketId && savedTicketData) {
      try {
        const ticketData = JSON.parse(savedTicketData);
        setSelectedTicket(ticketData);
      } catch (error) {
        console.error('Failed to restore ticket state:', error);
        localStorage.removeItem('selectedTicketId');
        localStorage.removeItem('selectedTicketData');
      }
    }
  }, []);

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
    if (selectedTicket) {
      loadTicketDetails(selectedTicket.id);
    }
  };

  return (
    <TicketContext.Provider value={{
      selectedTicket,
      setSelectedTicket,
      ticketDetails,
      handleTicketUpdate
    }}>
      {children}
    </TicketContext.Provider>
  );
};