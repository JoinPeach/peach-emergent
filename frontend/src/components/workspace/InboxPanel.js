import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Mail, MessageSquare, Phone, User as UserIcon, Clock, Inbox, Star, Send as SendIcon } from 'lucide-react';
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
        return <Mail className="w-4 h-4 text-[#0078D4]" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-[#10893E]" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-[#8764B8]" />;
      case 'walk_in':
        return <UserIcon className="w-4 h-4 text-[#CA5010]" />;
      default:
        return <Mail className="w-4 h-4 text-[#0078D4]" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-[#0078D4] text-white',
      waiting_on_student: 'bg-[#F3D03E] text-[#323130]',
      closed: 'bg-[#10893E] text-white',
    };
    return (
      <Badge className={`${styles[status] || styles.open} text-xs font-medium px-2`}>
        {status === 'waiting_on_student' ? 'Waiting' : status}
      </Badge>
    );
  };

  const getPriorityIndicator = (priority) => {
    if (priority === 'urgent' || priority === 'high') {
      return (
        <div className="w-1.5 h-1.5 rounded-full bg-[#D13438]" title={priority} />
      );
    }
    return null;
  };

  return (
    <div className="w-80 bg-[#FAF9F8] border-r border-[#EDEBE9] flex flex-col" data-testid="inbox-panel">
      {/* Outlook-style Navigation */}
      <div className="p-3 bg-white border-b border-[#EDEBE9]">
        <div className="flex items-center space-x-2 mb-3">
          <Inbox className="w-5 h-5 text-[#0078D4]" />
          <h2 className="font-semibold text-[#323130]">Inbox</h2>
          <Badge variant="secondary" className="ml-auto bg-[#E1DFDD] text-[#323130]">
            {tickets.length}
          </Badge>
        </div>

        <Tabs
          value={filters.status || 'all'}
          onValueChange={(value) => onFilterChange({ status: value === 'all' ? null : value })}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 gap-1 bg-[#F3F2F1]">
            <TabsTrigger value="all" data-testid="filter-all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="my" data-testid="filter-my" className="text-xs">My Tickets</TabsTrigger>
            <TabsTrigger value="unassigned" data-testid="filter-unassigned" className="text-xs">Unassigned</TabsTrigger>
            <TabsTrigger value="waiting_on_student" data-testid="filter-waiting" className="text-xs">Waiting</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filter by Queue */}
      <div className="px-3 py-2 bg-white border-b border-[#EDEBE9]">
        <Select
          value={filters.queue_id || 'all'}
          onValueChange={(value) => onFilterChange({ queue_id: value === 'all' ? null : value })}
        >
          <SelectTrigger data-testid="queue-filter" className="h-8 text-sm border-[#8A8886]">
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

      {/* Ticket List - Outlook Style */}
      <ScrollArea className="flex-1 bg-white">
        {loading ? (
          <div className="p-4 text-center text-[#8A8886]">
            <Clock className="w-6 h-6 mx-auto mb-2 animate-spin" />
            <p className="text-sm">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center" data-testid="empty-inbox">
            <Mail className="w-12 h-12 mx-auto mb-3 text-[#D2D0CE]" />
            <p className="text-sm font-medium text-[#605E5C]">No tickets found</p>
            <p className="text-xs text-[#8A8886] mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div>
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => onTicketSelect(ticket)}
                className={`w-full text-left p-3 border-b border-[#EDEBE9] hover:bg-[#F3F2F1] transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-[#E1DFDD]' : 'bg-white'
                }`}
                data-testid={`ticket-${ticket.id}`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar Circle - Outlook Style */}
                  <div className="w-8 h-8 rounded-full bg-[#0078D4] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {ticket.student?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[#323130] truncate">
                        {ticket.student?.name || 'Unknown Student'}
                      </span>
                      <div className="flex items-center space-x-1 ml-2">
                        {getPriorityIndicator(ticket.priority)}
                        {getChannelIcon(ticket.channel)}
                      </div>
                    </div>

                    <p className="text-sm text-[#323130] font-medium truncate mb-1">
                      {ticket.subject}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8A8886]">
                        {ticket.updated_at && formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                      </span>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
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
