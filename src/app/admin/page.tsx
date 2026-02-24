'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { LayerSelector } from '@/components/admin/LayerSelector';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { TableDiscoveryPanel } from '@/components/admin/TableDiscoveryPanel';
import { CompaniesPanel } from '@/components/admin/CompaniesPanel';
import type { AdminLayerView } from '@/types/admin.types';
import type { PostGISTable } from '@/types/admin.types';

type AdminSection = 'layers' | 'companies';

function AdminContent() {
  const [layers, setLayers] = useState<AdminLayerView[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('layers');

  const fetchLayers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/layers');
      const data = await res.json();
      if (data.layers) {
        setLayers(data.layers);
      } else {
        setError('Failed to load layers');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLayers();
  }, [fetchLayers]);

  const handleRegister = useCallback((_table: PostGISTable, layerId: string) => {
    setShowDiscovery(false);
    // Refresh layers then select the new one
    fetchLayers().then(() => {
      setSelectedId(layerId);
    });
  }, [fetchLayers]);

  const selectedLayer = layers.find((l) => l.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#141d2d] text-white shadow">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/pi-logo.png" alt="PI" className="h-8 w-auto" />
            <div>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <p className="text-xs text-gray-400">Layer & Company Management</p>
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

      {/* Section tabs */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex gap-1 border-b border-gray-200">
          <button
            onClick={() => setActiveSection('layers')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSection === 'layers'
                ? 'border-[#ffa925] text-[#141d2d]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Layers
          </button>
          <button
            onClick={() => setActiveSection('companies')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSection === 'companies'
                ? 'border-[#ffa925] text-[#141d2d]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Companies
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        {activeSection === 'companies' && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <CompaniesPanel />
          </div>
        )}

        {activeSection === 'layers' && (
          <>
            {loading && (
              <div className="text-center py-12 text-gray-500">Loading layers...</div>
            )}

            {error && (
              <div className="text-center py-12 text-red-500">{error}</div>
            )}

            {!loading && !error && (
              <div className="space-y-6">
                {/* Layer selector + Add Layer button */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a layer to configure
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <LayerSelector
                        layers={layers}
                        selectedId={selectedId}
                        onSelect={(id) => { setSelectedId(id); setShowDiscovery(false); }}
                      />
                    </div>
                    <button
                      onClick={() => { setShowDiscovery(!showDiscovery); setSelectedId(null); }}
                      className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                        showDiscovery
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      + Add Layer
                    </button>
                  </div>
                </div>

                {/* Discovery panel */}
                {showDiscovery && (
                  <TableDiscoveryPanel onRegister={handleRegister} />
                )}

                {/* Configuration form */}
                {!showDiscovery && selectedLayer && (
                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <AdminTabs key={selectedLayer.id} layer={selectedLayer} />
                  </div>
                )}

                {!showDiscovery && !selectedLayer && (
                  <div className="bg-white rounded-lg border shadow-sm p-12 text-center text-gray-400">
                    Select a layer above to configure, or click &quot;Add Layer&quot; to register new PostGIS tables.
                  </div>
                )}
              </div>
            )}
          </>
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
