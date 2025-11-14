import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User, Settings } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-[#F3F2F1]" data-testid="workspace-layout">
      {/* Header - Outlook Style */}
      <header className="h-12 bg-[#0078D4] flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-white">
            AidHub Pro
          </h1>
          <span className="text-sm text-white/90">
            {user?.institution_id && 'University of Demo'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-md">
            <User className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              {user?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-white/20"
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
