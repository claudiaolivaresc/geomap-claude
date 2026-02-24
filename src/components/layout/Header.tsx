'use client';

import { Search, Menu, HelpCircle, User, Shield } from 'lucide-react';
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
import type { UserRole } from '@/types';
import { ROLE_LABELS } from '@/config';
import { SearchDropdown } from './SearchDropdown';

interface DevPersona {
  label: string;
  user: null | { role: UserRole; companyId?: string; companyName?: string };
}

const DEV_PERSONAS: DevPersona[] = [
  { label: 'Public (logged out)', user: null },
  { label: 'Admin', user: { role: 'admin' } },
  { label: 'Company A User', user: { role: 'company', companyId: 'company-a', companyName: 'Company A' } },
  { label: 'Company B User', user: { role: 'company', companyId: 'company-b', companyName: 'Company B' } },
];

export function Header() {
  const { toggleSidebar, searchQuery, setSearchQuery, isMobile } = useUIStore();
  const { user, isAuthenticated, logout, setUser } = useAuthStore();

  const switchPersona = (persona: DevPersona) => {
    if (!persona.user) {
      logout();
    } else {
      setUser({
        id: 'dev-user',
        email: 'dev@test.com',
        displayName: `Dev (${persona.label})`,
        role: persona.user.role,
        companyId: persona.user.companyId,
        companyName: persona.user.companyName,
        createdAt: new Date(),
      });
    }
  };

  const getUserLabel = () => {
    if (!user) return 'Public';
    if (user.role === 'company') return user.companyName || 'Company User';
    return ROLE_LABELS[user.role];
  };

  return (
    <header className="h-14 flex items-center px-4 gap-4 shadow-md" style={{ backgroundColor: '#141d2d' }}>
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
        <span className="font-bold text-lg" style={{ color: '#ffa925' }}>
          GeoMap<sup className="text-[10px] align-super">™</sup> <span className="text-xs font-normal text-[#819a93]">Beta</span>
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#819a93] z-10" />
          <Input
            type="search"
            placeholder="Search layers, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border border-[#b4ccc5]/30 text-white placeholder:text-[#819a93] focus-visible:ring-2 focus-visible:ring-[#ffa925]/50"
          />
          <SearchDropdown />
        </div>
      </div>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Dev role switcher */}
        {process.env.NODE_ENV === 'development' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#ffa925] hover:bg-white/10 gap-1 text-xs border border-[#ffa925]/40"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {getUserLabel()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Switch Role (Dev)
              </div>
              <DropdownMenuSeparator />
              {DEV_PERSONAS.map((persona) => (
                <DropdownMenuItem
                  key={persona.label}
                  onClick={() => switchPersona(persona)}
                  className={
                    (persona.user === null && !user) ||
                    (persona.user?.role === user?.role && persona.user?.companyId === user?.companyId)
                      ? 'font-semibold bg-accent'
                      : ''
                  }
                >
                  {persona.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
                <p className="text-xs text-muted-foreground">
                  {user.role === 'company' ? user.companyName : ROLE_LABELS[user.role]}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="text-[#141d2d] font-semibold hover:opacity-90" style={{ backgroundColor: '#ffa925' }}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
