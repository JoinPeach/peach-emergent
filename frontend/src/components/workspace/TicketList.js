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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tickets by search query
  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const ticketNumber = parseInt(ticket.id.replace(/\D/g, '').substring(0, 4)) || 0;
    
    return (
      ticket.subject?.toLowerCase().includes(query) ||
      ticket.student?.name?.toLowerCase().includes(query) ||
      ticket.student?.email?.toLowerCase().includes(query) ||
      ticket.category?.toLowerCase().includes(query) ||
      ticketNumber.toString().includes(query)
    );
  });

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-50 text-blue-700 border-blue-200',
      in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
      closed: 'bg-green-50 text-green-700 border-green-200',
    };
    const labels = {
      open: 'Open',
      in_progress: 'In Progress',
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
  ];

  return (
    <div className="w-96 border-r border-gray-200 bg-white flex flex-col" data-testid="ticket-list">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {filteredTickets.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-gray-50 border-gray-200"
            data-testid="search-tickets-input"
          />
        </div>

        {/* Filter Tabs - Underlined Style */}
        <div className="flex items-center border-b border-gray-200 mb-3">
          {filterButtons.map((btn) => (
            <button
              key={btn.value || 'all'}
              onClick={() => onFilterChange({ status: btn.value })}
              className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                filters.status === btn.value
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid={`filter-${btn.value || 'all'}`}
            >
              {btn.label}
              {filters.status === btn.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          ))}
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filters.ticketStatus || 'all'}
            onValueChange={(value) => onFilterChange({ ticketStatus: value === 'all' ? null : value, status: value === 'all' ? null : value })}
          >
            <SelectTrigger className="h-9 bg-gray-50 border-gray-200" data-testid="status-filter-dropdown">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => onFilterChange({ category: value === 'all' ? null : value })}
          >
            <SelectTrigger className="h-9 bg-gray-50 border-gray-200" data-testid="category-filter-dropdown">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="fafsa">FAFSA</SelectItem>
              <SelectItem value="verification">Verification</SelectItem>
              <SelectItem value="sap_appeal">SAP Appeals</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ticket List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center" data-testid="empty-tickets">
            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-900">No tickets found</p>
            <p className="text-xs text-gray-500 mt-1">{searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTickets.map((ticket) => {
              // Generate 4-digit ticket number from UUID
              const ticketNumber = parseInt(ticket.id.replace(/\D/g, '').substring(0, 4)) || Math.floor(1000 + Math.random() * 9000);
              
              return (
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
                    Ticket #{ticketNumber}
                  </span>
                  {getStatusBadge(ticket.status)}
                </div>

                <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-1">
                  {ticket.subject}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                  <span>
                    {ticket.updated_at && formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                  </span>
                </div>
              </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TicketList;
