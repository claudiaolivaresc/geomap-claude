'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { AdminLayerView, ColumnInfo } from '@/types/admin.types';

interface FieldsTabProps {
  layer: AdminLayerView;
  selectedFields: string[];
  onChange: (fields: string[]) => void;
}

export function FieldsTab({ layer, selectedFields, onChange }: FieldsTabProps) {
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (layer.type !== 'vector' || !layer.schema || !layer.table) return;

    setLoading(true);
    setError('');

    fetch(`/api/admin/fields/${layer.schema}.${layer.table}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setColumns(data.columns || []);
        }
      })
      .catch(() => setError('Failed to load columns'))
      .finally(() => setLoading(false));
  }, [layer.id, layer.type, layer.schema, layer.table]);

  if (layer.type === 'raster') {
    return (
      <div className="text-sm text-gray-500 italic">
        Field selection is only available for vector layers.
      </div>
    );
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading columns...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (columns.length === 0) {
    return <div className="text-sm text-gray-500">No columns found for this layer.</div>;
  }

  const toggleField = (col: string) => {
    if (selectedFields.includes(col)) {
      onChange(selectedFields.filter((f) => f !== col));
    } else {
      onChange([...selectedFields, col]);
    }
  };

  const selectAll = () => onChange(columns.map((c) => c.column_name));
  const selectNone = () => onChange([]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Select which fields to show in the popup when a user clicks on a feature.
        If none are selected, all fields will be shown.
      </p>

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-[#ffa925] hover:underline"
        >
          Select all
        </button>
        <span className="text-xs text-gray-300">|</span>
        <button
          type="button"
          onClick={selectNone}
          className="text-xs text-gray-500 hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {columns.map((col) => (
          <label
            key={col.column_name}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
          >
            <Checkbox
              checked={selectedFields.includes(col.column_name)}
              onCheckedChange={() => toggleField(col.column_name)}
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">{col.column_name}</Label>
              <span className="text-xs text-gray-400 ml-2">{col.data_type}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
