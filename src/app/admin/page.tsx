'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { LayerSelector } from '@/components/admin/LayerSelector';
import { AdminTabs } from '@/components/admin/AdminTabs';
import type { AdminLayerView } from '@/types/admin.types';

function AdminContent() {
  const [layers, setLayers] = useState<AdminLayerView[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/layers')
      .then((res) => res.json())
      .then((data) => {
        if (data.layers) {
          setLayers(data.layers);
        } else {
          setError('Failed to load layers');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  const selectedLayer = layers.find((l) => l.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#141d2d] text-white shadow">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/pi-logo.png" alt="PI" className="h-8 w-auto" />
            <div>
              <h1 className="text-lg font-semibold">Layer Configuration</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm text-[#ffa925] hover:text-[#ffb94d] transition-colors"
          >
            Back to Map
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-12 text-gray-500">Loading layers...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Layer selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a layer to configure
              </label>
              <LayerSelector
                layers={layers}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>

            {/* Configuration form */}
            {selectedLayer ? (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <AdminTabs key={selectedLayer.id} layer={selectedLayer} />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm p-12 text-center text-gray-400">
                Select a layer above to configure its style, visible fields, and metadata.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}
