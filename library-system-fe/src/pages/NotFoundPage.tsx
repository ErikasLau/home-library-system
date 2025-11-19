import { useNavigate } from 'react-router';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect } from 'react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Page Not Found - Home Library System';
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-gray-100 rounded-full p-8 animate-in zoom-in-95 duration-500">
          <FileQuestion className="w-24 h-24 text-gray-400" />
        </div>
        
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 font-medium active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:shadow-lg font-semibold active:scale-95"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
