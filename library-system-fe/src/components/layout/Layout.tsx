import { useState } from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import LoginModal from '../modals/LoginModal';
import { Toaster } from '../ui/sonner';
import type { User } from '../../types';

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Outlet context={{ user, onLoginRequired: handleLoginRequired }} />
      </main>

      <Footer />

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
        />
      )}

      <Toaster />
    </div>
  );
}
