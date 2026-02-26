'use client';

import type { AdminLayerView } from '@/types/admin.types';
import type { LayerLegend, LegendSymbol, RasterClassification } from '@/types';
import { RasterStyleForm } from './RasterStyleForm';
import { VectorStyleForm } from './VectorStyleForm';
import { LegendConfigForm } from './LegendConfigForm';

interface StyleTabProps {
  layer: AdminLayerView;
  overrides: Record<string, unknown>;
  onChange: (overrides: Record<string, unknown>) => void;
  legend: LayerLegend;
  onLegendChange: (legend: LayerLegend) => void;
}

/** Small read-only preview of the vector legend */
function LegendPreview({ legend, vectorType }: { legend: LayerLegend; vectorType?: string }) {
  if (legend.type === 'gradient') {
    return (
      <div>
        <div className="h-3 rounded" style={{ background: legend.gradient }} />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{Math.round(legend.min * 100) / 100}</span>
          <span className="text-xs text-gray-500">
            {Math.round(legend.max * 100) / 100} {legend.unit}
          </span>
        </div>
      </div>
    );
  }

  const sym = legend as LegendSymbol;
  return (
    <div className="space-y-1.5">
      {sym.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {vectorType === 'line' ? (
            <div className="w-5 h-[3px] rounded-full" style={{ backgroundColor: item.color }} />
          ) : vectorType === 'fill' ? (
            <div className="w-3.5 h-3.5 rounded-sm border border-gray-300" style={{ backgroundColor: item.color }} />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
          )}
          <span className="text-xs text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function StyleTab({ layer, overrides, onChange, legend, onLegendChange }: StyleTabProps) {
  const isVector = layer.type !== 'raster';
  const vType = layer.vectorStyleType || 'circle';

  return (
    <div className="space-y-6">
      {/* Style controls */}
      {isVector ? (
        <VectorStyleForm
          vectorType={vType}
          overrides={overrides}
          defaults={layer.defaults.paint}
          onChange={onChange}
          schema={layer.schema}
          table={layer.table}
          legend={legend}
          onLegendChange={onLegendChange}
        />
      ) : (
        <RasterStyleForm
          overrides={overrides}
          defaults={layer.defaults.paint}
          onChange={onChange}
          legend={legend}
          onLegendChange={onLegendChange}
        />
      )}

      {/* Legend */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend Preview</h4>
        {isVector ? (
          <LegendPreview legend={legend} vectorType={vType} />
        ) : (overrides['raster_classification'] as RasterClassification)?.entries?.length ? (
          <LegendPreview legend={legend} />
        ) : (
          <LegendConfigForm legend={legend} onChange={onLegendChange} />
        )}
      </div>
    </div>
  );
}
