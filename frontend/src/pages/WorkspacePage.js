import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTicket } from '../contexts/TicketContext';
import { ticketAPI, queueAPI } from '../lib/api';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import TicketList from '../components/workspace/TicketList';
import ConversationPanel from '../components/workspace/ConversationPanel';
import StudentPanel from '../components/workspace/StudentPanel';
import { toast } from 'sonner';

const WorkspacePage = () => {
  const { user } = useAuth();
  const { selectedTicket, setSelectedTicket, ticketDetails, handleTicketUpdate } = useTicket();
  const [tickets, setTickets] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: null,
    queue_id: null,
    category: null,
  });

  useEffect(() => {
    loadQueues();
  }, []);

  useEffect(() => {
    loadTickets();
  }, [filters]);

  // Restore selected ticket when tickets are loaded
  useEffect(() => {
    const savedTicketId = localStorage.getItem('selectedTicketId');
    if (savedTicketId && tickets.length > 0 && !selectedTicket) {
      const savedTicket = tickets.find(t => t.id === savedTicketId);
      if (savedTicket) {
        setSelectedTicket(savedTicket);
      }
    }
  }, [tickets, selectedTicket, setSelectedTicket]);

  const loadQueues = async () => {
    try {
      const data = await queueAPI.list();
      setQueues(data.queues);
    } catch (error) {
      toast.error('Failed to load queues');
    }
  };

  const loadTickets = async (retryCount = 0) => {
    setLoading(true);
    try {
      const data = await ticketAPI.list(filters);
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      
      // Retry once if it's the first failure
      if (retryCount === 0) {
        console.log('Retrying ticket load...');
        setTimeout(() => loadTickets(1), 1000);
        return;
      }
      
      toast.error('Failed to load tickets - please refresh the page');
      // Set empty array to prevent stuck state
      setTickets([]);
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTicketUpdateLocal = () => {
    loadTickets();
    handleTicketUpdate();
  };

  return (
    <WorkspaceLayout user={user}>
      <div className="flex h-full bg-gray-50" data-testid="workspace-page">
        {/* Left Panel: Ticket List */}
        <TicketList
          tickets={tickets}
          selectedTicket={selectedTicket}
          onTicketSelect={handleTicketSelect}
          queues={queues}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Middle Panel: Conversation + AI Draft */}
        <ConversationPanel
          ticketDetails={ticketDetails}
          onTicketUpdate={handleTicketUpdateLocal}
        />

        {/* Right Panel: Student Profile + Timeline + Audit Log */}
        <StudentPanel
          ticketDetails={ticketDetails}
          onStudentUpdate={handleTicketUpdateLocal}
        />
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspacePage;
