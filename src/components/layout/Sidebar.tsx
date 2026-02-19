'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useUIStore } from '@/stores';
import { LayerTree } from '@/components/layers/LayerTree';
import { Legend } from '@/components/layers/Legend';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    isMobile,
  } = useUIStore();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-900">Layers</h2>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
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

      {/* Layer tree */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <LayerTree />
        </div>
      </ScrollArea>

      {/* Legend */}
      <div className="border-t">
        <Legend />
      </div>
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

  // Desktop: regular sidebar
  return (
    <aside
      className={cn(
        'h-full bg-white border-r transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-[320px]'
      )}
    >
      {sidebarContent}
    </aside>
  );
}
