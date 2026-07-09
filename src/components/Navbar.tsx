/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, Coins, Sparkles, MessageSquare, User as UserIcon, LogIn, Menu, Shield, LogOut,
  Check, Trash2, Heart, MessageCircle, UserPlus, Gift, Crown, Info, X
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onToggleSidebar }) => {
  const { 
    currentUser, 
    unreadNotificationsCount, 
    unreadMessagesCount, 
    setView, 
    handleLogout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'likes' | 'comments' | 'gifts' | 'purchases' | 'system'>('all');

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  };

  const getNotifIconAndStyle = (type: string) => {
    switch (type) {
      case 'like':
        return { icon: Heart, bg: 'bg-rose-500/10', text: 'text-rose-400' };
      case 'comment':
        return { icon: MessageCircle, bg: 'bg-blue-500/10', text: 'text-blue-400' };
      case 'follow':
        return { icon: UserPlus, bg: 'bg-violet-500/10', text: 'text-violet-400' };
      case 'gift':
        return { icon: Gift, bg: 'bg-amber-500/10', text: 'text-amber-400' };
      case 'message':
        return { icon: MessageSquare, bg: 'bg-indigo-500/10', text: 'text-indigo-400' };
      case 'coin_purchase':
        return { icon: Coins, bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
      case 'vip':
        return { icon: Crown, bg: 'bg-purple-500/10', text: 'text-purple-400' };
      default:
        return { icon: Info, bg: 'bg-zinc-500/10', text: 'text-zinc-400' };
    }
  };

  const filteredNotifications = (notifications || []).filter(n => {
    if (notifFilter === 'all') return true;
    if (notifFilter === 'likes') return n.type === 'like';
    if (notifFilter === 'comments') return n.type === 'comment';
    if (notifFilter === 'gifts') return n.type === 'gift';
    if (notifFilter === 'purchases') return n.type === 'coin_purchase' || n.type === 'vip';
    if (notifFilter === 'system') return n.type === 'system';
    return true;
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white md:hidden"
            id="nav-mobile-menu-btn"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div 
            onClick={() => setView('feed')} 
            className="flex cursor-pointer items-center gap-2"
            id="nav-logo-btn"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 font-display text-lg font-bold text-white shadow-lg shadow-violet-500/20">
              CX
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white hidden sm:block">
              Connect<span className="text-violet-500">X</span>
            </span>
          </div>
        </div>

        {/* Center search bar or greetings */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="w-full relative">
            <input 
              type="text" 
              placeholder="Search posts, creators or virtual gifts..." 
              className="w-full rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500/50"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {currentUser ? (
            <>
              {/* Wallet overview shortcuts */}
              <div 
                onClick={() => setView('wallet')}
                className="flex items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-3 py-1 cursor-pointer transition hover:bg-zinc-900/90 text-xs sm:text-sm"
                id="nav-wallet-pill"
              >
                <div className="flex items-center gap-1 text-amber-400 font-medium">
                  <Coins className="h-4 w-4" />
                  <span>{currentUser.coins.toLocaleString()}</span>
                </div>
                <div className="h-3 w-px bg-zinc-800" />
                <div className="flex items-center gap-1 text-cyan-400 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{currentUser.diamonds.toLocaleString()}</span>
                </div>
              </div>

              {/* Chat notifications shortcut */}
              <button 
                onClick={() => setView('chat')}
                className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
                id="nav-chat-btn"
              >
                <MessageSquare className="h-5 w-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* General Notifications shortcut */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifDropdown(!showNotifDropdown);
                    setShowDropdown(false);
                  }}
                  className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
                  id="nav-notif-btn"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 z-50">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">Notifications</h3>
                        <p className="text-[11px] text-zinc-400 font-medium">
                          {unreadNotificationsCount} unread realtime updates
                        </p>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button 
                          onClick={() => markAllNotificationsRead()}
                          className="flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition"
                          id="mark-all-read-btn"
                        >
                          <Check className="h-3 w-3" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(['all', 'likes', 'comments', 'gifts', 'purchases', 'system'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setNotifFilter(filter)}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize transition ${
                            notifFilter === filter
                              ? 'bg-violet-600 text-white'
                              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white'
                          }`}
                        >
                          {filter === 'purchases' ? 'Shop' : filter}
                        </button>
                      ))}
                    </div>

                    {/* Notifications list */}
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif) => {
                          const conf = getNotifIconAndStyle(notif.type);
                          const IconComp = conf.icon;
                          return (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                if (!notif.is_read) {
                                  markNotificationRead(notif.id);
                                }
                              }}
                              className={`group relative flex items-start gap-3 rounded-xl p-2.5 transition cursor-pointer ${
                                notif.is_read ? 'hover:bg-zinc-900/40' : 'bg-violet-950/10 hover:bg-violet-950/20 border border-violet-900/20'
                              }`}
                            >
                              {/* Avatar/Icon Container */}
                              <div className="relative shrink-0">
                                {notif.sender_avatar ? (
                                  <img 
                                    src={notif.sender_avatar} 
                                    alt={notif.sender_name} 
                                    className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                                  />
                                ) : (
                                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${conf.bg} ${conf.text}`}>
                                    <IconComp className="h-4.5 w-4.5" />
                                  </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-zinc-950 ${conf.bg} ${conf.text}`}>
                                  <IconComp className="h-2.5 w-2.5" />
                                </div>
                              </div>

                              {/* Text Block */}
                              <div className="flex-1 min-w-0 pr-6">
                                <p className="text-xs text-zinc-300 leading-normal">
                                  <span className="font-bold text-white mr-1">
                                    {notif.sender_name}
                                  </span>
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-zinc-500 mt-1 block font-mono">
                                  {formatRelativeTime(notif.created_at)}
                                </span>
                              </div>

                              {/* Unread indicator / Actions */}
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {!notif.is_read && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse group-hover:hidden" />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notif.id);
                                  }}
                                  className="hidden group-hover:flex rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400 transition"
                                  title="Delete notification"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="rounded-full bg-zinc-900 p-3 mb-2">
                            <Bell className="h-6 w-6 text-zinc-600" />
                          </div>
                          <p className="text-xs font-bold text-zinc-400">All caught up!</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">No notifications in this filter.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button 
                   onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 focus:outline-none"
                  id="nav-user-dropdown"
                >
                  <div className={`relative rounded-full p-0.5 border-2 ${currentUser.is_vip ? 'border-amber-400' : 'border-zinc-800'}`}>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.display_name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    {currentUser.is_vip && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[8px] px-0.5 rounded font-extrabold text-slate-950">
                        VIP
                      </span>
                    )}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl ring-1 ring-black ring-opacity-5">
                    <div className="px-3 py-2 border-b border-zinc-900">
                      <p className="text-sm font-semibold text-white">{currentUser.display_name}</p>
                      <p className="text-xs text-zinc-400 font-mono">@{currentUser.username}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded w-max">
                        <span>Lv.{currentUser.level}</span>
                        {currentUser.role === 'admin' && (
                          <span className="flex items-center gap-0.5 text-rose-400 font-bold ml-1">
                            <Shield className="h-2.5 w-2.5" />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => { setView('profile', currentUser.id); setShowDropdown(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                    >
                      <UserIcon className="h-4 w-4 text-violet-400" />
                      My Profile
                    </button>

                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => { setView('admin'); setShowDropdown(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                      >
                        <Shield className="h-4 w-4 text-rose-400" />
                        Admin Panel
                      </button>
                    )}

                    <button 
                      onClick={() => { handleLogout(); setShowDropdown(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition border-t border-zinc-900 mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-violet-500 shadow-md shadow-violet-500/10"
              id="nav-login-btn"
            >
              <LogIn className="h-4 w-4" />
              Join ConnectX
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
