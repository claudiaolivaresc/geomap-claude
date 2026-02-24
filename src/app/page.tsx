'use client';

import { useEffect, useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { MapCanvas, MapControls, MeasureTool } from '@/components/map';
import { LayerInfoModal, Legend } from '@/components/layers';
import { useUIStore, useConfigStore } from '@/stores';

export default function Home() {
  const { setIsMobile } = useUIStore();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side hydration (Zustand persist reads from localStorage)
  useEffect(() => {
    setMounted(true);
    useConfigStore.getState().fetchOverrides();
  }, []);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  if (!mounted) {
    return <div className="h-screen bg-[#141d2d]" />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (All Layers) */}
        <Sidebar />

        {/* Active Layers Panel */}
        <Legend />

        {/* Map */}
        <main className="flex-1 relative">
          <MapCanvas />
          <MapControls />
          <MeasureTool />

          {/* Bottom-right logo watermark */}
          <div className="absolute bottom-4 right-4 z-10">
            <img
              src="/pi-logo.png"
              alt="Project InnerSpace"
              className="h-10 w-auto opacity-80"
            />
          </div>
        </main>
      </div>

      {/* Layer Info Modal */}
      <LayerInfoModal />
    </div>
  );
}
