import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserInfo from './UserInfo';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Logo />

          {/* Center Navigation */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <NavLinks />
          </div>

          {/* Desktop User Info */}
          <div className="hidden md:flex items-center">
            <UserInfo />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </div>
    </header>
  );
}
