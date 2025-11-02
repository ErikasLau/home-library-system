import { Link } from 'react-router';
import { Library } from 'lucide-react';

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 transition-colors duration-300"
    >
      <div className="bg-white text-gray-800 p-1.5 rounded-lg shadow-sm border-2 border-gray-100">
        <Library className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <span className="text-base md:text-lg font-bold text-gray-900 tracking-tight">
        My Home Library
      </span>
    </Link>
  );
}
