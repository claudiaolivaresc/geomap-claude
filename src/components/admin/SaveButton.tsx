'use client';

import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  onClick: () => void;
  status: 'idle' | 'saving' | 'saved' | 'error';
  errorMessage?: string;
}

export function SaveButton({ onClick, status, errorMessage }: SaveButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onClick}
        disabled={status === 'saving'}
        className="bg-[#141d2d] hover:bg-[#1e2b42] text-white px-6"
      >
        {status === 'saving' ? 'Saving...' : 'Save Configuration'}
      </Button>

      {status === 'saved' && (
        <span className="text-sm text-green-600 font-medium">Saved successfully!</span>
      )}
      {status === 'error' && (
        <span className="text-sm text-red-600 font-medium">
          {errorMessage || 'Failed to save'}
        </span>
      )}
    </div>
  );
}
