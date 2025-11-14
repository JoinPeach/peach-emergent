import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-[#F8FAFC]" data-testid="workspace-layout">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-[#003366]">
            AidHub Pro
          </h1>
          <span className="text-sm text-[#64748B]">
            {user?.institution_id && 'University of Demo'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#F1F5F9] rounded-md">
            <User className="w-4 h-4 text-[#64748B]" />
            <span className="text-sm font-medium text-[#475569]">
              {user?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#64748B] hover:text-[#003366] hover:bg-[#F1F5F9]"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
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
