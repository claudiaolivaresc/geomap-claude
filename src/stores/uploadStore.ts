import { create } from 'zustand';
import type { FeatureCollection } from 'geojson';

export interface UploadedLayer {
  id: string;
  fileName: string;
  tableName: string;
  visible: boolean;
  opacity: number;
  geojson: FeatureCollection;
}

interface UploadState {
  uploadedLayers: UploadedLayer[];
}

interface UploadActions {
  addUploadedLayer: (layer: UploadedLayer) => void;
  removeUploadedLayer: (id: string) => void;
  setUploadedLayerVisibility: (id: string, visible: boolean) => void;
  setUploadedLayerOpacity: (id: string, opacity: number) => void;
}

type UploadStore = UploadState & UploadActions;

export const useUploadStore = create<UploadStore>()((set) => ({
  uploadedLayers: [],

  addUploadedLayer: (layer) =>
    set((state) => ({
      uploadedLayers: [...state.uploadedLayers, layer],
    })),

  removeUploadedLayer: (id) =>
    set((state) => ({
      uploadedLayers: state.uploadedLayers.filter((l) => l.id !== id),
    })),

  setUploadedLayerVisibility: (id, visible) =>
    set((state) => ({
      uploadedLayers: state.uploadedLayers.map((l) =>
        l.id === id ? { ...l, visible } : l
      ),
    })),

  setUploadedLayerOpacity: (id, opacity) =>
    set((state) => ({
      uploadedLayers: state.uploadedLayers.map((l) =>
        l.id === id ? { ...l, opacity } : l
      ),
    })),
}));
