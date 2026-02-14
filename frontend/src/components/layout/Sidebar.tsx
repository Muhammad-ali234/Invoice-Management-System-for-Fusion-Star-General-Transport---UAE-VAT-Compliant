import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar navigation component
 * Shows navigation menu with bilingual labels
 */
export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/quotes', label: 'Quotes', icon: '📋' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
    { path: '/customers', label: 'Clients', icon: '👥' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/trucks', label: 'Trucks', icon: '🚛' },
    { path: '/drivers', label: 'Drivers', icon: '👨‍✈️' },
    { path: '/payments', label: 'Payments', icon: '💰' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r-2 border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b-2 border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">🚚</span>
          <h1 className="text-xl font-bold text-gray-900">Movers Invoice Pro</h1>
        </div>
        <p className="text-xs text-gray-600 ml-11">Professional Billing System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 mb-2 rounded-md transition-colors ${isActive(item.path)
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
  );
}
