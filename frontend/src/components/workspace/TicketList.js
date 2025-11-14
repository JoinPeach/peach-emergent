import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, MessageSquare, Phone, UserCheck, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TicketList = ({
  tickets,
  selectedTicket,
  onTicketSelect,
  queues,
  filters,
  onFilterChange,
  loading,
}) => {
  const getChannelIcon = (channel) => {
    const icons = {
      email: <Mail className="w-3.5 h-3.5 text-gray-400" />,
      chat: <MessageSquare className="w-3.5 h-3.5 text-gray-400" />,
      phone: <Phone className="w-3.5 h-3.5 text-gray-400" />,
      walk_in: <UserCheck className="w-3.5 h-3.5 text-gray-400" />,
    };
    return icons[channel] || icons.email;
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-50 text-blue-700 border-blue-200',
      waiting_on_student: 'bg-amber-50 text-amber-700 border-amber-200',
      closed: 'bg-green-50 text-green-700 border-green-200',
    };
    const labels = {
      open: 'Open',
      waiting_on_student: 'Waiting',
      closed: 'Closed',
    };
    return (
      <Badge className={`${styles[status] || styles.open} text-xs font-medium border`}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'border-l-red-500',
      high: 'border-l-orange-500',
      medium: 'border-l-blue-500',
      low: 'border-l-gray-300',
    };
    return colors[priority] || colors.medium;
  };

  const filterButtons = [
    { value: null, label: 'All' },
    { value: 'my', label: 'My Tickets' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'open', label: 'Open' },
    { value: 'waiting_on_student', label: 'Waiting' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="w-96 border-r border-gray-200 bg-white flex flex-col" data-testid="ticket-list">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {tickets.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            className="pl-9 h-9 bg-gray-50 border-gray-200"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 mb-3">
          {filterButtons.map((btn) => (
            <button
              key={btn.value || 'all'}
              onClick={() => onFilterChange({ status: btn.value })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filters.status === btn.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              data-testid={`filter-${btn.value || 'all'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Queue Filter */}
        <Select
          value={filters.queue_id || 'all'}
          onValueChange={(value) => onFilterChange({ queue_id: value === 'all' ? null : value })}
        >
          <SelectTrigger className="h-9 bg-gray-50 border-gray-200">
            <SelectValue placeholder="All Tickets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
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
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center" data-testid="empty-tickets">
            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-900">No tickets found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => onTicketSelect(ticket)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-gray-50 ' + getPriorityColor(ticket.priority)
                    : 'border-l-transparent'
                }`}
                data-testid={`ticket-${ticket.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 truncate flex-1">
                    {ticket.student?.name || 'Unknown Student'}
                  </span>
                  {getStatusBadge(ticket.status)}
                </div>

                <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-1">
                  {ticket.subject}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    {getChannelIcon(ticket.channel)}
                    <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                  </div>
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

export default TicketList;
