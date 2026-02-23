'use client';

import { Eye, EyeOff } from 'lucide-react';

interface PublishToggleProps {
  published: boolean;
  onChange: (published: boolean) => void;
}

export function PublishToggle({ published, onChange }: PublishToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!published)}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        published
          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {published ? (
        <>
          <Eye className="h-3 w-3" />
          Published
        </>
      ) : (
        <>
          <EyeOff className="h-3 w-3" />
          Draft
        </>
      )}
    </button>
  );
}
