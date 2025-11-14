import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { User, Mail, Phone, ExternalLink, Edit2, Save, X, Plus, MessageSquare, PhoneCall, UserCheck, Sparkles, ArrowRight } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ticketDetails?.student) {
      setNotes(ticketDetails.student.notes || '');
      loadTimeline(ticketDetails.student.id);
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

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await studentAPI.update(ticketDetails.student.id, { notes });
      toast.success('Notes saved successfully');
      setEditingNotes(false);
      onStudentUpdate();
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEventContent.trim()) {
      toast.error('Please enter event details');
      return;
    }

    setSaving(true);
    try {
      await aiToolsAPI.addStudentEvent({
        institution_id: user.institution_id,
        student_id: ticketDetails.student.id,
        ticket_id: ticketDetails.ticket.id,
        event_type: newEventType,
        content: newEventContent,
        created_by: user.id,
      });
      toast.success('Event added successfully');
      setShowAddEventDialog(false);
      setNewEventContent('');
      loadTimeline(ticketDetails.student.id);
      onStudentUpdate();
    } catch (error) {
      toast.error('Failed to add event');
    } finally {
      setSaving(false);
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'note':
        return <MessageSquare className="w-4 h-4 text-[#0066CC]" />;
      case 'phone_call':
        return <PhoneCall className="w-4 h-4 text-[#8B5CF6]" />;
      case 'walk_in':
        return <UserCheck className="w-4 h-4 text-[#F59E0B]" />;
      case 'ai_routed':
        return <Sparkles className="w-4 h-4 text-[#10B981]" />;
      case 'sent_email':
      case 'received_email':
        return <Mail className="w-4 h-4 text-[#0066CC]" />;
      default:
        return <ArrowRight className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const getEventBadgeColor = (eventType) => {
    const colors = {
      note: 'bg-[#DBEAFE] text-[#0066CC]',
      phone_call: 'bg-[#DDD6FE] text-[#8B5CF6]',
      walk_in: 'bg-[#FEF3C7] text-[#F59E0B]',
      ai_routed: 'bg-[#D1FAE5] text-[#10B981]',
      sent_email: 'bg-[#E6F2FF] text-[#0066CC]',
      received_email: 'bg-[#F1F5F9] text-[#64748B]',
    };
    return colors[eventType] || 'bg-[#F1F5F9] text-[#64748B]';
  };

  if (!ticketDetails) {
    return (
      <div className="w-96 bg-[#F8FAFC] border-l border-[#E2E8F0] flex items-center justify-center" data-testid="student-panel-empty">
        <p className="text-sm text-[#94A3B8]">No student selected</p>
      </div>
    );
  }

  const { student } = ticketDetails;

  return (
    <div className="w-96 bg-white border-l border-[#E2E8F0] flex flex-col" data-testid="student-panel">
      <ScrollArea className="flex-1">
        {/* Student Profile */}
        <div className="p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E6F2FF] flex items-center justify-center">
              <User className="w-6 h-6 text-[#0066CC]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#003366]">{student.name}</h3>
              <p className="text-sm text-[#64748B]">
                ID: {student.student_id || 'N/A'}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-[#475569]">
              <Mail className="w-4 h-4 text-[#64748B]" />
              <span>{student.email}</span>
            </div>
            {student.phone && (
              <div className="flex items-center space-x-2 text-[#475569]">
                <Phone className="w-4 h-4 text-[#64748B]" />
                <span>{student.phone}</span>
              </div>
            )}
            {student.sis_url && (
              <a
                href={student.sis_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#0066CC] hover:text-[#003366]"
                data-testid="sis-link"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View in SIS</span>
              </a>
            )}
          </div>
        </div>

        {/* Student Notes */}
        <div className="p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#475569]">Notes</h4>
            {!editingNotes ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingNotes(true)}
                className="text-[#0066CC] hover:text-[#003366]"
                data-testid="edit-notes-btn"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="text-[#10B981] hover:text-[#059669]"
                  data-testid="save-notes-btn"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setNotes(student.notes || '');
                    setEditingNotes(false);
                  }}
                  className="text-[#EF4444] hover:text-[#DC2626]"
                  data-testid="cancel-notes-btn"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          {editingNotes ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="text-sm border-[#E2E8F0]"
              placeholder="Add notes about this student..."
              data-testid="notes-textarea"
            />
          ) : (
            <p className="text-sm text-[#64748B] whitespace-pre-wrap">
              {student.notes || 'No notes yet'}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-[#475569]">Timeline</h4>
            <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#0066CC] text-[#0066CC] hover:bg-[#E6F2FF]"
                  data-testid="add-event-btn"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student Event</DialogTitle>
                  <DialogDescription>
                    Log a note, phone call, or walk-in interaction
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#475569] mb-2 block">
                      Event Type
                    </label>
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value)}
                      className="w-full p-2 border border-[#E2E8F0] rounded-md text-sm"
                      data-testid="event-type-select"
                    >
                      <option value="note">Note</option>
                      <option value="phone_call">Phone Call</option>
                      <option value="walk_in">Walk-in</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#475569] mb-2 block">
                      Details
                    </label>
                    <Textarea
                      value={newEventContent}
                      onChange={(e) => setNewEventContent(e.target.value)}
                      rows={4}
                      placeholder="Enter event details..."
                      className="border-[#E2E8F0]"
                      data-testid="event-content-textarea"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddEventDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddEvent}
                    disabled={saving}
                    className="bg-[#0066CC] hover:bg-[#003366] text-white"
                    data-testid="save-event-btn"
                  >
                    Add Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {timeline.length === 0 ? (
            <p className="text-sm text-[#94A3B8] text-center py-4">No events yet</p>
          ) : (
            <div className="space-y-3">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="relative pl-8 pb-3 border-l-2 border-[#E2E8F0] last:border-l-0"
                  data-testid={`timeline-event-${event.id}`}
                >
                  <div className="absolute left-[-9px] top-0 bg-white p-0.5 rounded-full">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={`text-xs ${getEventBadgeColor(event.event_type)}`}>
                        {event.event_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-[#94A3B8]">
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-[#475569]">{event.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StudentPanel;
