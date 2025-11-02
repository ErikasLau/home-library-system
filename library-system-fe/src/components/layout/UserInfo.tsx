import { User, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';

export default function UserInfo() {
  const { user, logout } = useAuth();

  return (
    <div className="group relative">
      {/* User Trigger */}
      <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer">
        <User className="w-4 h-4 text-gray-700" />
        <span className="text-sm font-medium text-gray-900">{user?.username}</span>
      </button>

      {/* Hover Dropdown - Fixed positioning issue */}
      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 before:content-[''] before:absolute before:inset-x-0 before:-top-2 before:h-2">
        <div className="p-4 space-y-3">
          <div className="pb-3 border-b border-gray-200 space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Account Details</p>
            {(user?.name || user?.surname) && (
              <p className="text-base font-semibold text-gray-900">
                {user?.name} {user?.surname}
              </p>
            )}
            {user?.email && (
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
            )}
            {user?.role && (
              <p className="text-xs text-gray-600 mt-2">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                  {user.role}
                </span>
              </p>
            )}
          </div>
          <Button
            onClick={logout}
            variant="destructive"
            size="sm"
            className="w-full justify-start cursor-pointer bg-black text-white hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
