import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '../ui/sonner';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          <Outlet />
        </div>
      </main>

      <Footer />

      <Toaster />
    </div>
  );
}
