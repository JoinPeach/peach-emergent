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
  });

  useEffect(() => {
    loadQueues();
  }, []);

  useEffect(() => {
    loadTickets();
  }, [filters]);

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

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
          onTicketUpdate={handleTicketUpdate}
        />

        {/* Right Panel: Student Profile + Timeline + Audit Log */}
        <StudentPanel
          ticketDetails={ticketDetails}
          onStudentUpdate={handleTicketUpdate}
        />
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspacePage;
