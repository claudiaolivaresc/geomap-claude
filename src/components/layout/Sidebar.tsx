'use client';

import { useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Layers, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useUIStore } from '@/stores';
import { LayerTree } from '@/components/layers/LayerTree';
import { ActiveLayersContent } from '@/components/layers/Legend';
import { LayerUpload } from '@/components/upload/LayerUpload';
import { cn } from '@/lib/utils';

const MIN_WIDTH = 240;
const MAX_WIDTH = 600;

export function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    sidebarWidth,
    setSidebarWidth,
    sidebarTab,
    setSidebarTab,
    isMobile,
  } = useUIStore();

  const isResizing = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;

      const startX = e.clientX;
      const startWidth = sidebarWidth;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + (e.clientX - startX)));
        setSidebarWidth(newWidth);
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [sidebarWidth, setSidebarWidth]
  );

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#b4ccc5] flex-shrink-0" style={{ backgroundColor: '#141d2d' }}>
        <h2 className="font-semibold text-white text-sm">
          {sidebarTab === 'layers' ? 'Layers' : 'Active Layers'}
        </h2>
        <div className="flex items-center gap-1">
          {sidebarTab === 'layers' && <LayerUpload />}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={toggleSidebarCollapsed}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#b4ccc5] flex-shrink-0 bg-white">
        <button
          type="button"
          onClick={() => setSidebarTab('layers')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors',
            sidebarTab === 'layers'
              ? 'text-[#141d2d] border-b-2 border-[#ffa925]'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          Layers
        </button>
        <button
          type="button"
          onClick={() => setSidebarTab('active')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors',
            sidebarTab === 'active'
              ? 'text-[#141d2d] border-b-2 border-[#ffa925]'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Map className="h-3.5 w-3.5" />
          Active
        </button>
      </div>

      {/* Tab content */}
      <ScrollArea className="flex-1 overflow-hidden">
        {sidebarTab === 'layers' ? (
          <div className="p-4">
            <LayerTree />
          </div>
        ) : (
          <ActiveLayersContent />
        )}
      </ScrollArea>
    </div>
  );

  // Mobile: use Sheet component
  if (isMobile) {
    return (
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[320px] p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: resizable sidebar
  return (
    <aside
      className={cn(
        'h-full border-r border-[#b4ccc5] transition-all duration-300 ease-in-out relative flex-shrink-0',
        sidebarCollapsed && 'w-0 overflow-hidden'
      )}
      style={sidebarCollapsed ? undefined : { width: sidebarWidth, backgroundColor: '#f6fbf8' }}
    >
      {sidebarContent}

      {/* Resize handle */}
      {!sidebarCollapsed && (
        <div
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[#ffa925]/50 active:bg-[#ffa925]/70 transition-colors z-10"
          onMouseDown={handleMouseDown}
        />
      )}
    </aside>
  );
}
