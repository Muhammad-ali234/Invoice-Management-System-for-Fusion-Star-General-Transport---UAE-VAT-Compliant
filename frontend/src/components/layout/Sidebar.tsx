import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar navigation component
 * Shows navigation menu with bilingual labels
 * Mobile-responsive with slide-in animation
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
    { path: '/customers', label: 'Clients', icon: '👥' },
    { path: '/trucks', label: 'Trucks', icon: '🚛' },
    { path: '/drivers', label: 'Drivers', icon: '👨‍✈️' },
    { path: '/contracts', label: 'Contracts', icon: '📝' },
    { path: '/billing', label: 'Billing', icon: '🔄' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/payments', label: 'Payments', icon: '💵' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible on large screens */}
      <aside className="hidden lg:flex w-64 bg-white border-r-2 border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">🚚</span>
            <h1 className="text-xl font-bold text-gray-900">Movers Invoice Pro</h1>
          </div>
          <p className="text-xs text-gray-600 ml-11">Professional Billing System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar - Slide in from left */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo with Close Button */}
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚚</span>
              <h1 className="text-xl font-bold text-gray-900">Movers Invoice Pro</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-xs text-gray-600 ml-11">Professional Billing System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center px-4 py-3 mb-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
