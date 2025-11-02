import { User, LogOut, Library } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  const isHomeActive = location.pathname === '/';

  return (
    <div className="md:hidden pb-4 animate-in slide-in-from-top-2 duration-300">
      <nav className="flex flex-col gap-3 pt-4 border-t border-gray-200">
        {/* Navigation Link */}
        <Link
          to="/"
          onClick={onClose}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
            isHomeActive
              ? 'bg-gray-100 text-gray-900 font-medium'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Library className="w-4 h-4" />
          <span className="text-sm">My Libraries</span>
        </Link>

        {/* User Info */}
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">{user?.username}</span>
          </div>
          <div className="text-xs text-gray-600 space-y-0.5 ml-6">
            {(user?.name || user?.surname) && (
              <p>{user?.name} {user?.surname}</p>
            )}
            {user?.email && (
              <p className="truncate">{user.email}</p>
            )}
            {user?.role && (
              <p className="mt-1">
                <span className="inline-block px-2 py-0.5 bg-gray-200 rounded text-gray-700 font-medium">
                  {user.role}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full justify-start cursor-pointer bg-black text-white hover:bg-gray-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </nav>
    </div>
  );
}
