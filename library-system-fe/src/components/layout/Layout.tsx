import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '../ui/sonner';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Outlet />
      </main>

      <Footer />

      <Toaster />
    </div>
  );
}
