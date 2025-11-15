import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTicket } from '../contexts/TicketContext';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import TicketList from '../components/workspace/TicketList';
import ConversationPanel from '../components/workspace/ConversationPanel';
import StudentPanel from '../components/workspace/StudentPanel';

const WorkspacePage = () => {
  const { user } = useAuth();
  const { 
    tickets, 
    queues, 
    selectedTicket, 
    setSelectedTicket, 
    ticketDetails, 
    handleTicketUpdate, 
    loading, 
    filters, 
    handleFilterChange 
  } = useTicket();

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
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
