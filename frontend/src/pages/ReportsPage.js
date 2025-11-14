import React from 'react';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

const ReportsPage = () => {
  const { user } = useAuth();
  
  return (
    <WorkspaceLayout user={user}>
      <div className="h-full bg-gray-50 overflow-auto" data-testid="reports-page">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">4</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Response Time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">2.5h</p>
              <p className="text-xs text-green-600 mt-1">↓ 18% improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>AI Drafts Generated</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500 mt-1">8 sent as-is</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Student Satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">4.8</p>
              <p className="text-xs text-green-600 mt-1">↑ 0.2 from last month</p>
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

        {/* Tables */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest tickets and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Detailed reports coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  );
};

export default ReportsPage;
