import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { getNotificationsForUser, markNotificationRead } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const notifications = getNotificationsForUser(user.id);

  const handleClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.pitchId) {
      navigate(`/pitch/${notif.pitchId}`);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-xl font-semibold">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                n.read ? 'bg-background' : 'bg-primary/5'
              } hover:bg-muted/50`}
              onClick={() => handleClick(n)}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? '' : 'font-medium'}`}>{n.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); markNotificationRead(n.id); }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}