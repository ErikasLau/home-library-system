import { useState } from 'react';
import { Menu, X, Library, User, LogOut, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import type { User as UserType } from '../App';

interface HeaderProps {
  user: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
  onLogoClick: () => void;
}

export default function Header({ user, onLogin, onLogout, onLogoClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-lg border-b-4 border-primary-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 transition-transform hover:scale-105 duration-300"
          >
            <div className="bg-primary-foreground text-primary p-2 rounded-xl shadow-md">
              <Library className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <span className="font-['Merriweather',serif] tracking-tight">
              My Home Library
            </span>
          </button>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0 transition-all duration-300 hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={onLogin}
                variant="outline"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0 transition-all duration-300 hover:shadow-lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-2 pt-2 border-t border-primary-foreground/10">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-3 bg-primary-foreground/10 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  onLogin();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
