'use client';

import { useUIStore } from '@/stores';
import { getLayerById } from '@/config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function LayerInfoModal() {
  const { layerInfoModalOpen, selectedLayerForInfo, closeLayerInfo } = useUIStore();

  const layer = selectedLayerForInfo ? getLayerById(selectedLayerForInfo) : null;

  if (!layer) {
    return (
      <Dialog open={layerInfoModalOpen} onOpenChange={(open) => !open && closeLayerInfo()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Layer Information</DialogTitle>
            <DialogDescription>No layer information available.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={layerInfoModalOpen} onOpenChange={(open) => !open && closeLayerInfo()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{layer.title}</DialogTitle>
          <DialogDescription>{layer.type === 'raster' ? 'Raster Layer' : 'Vector Layer'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Geothermal Relevance */}
          {layer.metadata.geothermalRelevance && (
            <div>
              <h4 className="text-sm font-semibold text-emerald-700 mb-1">
                Why this layer is useful for understanding Geothermal
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {layer.metadata.geothermalRelevance}
              </p>
            </div>
          )}

          {/* Description */}
          {layer.metadata.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {layer.metadata.description}
              </p>
            </div>
          )}

          {/* Citation */}
          {layer.metadata.citation && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Citation</h4>
              <p className="text-sm text-gray-500 italic leading-relaxed">
                {layer.metadata.citation}
              </p>
            </div>
          )}

          {/* Source */}
          {layer.metadata.source && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Source</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                {layer.metadata.source}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
