import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Phone, Mail, ExternalLink, Edit3, MessageSquare, PhoneCall, UserCheck, Sparkles, ArrowRight, Clock, CheckCircle2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { studentAPI, aiToolsAPI } from '../../lib/api';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const StudentPanel = ({ ticketDetails, onStudentUpdate }) => {
  const { user } = useAuth();
  const [editingNotes, setEditingNotes] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [notes, setNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [newEventType, setNewEventType] = useState('phone_call');
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
      // Filter out 'note' events - they belong in Notes section
      const filteredTimeline = (data.timeline || []).filter(event => event.event_type !== 'note');
      setTimeline(filteredTimeline);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    }
  };

  const loadAiAuditLog = async () => {
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

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter note content');
      return;
    }

    try {
      const timestamp = new Date().toLocaleDateString();
      const formattedNote = `[${timestamp}] ${newNote}`;
      const updatedNotes = notes ? `${notes}\n\n${formattedNote}` : formattedNote;
      
      await studentAPI.update(ticketDetails.student.id, { notes: updatedNotes });
      setNotes(updatedNotes);
      setNewNote('');
      setAddingNote(false);
      toast.success('Note added');
      onStudentUpdate();
    } catch (error) {
      toast.error('Failed to add note');
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
      <div className="w-96 bg-gray-50 flex items-center justify-center" data-testid="student-panel-empty">
        <p className="text-sm text-gray-500">No student selected</p>
      </div>
    );
  }

  const { student } = ticketDetails;

  return (
    <div className="w-96 bg-gray-50 flex flex-col" data-testid="student-panel">
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Student Profile Card */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-gray-900">Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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

            <Separator className="my-3" />

            {/* Notes Section with Add/Edit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
                <div className="flex space-x-1">
                  {!addingNote && !editingNotes && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddingNote(true)}
                        className="h-6 text-xs"
                        data-testid="add-note-btn"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
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
                    </>
                  )}
                </div>
              </div>
              
              {/* Add Note Mode */}
              {addingNote ? (
                <div className="space-y-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    placeholder="Enter new note..."
                    className="text-sm"
                    data-testid="add-note-textarea"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleAddNote} className="h-7 text-xs" data-testid="save-note-btn">
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewNote('');
                        setAddingNote(false);
                      }}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : editingNotes ? (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className="text-sm"
                    data-testid="notes-textarea"
                    autoFocus
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
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {student.notes || 'No notes yet'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interaction Timeline Card (NO notes) */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-900">Interaction Timeline</CardTitle>
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
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Audit Log Card */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-gray-900">Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Add Interaction Dialog (NO note option) */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Interaction</DialogTitle>
            <DialogDescription>
              Log a phone call or walk-in interaction
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
              {savingEvent ? 'Saving...' : 'Add Interaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPanel;
