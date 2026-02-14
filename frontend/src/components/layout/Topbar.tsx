import { ReactNode } from 'react';
import { Button } from '@/components/common/Button';

interface TopbarProps {
  title: string;
  actions?: ReactNode;
  userEmail: string;
  onLogout: () => void;
}

/**
 * Topbar component
 * Shows page title, actions, and user info
 */
export function Topbar({ title, actions, userEmail, onLogout }: TopbarProps) {
  return (
    <header className="bg-gray-50 border-b-2 border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title and Actions */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Right: User Info and Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{userEmail}</span>
          <Button variant="secondary" size="sm" onClick={onLogout}>
            Logout / Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
