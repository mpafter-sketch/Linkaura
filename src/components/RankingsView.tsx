/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RankingPeriod, RankingType } from '../types';
import { Trophy, Coins, Sparkles, TrendingUp, TrendingDown, Minus, Crown, ArrowRight, Gift, Flame } from 'lucide-react';

export const RankingsView: React.FC = () => {
  const { getRankings, setView } = useApp();

  const [period, setPeriod] = useState<RankingPeriod>('daily');
  const [type, setType] = useState<RankingType>('popularity');

  const rankingEntries = getRankings(period, type);

  // Split top 3 vs others
  const topThree = rankingEntries.slice(0, 3);
  const remainingList = rankingEntries.slice(3);

  const handleUserClick = (userId: string) => {
    setView('profile', userId);
  };

  // Helper for displaying values based on type
  const getValueDetails = (val: number) => {
    switch (type) {
      case 'popularity':
        return {
          label: 'Diamonds Earned',
          badge: '💎',
          color: 'text-cyan-400',
          icon: Sparkles
        };
      case 'top_gifter':
      case 'wealth':
        return {
          label: 'Gifts Sent',
          badge: '🪙',
          color: 'text-amber-400',
          icon: Gift
        };
      case 'richest':
        return {
          label: 'Net Balance',
          badge: '🪙',
          color: 'text-yellow-400',
          icon: Crown
        };
      case 'rising':
        return {
          label: 'Activity Score',
          badge: 'pts',
          color: 'text-fuchsia-400',
          icon: Flame
        };
      default:
        return {
          label: 'Score',
          badge: 'pts',
          color: 'text-zinc-400',
          icon: Trophy
        };
    }
  };

  return (
    <div className="space-y-6" id="rankings-board-root">
      
      {/* Intro banner */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/10 p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1 font-display">
            <Trophy className="h-3.5 w-3.5" />
            ConnectX Leaderboards
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Global Rankings Board</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Celebrate the most popular streaming stars, most generous wealth patrons, and fastest rising influencers of the ConnectX community!
          </p>
        </div>
      </div>

      {/* Navigation toggles (Categories & Periods) */}
      <div className="space-y-4 border-b border-zinc-900 pb-4">
        
        {/* Category Tabs: Popular, Top Gifter, Richest, Rising */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-850 w-full sm:w-auto">
            {[
              { key: 'popularity', label: 'Popular 💎', icon: Sparkles, color: 'hover:text-cyan-400', activeBg: 'bg-cyan-600 text-white shadow-cyan-500/10' },
              { key: 'top_gifter', label: 'Top Gifter 🎁', icon: Gift, color: 'hover:text-amber-400', activeBg: 'bg-amber-600 text-white shadow-amber-500/10' },
              { key: 'richest', label: 'Richest 🪙', icon: Crown, color: 'hover:text-yellow-400', activeBg: 'bg-yellow-600 text-white shadow-yellow-500/10' },
              { key: 'rising', label: 'Rising 🔥', icon: Flame, color: 'hover:text-fuchsia-400', activeBg: 'bg-fuchsia-600 text-white shadow-fuchsia-500/10' }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = type === cat.key || (cat.key === 'top_gifter' && type === 'wealth');
              return (
                <button
                  key={cat.key}
                  onClick={() => setType(cat.key as any)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? `${cat.activeBg} shadow-md`
                      : `text-zinc-400 ${cat.color} hover:bg-zinc-900/50`
                  }`}
                  id={`type-toggle-${cat.key}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Period selector tabs: Daily, Weekly, Monthly */}
          <div className="flex gap-1.5 bg-zinc-950/40 p-1 rounded-xl border border-zinc-900 self-end sm:self-auto">
            {[
              { key: 'daily', label: 'Daily' },
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' }
            ].map((item) => (
              <button 
                key={item.key}
                onClick={() => setPeriod(item.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  period === item.key 
                    ? 'bg-zinc-800 text-white border border-zinc-700/80 shadow-inner' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                id={`period-toggle-${item.key}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* THREE PODIUM COLUMN VISUALS */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topThree.map((entry, index) => {
            const crownColor = 
              entry.rank === 1 ? 'text-yellow-400' : 
              entry.rank === 2 ? 'text-zinc-300' : 'text-amber-600';
            const cardBorder = 
              entry.rank === 1 ? 'border-yellow-500 bg-gradient-to-b from-yellow-950/10 to-zinc-950' : 
              entry.rank === 2 ? 'border-zinc-500/70' : 'border-amber-700/70';

            const { label, badge, color, icon: Icon } = getValueDetails(entry.value);

            return (
              <div 
                key={entry.user.id}
                onClick={() => handleUserClick(entry.user.id)}
                className={`relative rounded-3xl border p-5 text-center cursor-pointer transition hover:scale-[1.02] bg-zinc-900/20 ${cardBorder}`}
                id={`ranking-podium-card-${entry.rank}`}
              >
                {/* Ranking Crown */}
                <div className="absolute top-4 left-4 flex items-center justify-center gap-1 font-bold">
                  <Crown className={`h-5 w-5 ${crownColor}`} />
                  <span className="text-white font-mono text-sm">#{entry.rank}</span>
                </div>

                {/* Trend position */}
                <div className="absolute top-4 right-4 text-[10px] flex items-center gap-0.5">
                  {entry.change === 'up' && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
                  {entry.change === 'down' && <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
                  {entry.change === 'stable' && <Minus className="h-3.5 w-3.5 text-zinc-500" />}
                </div>

                {/* Avatar */}
                <div className="mt-4 flex justify-center">
                  <div className={`rounded-full p-1 bg-zinc-950 border-4 ${entry.user.is_vip ? 'border-amber-400' : 'border-zinc-800'}`}>
                    <img 
                      src={entry.user.avatar} 
                      alt={entry.user.display_name} 
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-white hover:underline truncate">{entry.user.display_name}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">@{entry.user.username}</p>
                </div>

                {/* Aggregated value representation */}
                <div className="mt-4 rounded-xl bg-zinc-950/80 p-2.5 flex flex-col items-center justify-center gap-0.5 border border-zinc-900 font-mono">
                  <span className="text-[9px] text-zinc-500 font-sans font-semibold uppercase tracking-wider">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <Icon className={`h-4 w-4 ${color} animate-pulse`} />
                    <span className={`${color} font-black text-xs`}>
                      {entry.value.toLocaleString()} {badge}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST OF REMAINING USERS */}
      {remainingList.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display">Climbing Users</h3>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
            {remainingList.map((entry) => {
              const { badge, color } = getValueDetails(entry.value);
              return (
                <div 
                  key={entry.user.id}
                  onClick={() => handleUserClick(entry.user.id)}
                  className="flex items-center justify-between p-3.5 hover:bg-zinc-900/40 cursor-pointer transition border-b last:border-b-0 border-zinc-900"
                  id={`ranking-list-item-${entry.rank}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Position number */}
                    <span className="text-xs font-bold text-zinc-400 font-mono w-4 text-center">
                      {entry.rank}
                    </span>

                    <div className="relative shrink-0">
                      <img 
                        src={entry.user.avatar} 
                        alt={entry.user.display_name} 
                        className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                      />
                      {entry.user.is_online && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-zinc-950" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-white hover:underline leading-tight truncate">
                        {entry.user.display_name}
                      </span>
                      <span className="block text-[10px] text-zinc-500 font-mono">@{entry.user.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Status trend representation */}
                    <span className={`text-[11px] font-bold font-mono ${color}`}>
                      {entry.value.toLocaleString()} {badge}
                    </span>
                    
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
