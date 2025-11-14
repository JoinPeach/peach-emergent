import React from 'react';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp, Users, Clock, User, Mail, FileText, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const ReportsPage = () => {
  const { user } = useAuth();
  
  // Mock team member activity data
  const teamActivity = [
    {
      id: '1',
      member: 'Sarah Chen',
      action: 'Replied to ticket',
      ticket: 'Verification documents - what do I need?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: '2',
      member: 'Michael Rodriguez',
      action: 'Closed ticket',
      ticket: 'Payment plan questions',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: '3',
      member: 'Sarah Chen',
      action: 'Updated ticket status',
      ticket: 'SAP appeal submission',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: '4',
      member: 'Dr. Emily Thompson',
      action: 'Assigned ticket',
      ticket: 'Question about FAFSA priority deadline',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: '5',
      member: 'Michael Rodriguez',
      action: 'Added note',
      ticket: 'Transfer credit evaluation',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
  ];
  
  return (
    <WorkspaceLayout user={user}>
      <div className="h-full bg-gray-50 overflow-auto" data-testid="reports-page">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports</h1>

        {/* Key Metrics - Updated Style */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">25</p>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-xs text-green-600">↑ 12% from last week</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-xs text-green-600">↓ 18% improvement</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">02</p>
                <p className="text-sm font-medium text-gray-600">AI Drafts Generated</p>
                <p className="text-xs text-gray-500">8 sent as-is</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">4.8</p>
                <p className="text-sm font-medium text-gray-600">Student Satisfaction</p>
                <p className="text-xs text-green-600">↑ 0.2 from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
                Ticket Volume by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p className="text-sm">Chart visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
                Response Time Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p className="text-sm">Chart visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Member Activity Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Member Activity</CardTitle>
            <CardDescription>Latest actions by financial aid staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Member</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ticket</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                            {activity.member.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{activity.member}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{activity.action}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{activity.ticket}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </WorkspaceLayout>
  );
};

export default ReportsPage;
