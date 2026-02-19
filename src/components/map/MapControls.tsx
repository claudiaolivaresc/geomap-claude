'use client';

import { Layers, Map, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMapStore, useUIStore } from '@/stores';
import { MAP_CONFIG } from '@/config';

export function MapControls() {
  const { currentBasemap, setBasemap, resetView } = useMapStore();
  const { toggleSidebarCollapsed, sidebarCollapsed } = useUIStore();

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
      {/* Toggle sidebar button */}
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-md hover:bg-gray-50"
        onClick={toggleSidebarCollapsed}
      >
        <Layers className="h-4 w-4" />
      </Button>

      {/* Basemap switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white shadow-md hover:bg-gray-50"
          >
            <Map className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          {MAP_CONFIG.styles.map((style) => (
            <DropdownMenuItem
              key={style.id}
              onClick={() => setBasemap(style.id)}
              className={currentBasemap === style.id ? 'bg-sky-50 text-sky-700' : ''}
            >
              {style.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset view button */}
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-md hover:bg-gray-50"
        onClick={resetView}
      >
        <Compass className="h-4 w-4" />
      </Button>
    </div>
  );
}
