'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useUIStore, useMapStore, useLayerStore } from '@/stores';
import { getAnyLayerById } from '@/lib/layerLookup';
import {
  compositeMapImage,
  composeCitationsImage,
  downloadCanvasAsPNG,
  type ExportLayer,
} from '@/lib/mapExport';
import type { VectorStyle } from '@/types';

export function MapExportDialog() {
  const { exportDialogOpen, setExportDialogOpen } = useUIStore();
  const { map } = useMapStore();
  const { activeLayers } = useLayerStore();

  const [title, setTitle] = useState('Map Export');
  const [mapPreviewUrl, setMapPreviewUrl] = useState<string | null>(null);
  const [citationsPreviewUrl, setCitationsPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const citationsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportLayersRef = useRef<ExportLayer[]>([]);

  const buildExportLayers = useCallback((): ExportLayer[] => {
    const exportLayers: ExportLayer[] = [];
    for (const [id, state] of activeLayers) {
      if (!state.visible) continue;
      const config = getAnyLayerById(id);
      if (!config) continue;

      const entry: ExportLayer = {
        id: config.id,
        title: config.title,
        legend: config.legend,
        citation: config.metadata?.citation,
      };

      if (config.type === 'vector' && config.style) {
        entry.styleType = (config.style as VectorStyle).type;
      }

      exportLayers.push(entry);
    }
    return exportLayers;
  }, [activeLayers]);

  const generatePreview = useCallback(async () => {
    if (!map || !exportDialogOpen) return;

    setGenerating(true);
    try {
      const exportLayers = buildExportLayers();
      exportLayersRef.current = exportLayers;

      // Generate map canvas
      const mapCanvas = await compositeMapImage({ map, title, layers: exportLayers });
      mapCanvasRef.current = mapCanvas;

      // Revoke previous map preview URL
      if (mapPreviewUrl) URL.revokeObjectURL(mapPreviewUrl);
      const mapBlob = await new Promise<Blob | null>((resolve) =>
        mapCanvas.toBlob(resolve, 'image/png'),
      );
      if (mapBlob) {
        setMapPreviewUrl(URL.createObjectURL(mapBlob));
      }

      // Generate citations canvas
      const citCanvas = composeCitationsImage(title, exportLayers);
      citationsCanvasRef.current = citCanvas;

      if (citationsPreviewUrl) URL.revokeObjectURL(citationsPreviewUrl);
      if (citCanvas) {
        const citBlob = await new Promise<Blob | null>((resolve) =>
          citCanvas.toBlob(resolve, 'image/png'),
        );
        if (citBlob) {
          setCitationsPreviewUrl(URL.createObjectURL(citBlob));
        }
      } else {
        setCitationsPreviewUrl(null);
      }
    } catch (err) {
      console.error('Export preview failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [map, exportDialogOpen, title, buildExportLayers, mapPreviewUrl, citationsPreviewUrl]);

  // Debounced regeneration on title change
  useEffect(() => {
    if (!exportDialogOpen) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      generatePreview();
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportDialogOpen, title]);

  // Generate on open
  useEffect(() => {
    if (exportDialogOpen) {
      generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportDialogOpen]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (mapPreviewUrl) URL.revokeObjectURL(mapPreviewUrl);
      if (citationsPreviewUrl) URL.revokeObjectURL(citationsPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    const safeName = title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'map_export';
    if (mapCanvasRef.current) {
      downloadCanvasAsPNG(mapCanvasRef.current, `${safeName}.png`);
    }
    if (citationsCanvasRef.current) {
      // Small delay so browser doesn't block the second download
      setTimeout(() => {
        downloadCanvasAsPNG(citationsCanvasRef.current!, `${safeName}_citations.png`);
      }, 300);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setExportDialogOpen(false);
      if (mapPreviewUrl) {
        URL.revokeObjectURL(mapPreviewUrl);
        setMapPreviewUrl(null);
      }
      if (citationsPreviewUrl) {
        URL.revokeObjectURL(citationsPreviewUrl);
        setCitationsPreviewUrl(null);
      }
      mapCanvasRef.current = null;
      citationsCanvasRef.current = null;
    }
  };

  return (
    <Dialog open={exportDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Map</DialogTitle>
          <DialogDescription>
            Set a title and download your map and citations as PNG images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Title input */}
          <div>
            <label htmlFor="export-title" className="text-sm font-medium text-gray-700 mb-1 block">
              Map Title
            </label>
            <Input
              id="export-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter map title..."
            />
          </div>

          {/* Map preview */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Map</p>
            <div className="relative bg-gray-100 rounded-lg border border-gray-200 min-h-[180px] flex items-center justify-center overflow-hidden">
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-sm text-gray-500">Generating preview...</span>
                </div>
              )}
              {mapPreviewUrl ? (
                <img
                  src={mapPreviewUrl}
                  alt="Map export preview"
                  className="max-w-full max-h-[40vh] object-contain"
                />
              ) : (
                !generating && (
                  <span className="text-sm text-gray-400">Preview will appear here</span>
                )
              )}
            </div>
          </div>

          {/* Citations preview */}
          {citationsPreviewUrl && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Citations & Sources</p>
              <div className="relative bg-gray-100 rounded-lg border border-gray-200 min-h-[100px] flex items-center justify-center overflow-hidden">
                <img
                  src={citationsPreviewUrl}
                  alt="Citations preview"
                  className="max-w-full max-h-[30vh] object-contain"
                />
              </div>
            </div>
          )}

          {/* Download button */}
          <Button
            onClick={handleDownload}
            disabled={!mapCanvasRef.current || generating}
            className="w-full"
            style={{ backgroundColor: '#ffa925', color: '#fff' }}
          >
            <Download className="h-4 w-4 mr-2" />
            {citationsCanvasRef.current ? 'Download PNGs (Map + Citations)' : 'Download PNG'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
