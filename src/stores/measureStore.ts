import { create } from 'zustand';

export type MeasureMode = 'distance' | 'area' | 'coordinates' | null;

export interface MeasurePoint {
  lng: number;
  lat: number;
}

export interface CompletedMeasurement {
  mode: 'distance' | 'area' | 'coordinates';
  points: MeasurePoint[];
}

interface MeasureState {
  mode: MeasureMode;
  currentPoints: MeasurePoint[];
  completed: CompletedMeasurement[];
}

interface MeasureActions {
  startMeasure: (mode: MeasureMode) => void;
  addPoint: (lng: number, lat: number) => void;
  undoLastPoint: () => void;
  finishMeasure: () => void;
  clearMeasure: () => void;
}

type MeasureStore = MeasureState & MeasureActions;

export const useMeasureStore = create<MeasureStore>()((set, get) => ({
  mode: null,
  currentPoints: [],
  completed: [],

  startMeasure: (mode) => set({ mode, currentPoints: [] }),

  addPoint: (lng, lat) => {
    set((s) => ({ currentPoints: [...s.currentPoints, { lng, lat }] }));
  },

  undoLastPoint: () => set((s) => ({ currentPoints: s.currentPoints.slice(0, -1) })),

  finishMeasure: () => {
    const { mode, currentPoints } = get();
    if (!mode || currentPoints.length < 2) return;
    set((s) => ({
      completed: [...s.completed, { mode: mode as 'distance' | 'area' | 'coordinates', points: currentPoints }],
      currentPoints: [],
    }));
  },

  clearMeasure: () => set({ mode: null, currentPoints: [], completed: [] }),
}));
