/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import { 
  Home, MessageSquare, Trophy, Wallet, Crown, ShieldAlert, 
  User as UserIcon, LogOut, ChevronRight, Sparkles 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { currentUser, currentView, setView, handleLogout, profileUserId } = useApp();

  const navItems = [
    { view: 'feed' as AppView, label: 'Home Feed', icon: Home, color: 'text-violet-400' },
    { view: 'chat' as AppView, label: 'Messenger', icon: MessageSquare, color: 'text-indigo-400' },
    { view: 'rankings' as AppView, label: 'CX Rankings', icon: Trophy, color: 'text-yellow-500' },
    { view: 'wallet' as AppView, label: 'Coin Shop & Wallet', icon: Wallet, color: 'text-amber-500' },
    { view: 'vip' as AppView, label: 'VIP Club', icon: Crown, color: 'text-purple-400' },
  ];

  const handleNavClick = (view: AppView, profileId?: string) => {
    if (!currentUser && (view === 'chat' || view === 'wallet' || view === 'vip')) {
      onOpenAuth();
    } else {
      setView(view, profileId);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile Sidebar overlay backing */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-zinc-950/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed bottom-0 top-16 z-30 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950/95 transition-transform md:sticky md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
          
          {/* Main list */}
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-display">
                Discovery
              </p>
              <nav className="mt-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive 
                          ? 'bg-violet-600/10 text-violet-400 border-l-4 border-violet-600' 
                          : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                      }`}
                      id={`sidebar-link-${item.view}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.view === 'vip' && (
                        <span className="rounded bg-gradient-to-r from-amber-500 to-yellow-500 px-1 text-[9px] font-extrabold text-slate-950 animate-pulse">
                          PRO
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Profile view or welcome block */}
            {currentUser ? (
              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-display">
                  My Profile
                </p>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => handleNavClick('profile', currentUser.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      currentView === 'profile' && !profileUserId // Current viewing own profile
                        ? 'bg-zinc-900 text-white' 
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                    }`}
                    id="sidebar-link-profile"
                  >
                    <UserIcon className="h-5 w-5 text-violet-400" />
                    <span>My Dashboard</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        currentView === 'admin'
                          ? 'bg-zinc-900 text-rose-400 font-bold border-l-4 border-rose-600' 
                          : 'text-rose-400 hover:bg-rose-950/20'
                      }`}
                      id="sidebar-link-admin"
                    >
                      <ShieldAlert className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
                <h4 className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                  Premium Gifting
                </h4>
                <p className="mt-1 text-[11px] text-zinc-400">
                  Join ConnectX to unlock profile badges, send luxury cars 🏎️, and live chat with global creators!
                </p>
                <button
                  onClick={onOpenAuth}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-violet-600 py-1.5 text-xs font-bold text-white transition hover:bg-violet-500 shadow-lg shadow-violet-900/20"
                >
                  Create Account
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom user status or signout */}
          {currentUser && (
            <div className="border-t border-zinc-900 pt-4">
              <div className="flex items-center justify-between rounded-xl bg-zinc-900/40 p-2.5">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.display_name}
                    className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                  />
                  <div className="overflow-hidden">
                    <p className="truncate text-xs font-semibold text-white">{currentUser.display_name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Lv.{currentUser.level} Member</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-rose-400 transition"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  );
};
