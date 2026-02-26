import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  sidebarTab: 'layers' | 'active';
  legendOpen: boolean;
  layerInfoModalOpen: boolean;
  selectedLayerForInfo: string | null;
  upgradeModalOpen: boolean;
  exportDialogOpen: boolean;
  basemapSwitcherOpen: boolean;
  searchQuery: string;
  isMobile: boolean;
}

interface UIActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarWidth: (width: number) => void;
  setSidebarTab: (tab: 'layers' | 'active') => void;
  setLegendOpen: (open: boolean) => void;
  toggleLegend: () => void;
  openLayerInfo: (layerId: string) => void;
  closeLayerInfo: () => void;
  setUpgradeModalOpen: (open: boolean) => void;
  setExportDialogOpen: (open: boolean) => void;
  setBasemapSwitcherOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setIsMobile: (isMobile: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()((set) => ({
  // State
  sidebarOpen: true,
  sidebarCollapsed: false,
  sidebarWidth: 320,
  sidebarTab: 'layers',
  legendOpen: true,
  layerInfoModalOpen: false,
  selectedLayerForInfo: null,
  upgradeModalOpen: false,
  exportDialogOpen: false,
  basemapSwitcherOpen: false,
  searchQuery: '',
  isMobile: false,

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  setLegendOpen: (open) => set({ legendOpen: open }),
  toggleLegend: () => set((state) => ({ legendOpen: !state.legendOpen })),

  openLayerInfo: (layerId) =>
    set({ layerInfoModalOpen: true, selectedLayerForInfo: layerId }),
  closeLayerInfo: () =>
    set({ layerInfoModalOpen: false, selectedLayerForInfo: null }),

  setUpgradeModalOpen: (open) => set({ upgradeModalOpen: open }),

  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),

  setBasemapSwitcherOpen: (open) => set({ basemapSwitcherOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setIsMobile: (isMobile) => set({ isMobile }),
}));
