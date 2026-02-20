'use client';

import type { AdminLayerView } from '@/types/admin.types';
import { RasterStyleForm } from './RasterStyleForm';
import { VectorStyleForm } from './VectorStyleForm';

interface StyleTabProps {
  layer: AdminLayerView;
  overrides: Record<string, unknown>;
  onChange: (overrides: Record<string, unknown>) => void;
}

export function StyleTab({ layer, overrides, onChange }: StyleTabProps) {
  if (layer.type === 'raster') {
    return (
      <RasterStyleForm
        overrides={overrides}
        defaults={layer.defaults.paint}
        onChange={onChange}
      />
    );
  }

  return (
    <VectorStyleForm
      vectorType={layer.vectorStyleType || 'circle'}
      overrides={overrides}
      defaults={layer.defaults.paint}
      onChange={onChange}
    />
  );
}
