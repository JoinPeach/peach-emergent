import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

const WorkspaceLayout = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/workspace', label: 'Tickets' },
    { path: '/reports', label: 'Reports' },
    { path: '/knowledge-base', label: 'Knowledge Base' },
  ];

  return (
    <div className="h-screen flex flex-col bg-white" data-testid="workspace-layout">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-gray-900">
            AidHub Pro
          </h1>
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
                data-testid="notifications-btn"
              >
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">New ticket assigned</p>
                  <p className="text-xs text-gray-500 mt-1">Taylor Kim - Payment plan questions</p>
                  <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Student replied</p>
                  <p className="text-xs text-gray-500 mt-1">Sam Martinez responded to verification request</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Ticket updated</p>
                  <p className="text-xs text-gray-500 mt-1">Jordan Lee - SAP appeal status changed to open</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </DropdownMenuItem>
              </div>
              <div className="p-2 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full text-xs text-gray-600 hover:text-gray-900">
                  Clear all
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            data-testid="settings-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>

          <div className="h-8 w-px bg-gray-200" />

          {/* User Info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
          </div>
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
