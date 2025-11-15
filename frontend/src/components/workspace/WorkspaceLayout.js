import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const WorkspaceLayout = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New ticket assigned',
      description: 'Taylor Kim - Payment plan questions',
      time: '5 minutes ago',
    },
    {
      id: '2',
      title: 'Student replied',
      description: 'Sam Martinez responded to verification request',
      time: '2 hours ago',
    },
    {
      id: '3',
      title: 'Ticket updated',
      description: 'Jordan Lee - SAP appeal status changed to open',
      time: '1 day ago',
    },
  ]);

  const isActive = (path) => location.pathname === path;
  
  const handleClearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
    toast.success('All notifications cleared');
  };

  const navItems = [
    { path: '/workspace', label: 'Tickets' },
    { path: '/reports', label: 'Reports' },
    { path: '/knowledge-base', label: 'Knowledge Base' },
  ];

  return (
    <div className="h-screen flex flex-col bg-white" data-testid="workspace-layout">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center space-x-8">
          <img src="/peach_logo.svg" alt="Peach" className="h-8" />
          <nav className="flex items-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-4 text-sm font-medium transition-colors relative ${
                  isActive(item.path)
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Collaborative User Avatars - Figma Style */}
          <div className="flex items-center space-x-1" data-testid="collaborative-avatars">
            {/* Sarah Chen */}
            <div className="relative group">
              <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-semibold cursor-pointer transition-transform hover:scale-105 shadow-sm hover:z-10 relative">
                S
              </div>
              {/* Tooltip - Below this specific avatar */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg" style={{ zIndex: 9999 }}>
                Sarah Chen
              </div>
            </div>
            
            {/* Michael Rodriguez */}
            <div className="relative group">
              <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer transition-transform hover:scale-105 shadow-sm hover:z-10 relative">
                M
              </div>
              {/* Tooltip - Below this specific avatar */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg" style={{ zIndex: 9999 }}>
                Michael Rodriguez
              </div>
            </div>
            
            {/* Dr. Emily Thompson */}
            <div className="relative group">
              <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer transition-transform hover:scale-105 shadow-sm hover:z-10 relative">
                E
              </div>
              {/* Tooltip - Below this specific avatar */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg" style={{ zIndex: 9999 }}>
                Dr. Emily Thompson
              </div>
            </div>
            
            {/* Current User (Puneet Thiara) */}
            <div className="relative group">
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer transition-transform hover:scale-105 shadow-sm ring-1 ring-white hover:z-10 relative">
                P
              </div>
              {/* Tooltip - Below this specific avatar */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg" style={{ zIndex: 9999 }}>
                Puneet Thiara (You)
              </div>
            </div>
          </div>

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
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex-col items-start p-3 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
              {notifications.length > 0 && (
                <div className="p-2 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs text-gray-600 hover:text-gray-900"
                    onClick={handleClearNotifications}
                    data-testid="clear-notifications-btn"
                  >
                    Clear all
                  </Button>
                </div>
              )}
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
            <span className="text-sm font-medium text-gray-700">
              Puneet Thiara
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
