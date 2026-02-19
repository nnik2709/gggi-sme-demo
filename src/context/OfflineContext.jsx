import { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(true); // Default to offline for demo
  const [lastSyncTime, setLastSyncTime] = useState(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago

  useEffect(() => {
    // Load offline status from localStorage
    const savedStatus = localStorage.getItem('isOffline');
    if (savedStatus !== null) {
      setIsOffline(savedStatus === 'true');
    }

    const savedSyncTime = localStorage.getItem('lastSyncTime');
    if (savedSyncTime) {
      setLastSyncTime(new Date(savedSyncTime));
    }
  }, []);

  const toggleOffline = () => {
    const newStatus = !isOffline;
    setIsOffline(newStatus);
    localStorage.setItem('isOffline', newStatus.toString());

    // If going online, update sync time
    if (!newStatus) {
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
    }
  };

  const getLastSyncText = () => {
    if (!lastSyncTime) return 'Never synced';

    const now = new Date();
    const diffMs = now - lastSyncTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const value = {
    isOffline,
    toggleOffline,
    lastSyncTime,
    getLastSyncText
  };

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};
