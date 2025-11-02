import { Link, useLocation } from 'react-router';
import { Library } from 'lucide-react';

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const links: NavLink[] = [
  { to: '/', label: 'My Libraries', icon: <Library className="w-4 h-4" /> },
];

export default function NavLinks() {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gray-100 text-gray-900 font-medium cursor-pointer'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
            }`}
          >
            {link.icon}
            <span className="text-sm">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
