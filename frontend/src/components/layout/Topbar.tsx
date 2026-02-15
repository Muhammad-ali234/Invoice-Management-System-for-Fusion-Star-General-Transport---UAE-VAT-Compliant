import { ReactNode } from 'react';
import { Button } from '@/components/common/Button';
import { Menu } from 'lucide-react';

interface TopbarProps {
  title: string;
  actions?: ReactNode;
  userEmail: string;
  onLogout: () => void;
  onMenuClick: () => void;
}

/**
 * Topbar component
 * Shows page title, actions, and user info
 * Includes hamburger menu for mobile
 */
export function Topbar({ title, actions, userEmail, onLogout, onMenuClick }: TopbarProps) {
  return (
    <header className="bg-gray-50 border-b-2 border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Menu Button (Mobile) + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-200 rounded-md transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">{title}</h1>
            {actions && <div className="hidden md:flex gap-2">{actions}</div>}
          </div>
        </div>

        {/* Right: User Info and Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline text-sm text-gray-600">{userEmail}</span>
          <Button variant="secondary" size="sm" onClick={onLogout} className="text-xs md:text-sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Actions Row for Mobile */}
      {actions && (
        <div className="md:hidden mt-3 flex gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
