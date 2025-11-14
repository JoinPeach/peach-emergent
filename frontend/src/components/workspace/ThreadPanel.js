import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Mail, Sparkles, Send, Clock, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { messageAPI, aiToolsAPI } from '../../lib/api';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const ThreadPanel = ({ ticketDetails, onTicketUpdate }) => {
  const { user } = useAuth();
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);

  if (!ticketDetails) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]" data-testid="thread-panel-empty">
        <div className="text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-[#CBD5E1]" />
          <p className="text-lg font-medium text-[#64748B]">Select a ticket to view details</p>
          <p className="text-sm text-[#94A3B8] mt-1">Choose from the inbox on the left</p>
        </div>
      </div>
    );
  }

  const { ticket, messages, student } = ticketDetails;

  const handleSendReply = async () => {
    if (!replyBody.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      await messageAPI.create(ticket.id, replyBody, 'outbound');
      setReplyBody('');
      toast.success('Reply sent successfully');
      onTicketUpdate();
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleGenerateDraft = async () => {
    const latestInbound = messages.filter(m => m.direction === 'inbound').pop();
    if (!latestInbound) {
      toast.error('No student message to reply to');
      return;
    }

    setGeneratingDraft(true);
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

      const draft = await aiToolsAPI.draftReply(draftRequest);
      setAiDraft(draft);
      setShowDraftDialog(true);
      toast.success('AI draft generated');
    } catch (error) {
      toast.error('Failed to generate AI draft');
    } finally {
      setGeneratingDraft(false);
    }
  };

  const handleUseDraft = () => {
    setReplyBody(aiDraft.safe_reply);
    setShowDraftDialog(false);
    toast.success('Draft loaded into composer');
  };

  return (
    <div className="flex-1 flex flex-col bg-white" data-testid="thread-panel">
      {/* Thread Header */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-semibold text-[#003366]">
            {ticket.subject}
          </h2>
          <Badge className="text-xs">
            {ticket.category.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-[#64748B]">
          {student.name} ({student.email})
        </p>
      </div>

      {/* Message Thread */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-3xl">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[#64748B]">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.id}`}
              >
                <div
                  className={`max-w-2xl rounded-lg p-4 ${
                    message.direction === 'outbound'
                      ? 'bg-[#E6F2FF] border border-[#0066CC]/20'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.direction === 'inbound' ? (
                      <UserIcon className="w-4 h-4 text-[#64748B]" />
                    ) : (
                      <Mail className="w-4 h-4 text-[#0066CC]" />
                    )}
                    <span className="text-xs font-medium text-[#475569]">
                      {message.sender_email}
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-sm text-[#475569] whitespace-pre-wrap">
                    {message.body}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Reply Composer */}
      <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#475569]">
              Reply to {student.name}
            </label>
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateDraft}
              disabled={generatingDraft || messages.length === 0}
              className="border-[#0066CC] text-[#0066CC] hover:bg-[#E6F2FF]"
              data-testid="generate-draft-btn"
            >
              {generatingDraft ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {generatingDraft ? 'Generating...' : 'Generate AI Draft'}
            </Button>
          </div>

          <Textarea
            placeholder="Type your reply here..."
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            rows={6}
            className="resize-none border-[#E2E8F0] focus:border-[#0066CC]"
            data-testid="reply-textarea"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSendReply}
              disabled={sending || !replyBody.trim()}
              className="bg-[#0066CC] hover:bg-[#003366] text-white"
              data-testid="send-reply-btn"
            >
              {sending ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {sending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Draft Dialog */}
      <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#003366]">
              <Sparkles className="w-5 h-5 mr-2 text-[#0066CC]" />
              AI-Generated Draft
            </DialogTitle>
            <DialogDescription className="text-[#64748B]">
              Review and edit the draft below before using it in your reply
            </DialogDescription>
          </DialogHeader>

          {aiDraft && (
            <div className="space-y-4">
              {/* Summary */}
              <div>
                <h4 className="text-sm font-semibold text-[#475569] mb-1">Summary</h4>
                <p className="text-sm text-[#64748B] bg-[#F8FAFC] p-3 rounded-md">
                  {aiDraft.summary}
                </p>
              </div>

              <Separator />

              {/* Cited KB Articles */}
              {aiDraft.cited_kb && aiDraft.cited_kb.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#475569] mb-2">Knowledge Base References</h4>
                  <div className="space-y-2">
                    {aiDraft.cited_kb.map((kb, idx) => (
                      <div key={idx} className="bg-[#E6F2FF] p-3 rounded-md border border-[#0066CC]/20">
                        <p className="text-sm font-medium text-[#003366]">{kb.title}</p>
                        <p className="text-xs text-[#64748B] mt-1">{kb.excerpt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Draft Reply */}
              <div>
                <h4 className="text-sm font-semibold text-[#475569] mb-2">Draft Reply</h4>
                <Textarea
                  value={aiDraft.safe_reply}
                  onChange={(e) => setAiDraft({ ...aiDraft, safe_reply: e.target.value })}
                  rows={12}
                  className="font-mono text-sm border-[#E2E8F0]"
                  data-testid="ai-draft-textarea"
                />
              </div>

              {/* PII Redaction Report */}
              {aiDraft.redaction_report && Object.keys(aiDraft.redaction_report).length > 0 && (
                <div className="bg-[#FEF3C7] p-3 rounded-md border border-[#F59E0B]/20">
                  <h4 className="text-sm font-semibold text-[#92400E] mb-1">PII Redaction Report</h4>
                  <p className="text-xs text-[#92400E]">
                    {JSON.stringify(aiDraft.redaction_report)}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDraftDialog(false)}
              className="border-[#E2E8F0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUseDraft}
              className="bg-[#0066CC] hover:bg-[#003366] text-white"
              data-testid="use-draft-btn"
            >
              Use This Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThreadPanel;
