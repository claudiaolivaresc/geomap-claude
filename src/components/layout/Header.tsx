'use client';

import { Search, Menu, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore, useAuthStore } from '@/stores';

export function Header() {
  const { toggleSidebar, searchQuery, setSearchQuery, isMobile } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="h-14 bg-gradient-to-r from-sky-500 to-sky-600 flex items-center px-4 gap-4 shadow-md">
      {/* Menu button (mobile) */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        <span className="text-white font-bold text-lg hidden sm:block">
          GeoMap
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search layers, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/95 border-0 focus-visible:ring-2 focus-visible:ring-white/50"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User menu */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.displayName || user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.subscriptionLevel} Account
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-sky-600 hover:bg-white/90"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
