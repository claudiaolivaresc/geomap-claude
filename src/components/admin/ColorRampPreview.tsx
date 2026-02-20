'use client';

import { GRADIENTS } from '@/config/layers.config';
import { cn } from '@/lib/utils';

interface ColorRampPreviewProps {
  rampKey: string;
  selected?: boolean;
  onClick?: () => void;
}

export function ColorRampPreview({ rampKey, selected, onClick }: ColorRampPreviewProps) {
  const gradient = GRADIENTS[rampKey];
  if (!gradient) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-md border-2 p-1 transition-colors cursor-pointer',
        selected ? 'border-[#ffa925] ring-2 ring-[#ffa925]/30' : 'border-gray-200 hover:border-gray-400'
      )}
    >
      <div className="h-6 rounded" style={{ background: gradient }} />
      <span className="text-xs text-gray-600 mt-1 block capitalize">{rampKey}</span>
    </button>
  );
}
