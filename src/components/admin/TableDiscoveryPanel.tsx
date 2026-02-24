'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Database, Loader2, Table2 } from 'lucide-react';
import type { PostGISTable } from '@/types/admin.types';

interface TableDiscoveryPanelProps {
  onRegister: (table: PostGISTable, layerId: string) => void;
}

function generateLayerId(table: PostGISTable): string {
  // Use just the table name as the layer ID (matches existing convention)
  return table.table_name;
}

function humanizeTableName(name: string): string {
  return name
    .replace(/^gl_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function geometryBadge(table: PostGISTable) {
  if (table.has_raster && !table.geometry_type) {
    return <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">raster</span>;
  }
  if (table.geometry_type) {
    const colors: Record<string, string> = {
      circle: 'bg-blue-100 text-blue-700',
      line: 'bg-orange-100 text-orange-700',
      fill: 'bg-green-100 text-green-700',
    };
    const style = table.suggested_style_type ? colors[table.suggested_style_type] || 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700';
    return <span className={`text-xs px-1.5 py-0.5 rounded ${style}`}>{table.geometry_type}</span>;
  }
  return null;
}

export function TableDiscoveryPanel({ onRegister }: TableDiscoveryPanelProps) {
  const [tables, setTables] = useState<PostGISTable[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/discover');
      if (res.ok) {
        const data = await res.json();
        setTables(data.tables || []);
      } else {
        setError('Failed to discover tables');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleRegister = async (table: PostGISTable) => {
    const layerId = generateLayerId(table);
    setRegistering(table.full_name);

    try {
      const isRaster = table.has_raster && !table.geometry_type;
      const res = await fetch(`/api/admin/layers/${layerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_dynamic: true,
          layer_type: isRaster ? 'raster' : 'vector',
          schema_name: table.schema_name,
          table_name: table.table_name,
          vector_style_type: table.suggested_style_type || (isRaster ? null : 'circle'),
          title: humanizeTableName(table.table_name),
          published: false, // Start as draft
          default_opacity: 1,
          style_overrides: {},
          metadata_overrides: {},
          visible_fields: [],
        }),
      });

      if (res.ok) {
        onRegister(table, layerId);
        // Mark as registered locally
        setTables((prev) =>
          prev.map((t) =>
            t.full_name === table.full_name ? { ...t, already_registered: true } : t
          )
        );
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error during registration');
    } finally {
      setRegistering(null);
    }
  };

  const filtered = tables.filter((t) =>
    t.full_name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by schema
  const grouped = filtered.reduce<Record<string, PostGISTable[]>>((acc, t) => {
    if (!acc[t.schema_name]) acc[t.schema_name] = [];
    acc[t.schema_name].push(t);
    return acc;
  }, {});

  const unregisteredCount = tables.filter((t) => !t.already_registered).length;

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-5 w-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">PostGIS Table Discovery</h2>
          <span className="text-xs text-gray-500 ml-auto">
            {tables.length} tables found, {unregisteredCount} available
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Discovering PostGIS tables...
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && (
        <div className="max-h-[500px] overflow-y-auto">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([schema, schemaTables]) => (
            <div key={schema}>
              <div className="px-4 py-2 bg-gray-50 border-b border-t text-xs font-semibold text-gray-500 uppercase tracking-wide sticky top-0">
                {schema}
              </div>
              {schemaTables.map((table) => (
                <div
                  key={table.full_name}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b hover:bg-gray-50 ${
                    table.already_registered ? 'opacity-50' : ''
                  }`}
                >
                  <Table2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {table.table_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {geometryBadge(table)}
                    {table.already_registered ? (
                      <span className="text-xs text-gray-400 px-2">Added</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={registering === table.full_name}
                        onClick={() => handleRegister(table)}
                      >
                        {registering === table.full_name ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Plus className="h-3 w-3 mr-1" />
                        )}
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-400 text-sm">
              {search ? 'No tables match your search' : 'No PostGIS tables found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
