'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface InfoTabProps {
  metadata: { title?: string; description?: string; citation?: string };
  defaults: { description: string; citation?: string };
  defaultTitle: string;
  onChange: (metadata: { title?: string; description?: string; citation?: string }) => void;
}

export function InfoTab({ metadata, defaults, defaultTitle, onChange }: InfoTabProps) {
  const setField = (key: 'title' | 'description' | 'citation', value: string) => {
    onChange({ ...metadata, [key]: value || undefined });
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Display Title</Label>
        <Input
          value={metadata.title || ''}
          onChange={(e) => setField('title', e.target.value)}
          placeholder={defaultTitle}
        />
        <p className="text-xs text-gray-400 mt-1">Leave empty to use default: &quot;{defaultTitle}&quot;</p>
      </div>

      {/* Description */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Description</Label>
        <Textarea
          value={metadata.description || ''}
          onChange={(e) => setField('description', e.target.value)}
          placeholder={defaults.description}
          rows={4}
        />
        <p className="text-xs text-gray-400 mt-1">Leave empty to use default.</p>
      </div>

      {/* Citation */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Citation / Source</Label>
        <Input
          value={metadata.citation || ''}
          onChange={(e) => setField('citation', e.target.value)}
          placeholder={defaults.citation || 'No citation'}
        />
        <p className="text-xs text-gray-400 mt-1">Leave empty to use default.</p>
      </div>
    </div>
  );
}
