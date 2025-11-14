import React, { useState, useEffect } from 'react';

const CursorTracker = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    // Mock other users for demo (in production this would come from WebSocket)
    const mockUsers = [
      {
        id: '1',
        name: 'Sarah',
        color: '#FB923C', // Orange to match avatar
        x: 0,
        y: 0,
        isVisible: false
      },
      {
        id: '2', 
        name: 'Michael',
        color: '#8B5CF6', // Purple to match avatar
        x: 0,
        y: 0,
        isVisible: false
      }
    ];

    // Simulate random cursor movement for demo users
    const interval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => ({
        ...user,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        isVisible: Math.random() > 0.7 // Randomly show/hide users for demo
      })));
    }, 3000);

    // Set initial mock users
    setActiveUsers(mockUsers);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {activeUsers
        .filter(user => user.isVisible)
        .map(user => (
        <div
          key={user.id}
          className="fixed pointer-events-none z-50 transition-all duration-300"
          style={{
            left: user.x + 10,
            top: user.y - 10,
          }}
        >
          <div
            className="px-2 py-1 rounded text-white text-xs font-medium shadow-lg"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
        </div>
      ))}
    </>
  );
};

export default CursorTracker;