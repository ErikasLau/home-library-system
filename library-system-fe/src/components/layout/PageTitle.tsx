import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-base text-gray-600">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
