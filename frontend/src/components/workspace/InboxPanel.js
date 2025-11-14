import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Mail, MessageSquare, Phone, User as UserIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const InboxPanel = ({
  tickets,
  selectedTicket,
  onTicketSelect,
  queues,
  filters,
  onFilterChange,
  loading,
}) => {
  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4 text-[#0066CC]" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-[#10B981]" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-[#8B5CF6]" />;
      case 'walk_in':
        return <UserIcon className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Mail className="w-4 h-4 text-[#0066CC]" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-[#DBEAFE] text-[#3B82F6]',
      waiting_on_student: 'bg-[#FEF3C7] text-[#F59E0B]',
      closed: 'bg-[#D1FAE5] text-[#10B981]',
    };
    return (
      <Badge className={`${styles[status] || styles.open} text-xs`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'border-l-4 border-l-[#EF4444]',
      high: 'border-l-4 border-l-[#F59E0B]',
      medium: 'border-l-4 border-l-[#3B82F6]',
      low: 'border-l-4 border-l-[#94A3B8]',
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col" data-testid="inbox-panel">
      {/* Filters */}
      <div className="p-4 border-b border-[#E2E8F0] space-y-3">
        <Tabs
          value={filters.status || 'all'}
          onValueChange={(value) => onFilterChange({ status: value === 'all' ? null : value })}
        >
          <TabsList className="w-full grid grid-cols-2 gap-1">
            <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
            <TabsTrigger value="my" data-testid="filter-my">My Tickets</TabsTrigger>
            <TabsTrigger value="unassigned" data-testid="filter-unassigned">Unassigned</TabsTrigger>
            <TabsTrigger value="waiting_on_student" data-testid="filter-waiting">Waiting</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={filters.queue_id || 'all'}
          onValueChange={(value) => onFilterChange({ queue_id: value === 'all' ? null : value })}
        >
          <SelectTrigger data-testid="queue-filter">
            <SelectValue placeholder="All Queues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Queues</SelectItem>
            {queues.map((queue) => (
              <SelectItem key={queue.id} value={queue.id}>
                {queue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ticket List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 text-center text-[#64748B]">
            <Clock className="w-6 h-6 mx-auto mb-2 animate-spin" />
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center" data-testid="empty-inbox">
            <Mail className="w-12 h-12 mx-auto mb-3 text-[#CBD5E1]" />
            <p className="text-sm font-medium text-[#64748B]">No tickets found</p>
            <p className="text-xs text-[#94A3B8] mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => onTicketSelect(ticket)}
                className={`w-full text-left p-4 hover:bg-[#F1F5F9] transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-[#E6F2FF]' : ''
                } ${getPriorityColor(ticket.priority)}`}
                data-testid={`ticket-${ticket.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getChannelIcon(ticket.channel)}
                    <span className="text-sm font-semibold text-[#003366] line-clamp-1">
                      {ticket.student?.name || 'Unknown Student'}
                    </span>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                <p className="text-sm text-[#475569] line-clamp-2 mb-2">
                  {ticket.subject}
                </p>

                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                  <span>
                    {ticket.updated_at && formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default InboxPanel;
