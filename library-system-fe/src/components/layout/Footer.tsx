import { BookOpen } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">About</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed text-center md:text-left">
              Organize and manage your personal book collection with ease. Add reviews, and discover new books through our community.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-300">
            <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap">
              <span>© {currentYear} Home Library System</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
