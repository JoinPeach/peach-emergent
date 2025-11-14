import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Phone, Mail, ExternalLink, Edit3, MessageSquare, PhoneCall, UserCheck, Sparkles, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { studentAPI, aiToolsAPI } from '../../lib/api';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const StudentPanel = ({ ticketDetails, onStudentUpdate }) => {
  const { user } = useAuth();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [newEventType, setNewEventType] = useState('note');
  const [newEventContent, setNewEventContent] = useState('');
  const [savingEvent, setSavingEvent] = useState(false);
  const [aiAuditLog, setAiAuditLog] = useState([]);

  useEffect(() => {
    if (ticketDetails?.student) {
      setNotes(ticketDetails.student.notes || '');
      loadTimeline(ticketDetails.student.id);
      loadAiAuditLog();
    }
  }, [ticketDetails]);

  const loadTimeline = async (studentId) => {
    try {
      const data = await studentAPI.get(studentId);
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    }
  };

  const loadAiAuditLog = async () => {
    // Mock AI audit log for now - in production this would come from API
    // showing AI draft generations and their outcomes
    const mockAuditLog = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        action: 'draft_generated',
        summary: 'AI draft created for FAFSA deadline inquiry',
        kb_articles: 2,
        status: 'sent',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        action: 'draft_generated',
        summary: 'AI draft created for verification documents',
        kb_articles: 1,
        status: 'edited',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        action: 'student_replied',
        summary: 'Student responded to verification request',
        status: 'received',
      },
    ];
    setAiAuditLog(mockAuditLog);
  };

  const handleSaveNotes = async () => {
    try {
      await studentAPI.update(ticketDetails.student.id, { notes });
      toast.success('Notes saved');
      setEditingNotes(false);
      onStudentUpdate();
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const handleAddEvent = async () => {
    if (!newEventContent.trim()) {
      toast.error('Please enter event details');
      return;
    }

    setSavingEvent(true);
    try {
      await aiToolsAPI.addStudentEvent({
        institution_id: user.institution_id,
        student_id: ticketDetails.student.id,
        ticket_id: ticketDetails.ticket.id,
        event_type: newEventType,
        content: newEventContent,
        created_by: user.id,
      });
      toast.success('Event added');
      setShowAddEventDialog(false);
      setNewEventContent('');
      loadTimeline(ticketDetails.student.id);
      onStudentUpdate();
    } catch (error) {
      toast.error('Failed to add event');
    } finally {
      setSavingEvent(false);
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      note: <MessageSquare className="w-3.5 h-3.5 text-blue-600" />,
      phone_call: <PhoneCall className="w-3.5 h-3.5 text-purple-600" />,
      walk_in: <UserCheck className="w-3.5 h-3.5 text-orange-600" />,
      ai_routed: <Sparkles className="w-3.5 h-3.5 text-green-600" />,
      sent_email: <Mail className="w-3.5 h-3.5 text-blue-600" />,
      received_email: <Mail className="w-3.5 h-3.5 text-gray-600" />,
    };
    return icons[eventType] || <ArrowRight className="w-3.5 h-3.5 text-gray-400" />;
  };

  const getAuditIcon = (action, status) => {
    if (action === 'draft_generated') {
      if (status === 'sent') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      if (status === 'edited') return <Edit3 className="w-4 h-4 text-blue-600" />;
      return <Clock className="w-4 h-4 text-gray-400" />;
    }
    if (action === 'student_replied') return <Mail className="w-4 h-4 text-purple-600" />;
    return <Sparkles className="w-4 h-4 text-gray-400" />;
  };

  const getAuditLabel = (action, status) => {
    if (action === 'draft_generated') {
      if (status === 'sent') return 'AI Draft Sent';
      if (status === 'edited') return 'AI Draft Edited & Sent';
      return 'AI Draft Generated';
    }
    if (action === 'student_replied') return 'Student Reply Received';
    return action;
  };

  if (!ticketDetails) {
    return (
      <div className="w-96 bg-gray-50 border-l border-gray-200 flex items-center justify-center" data-testid="student-panel-empty">
        <p className="text-sm text-gray-500">No student selected</p>
      </div>
    );
  };

  const { student } = ticketDetails;

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col" data-testid="student-panel">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Unified Student Context Card - All sections connected */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Student Profile */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Student Profile</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Name</label>
                  <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Student ID</label>
                  <p className="text-sm text-gray-900">{student.student_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Email</label>
                  <p className="text-sm text-gray-900 truncate">{student.email}</p>
                </div>
                {student.phone && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Phone</label>
                    <p className="text-sm text-gray-900">{student.phone}</p>
                  </div>
                )}
                {student.sis_url && (
                  <div>
                    <a
                      href={student.sis_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-gray-900 hover:text-gray-700 font-medium"
                      data-testid="sis-link"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View in SIS</span>
                    </a>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
                  {!editingNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNotes(true)}
                      className="h-6 text-xs"
                      data-testid="edit-notes-btn"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
                {editingNotes ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="text-sm"
                      data-testid="notes-textarea"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveNotes} className="h-7 text-xs" data-testid="save-notes-btn">
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNotes(student.notes || '');
                          setEditingNotes(false);
                        }}
                        className="h-7 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {student.notes || 'No notes yet'}
                  </p>
                )}
              </div>
            </div>

            {/* Interaction Timeline */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Interaction Timeline</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddEventDialog(true)}
                  className="h-7 text-xs"
                  data-testid="add-event-btn"
                >
                  Add Interaction
                </Button>
              </div>
              {timeline.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No interactions yet</p>
              ) : (
                <div className="space-y-3">
                  {timeline.slice(0, 8).map((event) => (
                    <div key={event.id} className="flex items-start space-x-2" data-testid={`timeline-event-${event.id}`}>
                      <div className="mt-0.5">{getEventIcon(event.event_type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 capitalize">
                          {event.event_type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">{event.content}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audit Log */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Audit Log</h3>
              {aiAuditLog.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No AI activity yet</p>
              ) : (
                <div className="space-y-3">
                  {aiAuditLog.map((log) => (
                    <div key={log.id} className="flex items-start space-x-2">
                      <div className="mt-0.5">{getAuditIcon(log.action, log.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-900">
                            {getAuditLabel(log.action, log.status)}
                          </p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${ 
                              log.status === 'sent' ? 'bg-green-50 text-green-700 border-green-200' :
                              log.status === 'edited' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{log.summary}</p>
                        {log.kb_articles && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {log.kb_articles} KB article{log.kb_articles > 1 ? 's' : ''} referenced
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Timeline Event</DialogTitle>
            <DialogDescription>
              Log a note, phone call, or walk-in interaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Event Type
              </label>
              <Select value={newEventType} onValueChange={setNewEventType}>
                <SelectTrigger data-testid="event-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="phone_call">Phone Call</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Details
              </label>
              <Textarea
                value={newEventContent}
                onChange={(e) => setNewEventContent(e.target.value)}
                rows={4}
                placeholder="Enter event details..."
                className="text-sm"
                data-testid="event-content-textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddEventDialog(false);
                setNewEventContent('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={savingEvent}
              className="bg-gray-900 hover:bg-gray-800 text-white"
              data-testid="save-event-btn"
            >
              {savingEvent ? 'Saving...' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPanel;
