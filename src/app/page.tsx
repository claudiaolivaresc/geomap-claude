'use client';

import { useEffect } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { MapCanvas, MapControls } from '@/components/map';
import { useUIStore } from '@/stores';

export default function Home() {
  const { setIsMobile } = useUIStore();

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Map */}
        <main className="flex-1 relative">
          <MapCanvas />
          <MapControls />
        </main>
      </div>
    </div>
  );
}
