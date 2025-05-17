import React from 'react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No complaints yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first complaint
        </p>
        <div className="mt-6">
          <Button 
            onClick={onCreateNew}
            className="bg-[#020240] hover:bg-[#020240]/90"
          >
            Submit Your First Complaint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
