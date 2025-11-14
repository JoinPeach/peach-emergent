import React, { useState, useEffect } from 'react';

const CursorTracker = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    // Mock other users for demo (in production this would come from WebSocket)
    const mockUsers = [
      {
        id: '1',
        name: 'Sarah',
        color: '#FB923C', // Orange to match avatar
        x: 500,
        y: 300,
        isVisible: true
      },
      {
        id: '2', 
        name: 'Michael',
        color: '#8B5CF6', // Purple to match avatar
        x: 800,
        y: 200,
        isVisible: false // Start hidden
      }
    ];

    // Simulate random cursor movement for demo users
    const interval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => {
        const newX = Math.max(50, Math.min(window.innerWidth - 150, user.x + (Math.random() - 0.5) * 200));
        const newY = Math.max(50, Math.min(window.innerHeight - 100, user.y + (Math.random() - 0.5) * 200));
        
        return {
          ...user,
          x: newX,
          y: newY,
          isVisible: Math.random() > 0.3 // Keep users visible more often
        };
      }));
    }, 4000);

    // Set initial mock users
    setActiveUsers(mockUsers);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {activeUsers
        .filter(user => user.isVisible)
        .map(user => {
          // Ensure name stays within screen bounds
          const nameX = Math.max(0, Math.min(window.innerWidth - 100, user.x + 15));
          const nameY = Math.max(30, user.y - 10);
          
          return (
            <div key={user.id}>
              {/* Colored Cursor Arrow */}
              <div
                className="fixed pointer-events-none z-50 transition-all duration-1000"
                style={{
                  left: user.x,
                  top: user.y,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M2 2L18 10L10 12L8 18L2 2Z"
                    fill={user.color}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              
              {/* Name Label - Better positioning */}
              <div
                className="fixed pointer-events-none z-40 transition-all duration-1000"
                style={{
                  left: Math.max(10, Math.min(window.innerWidth - 120, user.x + 25)),
                  top: Math.max(10, user.y - 15),
                }}
              >
                <div
                  className="px-3 py-1.5 rounded-md text-white text-sm font-medium shadow-lg whitespace-nowrap"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default CursorTracker;