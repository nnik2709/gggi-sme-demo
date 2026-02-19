import { useOffline } from '../../context/OfflineContext';

export default function OfflineIndicator() {
  const { isOffline } = useOffline();

  return (
    <div className={isOffline ? 'offline-badge' : 'online-badge'}>
      <span className="status-dot" />
      <span>{isOffline ? 'Working Offline' : 'Online'}</span>
    </div>
  );
}
