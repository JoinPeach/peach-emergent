import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ticketAPI, queueAPI } from '../lib/api';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import InboxPanel from '../components/workspace/InboxPanel';
import ThreadPanel from '../components/workspace/ThreadPanel';
import StudentPanel from '../components/workspace/StudentPanel';
import { toast } from 'sonner';

const WorkspacePage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [queues, setQueues] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: null,
    queue_id: null,
  });

  // Load queues on mount
  useEffect(() => {
    loadQueues();
  }, []);

  // Load tickets when filters change
  useEffect(() => {
    loadTickets();
  }, [filters]);

  // Load ticket details when selection changes
  useEffect(() => {
    if (selectedTicket) {
      loadTicketDetails(selectedTicket.id);
    } else {
      setTicketDetails(null);
    }
  }, [selectedTicket]);

  const loadQueues = async () => {
    try {
      const data = await queueAPI.list();
      setQueues(data.queues);
    } catch (error) {
      toast.error('Failed to load queues');
    }
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketAPI.list(filters);
      setTickets(data.tickets);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId) => {
    try {
      const data = await ticketAPI.get(ticketId);
      setTicketDetails(data);
    } catch (error) {
      toast.error('Failed to load ticket details');
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTicketUpdate = () => {
    // Reload tickets and details after update
    loadTickets();
    if (selectedTicket) {
      loadTicketDetails(selectedTicket.id);
    }
  };

  return (
    <WorkspaceLayout user={user}>
      <div className="flex h-full" data-testid="workspace-page">
        {/* Left Panel: Inbox */}
        <InboxPanel
          tickets={tickets}
          selectedTicket={selectedTicket}
          onTicketSelect={handleTicketSelect}
          queues={queues}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Center Panel: Thread */}
        <ThreadPanel
          ticketDetails={ticketDetails}
          onTicketUpdate={handleTicketUpdate}
        />

        {/* Right Panel: Student Context */}
        <StudentPanel
          ticketDetails={ticketDetails}
          onStudentUpdate={handleTicketUpdate}
        />
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspacePage;
