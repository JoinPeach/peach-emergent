import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User, Bell, Settings } from 'lucide-react';
import { toast } from 'sonner';

const WorkspaceLayout = ({ user, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white" data-testid="workspace-layout">
      {/* Header - Stripe Style */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-gray-900">
            AidHub Pro
          </h1>
          <nav className="flex items-center space-x-1">
            <button className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
              Tickets
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              Reports
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              Knowledge Base
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bell className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <div className="h-8 w-px bg-gray-200" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default WorkspaceLayout;
