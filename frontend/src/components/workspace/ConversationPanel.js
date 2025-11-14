import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, Send, RefreshCw, Edit3, Sparkles, Clock, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { messageAPI, aiToolsAPI, ticketAPI, userAPI } from '../../lib/api';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const ConversationPanel = ({ ticketDetails, onTicketUpdate }) => {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const data = await userAPI.list();
      setStaffMembers(data.users || []);
    } catch (error) {
      console.error('Failed to load staff members:', error);
    }
  };

  // Check if new student message arrived - trigger AI draft ONLY then
  useEffect(() => {
    if (ticketDetails) {
      const inboundMessages = ticketDetails.messages.filter(m => m.direction === 'inbound');
      const currentInboundCount = inboundMessages.length;
      
      // If there's a new inbound message and ticket is not closed, generate draft
      if (currentInboundCount > lastMessageCount && ticketDetails.ticket.status !== 'closed') {
        handleGenerateDraft(true, false);
      }
      
      setLastMessageCount(currentInboundCount);
    }
  }, [ticketDetails?.messages?.length]);

  // Reset draft when ticket changes
  useEffect(() => {
    setAiDraft(null);
    setIsRegenerating(false);
    setLastMessageCount(0);
  }, [ticketDetails?.ticket?.id]);

  if (!ticketDetails) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border-r border-gray-200" data-testid="conversation-panel-empty">
        <div className="text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-base font-medium text-gray-900">Select a ticket</p>
          <p className="text-sm text-gray-500 mt-1">Choose a ticket from the list to view details</p>
        </div>
      </div>
    );
  }

  const { ticket, messages, student } = ticketDetails;

  const handleStatusChange = async (newStatus) => {
    try {
      await ticketAPI.update(ticket.id, { status: newStatus });
      toast.success('Status updated');
      onTicketUpdate();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssignTicket = async (assigneeId) => {
    try {
      await ticketAPI.update(ticket.id, { assignee_id: assigneeId });
      toast.success('Ticket assigned');
      onTicketUpdate();
    } catch (error) {
      toast.error('Failed to assign ticket');
    }
  };

  const handleSendReply = async () => {
    if (!aiDraft?.safe_reply?.trim()) {
      toast.error('No reply to send');
      return;
    }

    setSending(true);
    try {
      // Send the message
      await messageAPI.create(ticket.id, aiDraft.safe_reply, 'outbound');
      
      // Clear AI draft
      setAiDraft(null);
      setIsRegenerating(false);
      
      // Show success
      toast.success('Reply sent successfully');
      
      // Reload ticket to show new message in conversation
      onTicketUpdate();
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleGenerateDraft = async (isAuto = false, isRegenerate = false) => {
    const latestInbound = messages?.filter(m => m.direction === 'inbound').pop();
    if (!latestInbound) {
      if (!isAuto) toast.error('No student message to reply to');
      return;
    }

    setGeneratingDraft(true);
    if (isRegenerate) {
      setIsRegenerating(true);
    }
    
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Draft generation timed out')), 30000)
    );
    
    try {
      const draftRequest = {
        institution_id: user.institution_id,
        ticket_id: ticket.id,
        student_email: student.email,
        student_name: student.name,
        latest_message: latestInbound.body,
        thread_context: messages.slice(-3).map(m => ({
          sender: m.sender_email,
          body: m.body,
        })),
        student_notes: student.notes,
      };

      const draft = await Promise.race([
        aiToolsAPI.draftReply(draftRequest),
        timeout
      ]);
      
      setAiDraft(draft);
      if (!isAuto) toast.success('AI draft regenerated');
    } catch (error) {
      console.error('Draft generation error:', error);
      if (error.message === 'Draft generation timed out') {
        toast.error('AI draft is taking longer than expected. Please try regenerating.');
      } else {
        if (!isAuto) toast.error('Failed to generate AI draft');
      }
    } finally {
      setGeneratingDraft(false);
    }
  };

  const isTicketClosed = ticket.status === 'closed';

  return (
    <div className="flex-1 flex flex-col bg-white border-r border-gray-200" data-testid="conversation-panel">
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Subject Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {ticket.subject}
              </h1>
              <div className="flex items-center space-x-2">
                <Select value={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-40 h-9" data-testid="ticket-status-dropdown">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {!ticket.assignee_id && (
                  <Select value={ticket.assignee_id || 'unassigned'} onValueChange={handleAssignTicket}>
                    <SelectTrigger className="w-40 h-9" data-testid="assignee-dropdown">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" disabled>Unassigned</SelectItem>
                      {staffMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{student.name}</span>
              <span className="text-gray-400">•</span>
              <span>{student.email}</span>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Email Conversation */}
          <div className="space-y-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Conversation</h2>
            {messages.map((message, index) => (
              <div key={message.id} className="space-y-4">
                {index > 0 && <Separator />}
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {message.direction === 'inbound' ? student.name : 'Puneet Thiara'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                      {message.direction === 'inbound' && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Student
                        </Badge>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {message.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggested Reply - Only show if not closed AND has draft */}
          {!isTicketClosed && aiDraft && (
            <>
              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">AI Suggested Reply</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Edit functionality coming soon')}
                      disabled={generatingDraft}
                      className="h-8 text-xs"
                      data-testid="edit-draft-btn"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateDraft(false, true)}
                      disabled={generatingDraft}
                      className="h-8 text-xs"
                      data-testid="regenerate-draft-btn"
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${generatingDraft ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 mb-1">AI Draft Ready</p>
                      <p className="text-xs text-green-700 mb-2">{aiDraft.summary}</p>
                      {aiDraft.cited_kb && aiDraft.cited_kb.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-green-800">Knowledge Base References:</p>
                          {aiDraft.cited_kb.map((kb, idx) => (
                            <p key={idx} className="text-xs text-green-600">• {kb.title}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Read-only Draft Display */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {aiDraft.safe_reply}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic">
                  This AI-generated content has been reviewed for safety and includes required disclaimers.
                </p>
              </div>
            </>
          )}
          
          {/* Generating Banner - Show even without draft when generating */}
          {!isTicketClosed && generatingDraft && !aiDraft && (
            <>
              <Separator className="mb-6" />
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">AI Suggested Reply</h2>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-amber-600 animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      {isRegenerating ? 'Regenerating AI reply...' : 'Generating AI reply...'}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">This may take up to 30 seconds</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Fixed Action Bar */}
      {aiDraft && !isTicketClosed && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <Check className="w-3 h-3 inline mr-1" />
              Ready to send
            </div>
            <Button
              onClick={handleSendReply}
              disabled={sending || generatingDraft}
              className="bg-gray-900 hover:bg-gray-800 text-white"
              data-testid="send-reply-btn"
            >
              {sending ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationPanel;
