import React, { useState } from 'react';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp, Users, Clock, User, Mail, FileText, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { formatDistanceToNow } from 'date-fns';

const ReportsPage = () => {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState('30');
  
  // Mock data that changes based on time period
  const getDataForPeriod = (period) => {
    const baseData = {
      '7': {
        totalTickets: 8,
        avgResponseTime: 1.2,
        aiDrafts: 6,
        satisfaction: 4.9,
        ticketsByCategory: {
          'FAFSA': 3,
          'Verification': 2,
          'SAP Appeals': 1,
          'Billing': 1,
          'General': 1,
        },
        responseTrend: [
          { day: 'Day 1', time: 2.1 },
          { day: 'Day 2', time: 1.8 },
          { day: 'Day 3', time: 1.5 },
          { day: 'Day 4', time: 1.2 },
          { day: 'Day 5', time: 0.9 },
          { day: 'Day 6', time: 1.1 },
          { day: 'Day 7', time: 1.2 },
        ]
      },
      '30': {
        totalTickets: 25,
        avgResponseTime: 2.1,
        aiDrafts: 18,
        satisfaction: 4.8,
        ticketsByCategory: {
          'FAFSA': 8,
          'Verification': 6,
          'SAP Appeals': 4,
          'Billing': 4,
          'General': 3,
        },
        responseTrend: [
          { day: 'Week 1', time: 2.8 },
          { day: 'Week 2', time: 2.4 },
          { day: 'Week 3', time: 2.0 },
          { day: 'Week 4', time: 1.8 },
        ]
      },
      '60': {
        totalTickets: 52,
        avgResponseTime: 2.8,
        aiDrafts: 35,
        satisfaction: 4.6,
        ticketsByCategory: {
          'FAFSA': 18,
          'Verification': 12,
          'SAP Appeals': 8,
          'Billing': 9,
          'General': 5,
        },
        responseTrend: [
          { day: 'Month 1', time: 3.2 },
          { day: 'Month 2', time: 2.4 },
        ]
      },
      '90': {
        totalTickets: 89,
        avgResponseTime: 3.2,
        aiDrafts: 62,
        satisfaction: 4.5,
        ticketsByCategory: {
          'FAFSA': 28,
          'Verification': 20,
          'SAP Appeals': 15,
          'Billing': 16,
          'General': 10,
        },
        responseTrend: [
          { day: 'Month 1', time: 3.8 },
          { day: 'Month 2', time: 3.2 },
          { day: 'Month 3', time: 2.6 },
        ]
      },
    };
    return baseData[period];
  };
  
  const currentData = getDataForPeriod(timePeriod);
  
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

        {/* Team Member Activity - Stacked Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Team Member Activity</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-sm bg-orange-200"></div>
                  <span className="text-sm text-gray-700">Edited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                  <span className="text-sm text-gray-700">Approved without edits</span>
                </div>
              </div>
            </div>
            <CardDescription>AI draft activity by financial aid staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-4 h-64 relative">
              {/* Y-axis */}
              <div className="flex flex-col justify-between h-full text-xs text-gray-500 pr-4">
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>
              
              {/* Bars */}
              <div className="flex-1 flex items-end justify-between h-full pb-8">
                {/* Sarah Chen */}
                <div className="flex flex-col items-center">
                  <div className="w-16 flex flex-col justify-end h-full">
                    <div className="bg-green-200 w-full" style={{ height: '80px' }}></div>
                    <div className="bg-orange-200 w-full" style={{ height: '40px' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">Sarah Chen</span>
                </div>
                
                {/* Michael Rodriguez */}
                <div className="flex flex-col items-center">
                  <div className="w-16 flex flex-col justify-end h-full">
                    <div className="bg-green-200 w-full" style={{ height: '120px' }}></div>
                    <div className="bg-orange-200 w-full" style={{ height: '30px' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">Michael Rodriguez</span>
                </div>
                
                {/* Dr. Emily Thompson */}
                <div className="flex flex-col items-center">
                  <div className="w-16 flex flex-col justify-end h-full">
                    <div className="bg-green-200 w-full" style={{ height: '60px' }}></div>
                    <div className="bg-orange-200 w-full" style={{ height: '20px' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">Dr. Emily Thompson</span>
                </div>
                
                {/* Lisa Park */}
                <div className="flex flex-col items-center">
                  <div className="w-16 flex flex-col justify-end h-full">
                    <div className="bg-green-200 w-full" style={{ height: '90px' }}></div>
                    <div className="bg-orange-200 w-full" style={{ height: '35px' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">Lisa Park</span>
                </div>
                
                {/* James Wilson */}
                <div className="flex flex-col items-center">
                  <div className="w-16 flex flex-col justify-end h-full">
                    <div className="bg-green-200 w-full" style={{ height: '110px' }}></div>
                    <div className="bg-orange-200 w-full" style={{ height: '45px' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">James Wilson</span>
                </div>
                
                {/* Maria Garcia */}
                <div className="flex flex-col items-center">
                  <div className="w-16 flex flex-col justify-end h-full">
                    <div className="bg-green-200 w-full" style={{ height: '70px' }}></div>
                    <div className="bg-orange-200 w-full" style={{ height: '25px' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">Maria Garcia</span>
                </div>
                
                {/* David Brown */}
                <div className="flex flex-col items-center">
                  <div className="w-16 flex flex-col justify-end h-full">
                    <div className="bg-green-200 w-full" style={{ height: '100px' }}></div>
                    <div className="bg-orange-200 w-full" style={{ height: '50px' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">David Brown</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </WorkspaceLayout>
  );
};

export default ReportsPage;
