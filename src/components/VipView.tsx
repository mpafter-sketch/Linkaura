/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Sparkles, Check, Shield, Coins, Star, HelpCircle } from 'lucide-react';

export const VipView: React.FC = () => {
  const { currentUser, vipPackages, buyVIP } = useApp();

  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  const [purchaseError, setPurchaseError] = useState('');

  if (!currentUser) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 text-center text-zinc-400">
        Please sign in or register to browse the exclusive VIP membership catalogs.
      </div>
    );
  }

  const handleBuyVIPLocal = (packageId: string) => {
    const pkg = vipPackages.find(p => p.id === packageId);
    if (!pkg) return;

    if (currentUser.coins < pkg.cost_coins_per_month) {
      setPurchaseError(`Insufficient coins. ${pkg.name} costs ${pkg.cost_coins_per_month} coins per month, but your current balance is ${currentUser.coins} coins.`);
      setPurchaseSuccess('');
      setTimeout(() => setPurchaseError(''), 6000);
      return;
    }

    const success = buyVIP(packageId);
    if (success) {
      setPurchaseSuccess(`Congratulations! You have successfully subscribed to ${pkg.name}. Enjoy your premium avatar frames and exclusive rewards badge! 👑✨`);
      setPurchaseError('');
      setTimeout(() => setPurchaseSuccess(''), 6000);
    } else {
      setPurchaseError('Purchase request failed.');
      setPurchaseSuccess('');
      setTimeout(() => setPurchaseError(''), 6000);
    }
  };

  return (
    <div className="space-y-6" id="vip-dashboard-root">
      
      {/* Premium Hero Banner */}
      <div className="relative rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-950/20 to-zinc-950 p-6 md:p-8 overflow-hidden">
        <div className="absolute right-4 bottom-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Crown className="h-44 w-44 text-yellow-400 animate-pulse" />
        </div>

        <div className="max-w-xl space-y-3 relative z-10">
          <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-400 font-display">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
            ConnectX Elite Circle
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Unlock Premium VIP Status</h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Stand out in every stream, enjoy neon animated avatar borders, multiplier rewards on check-ins, and priority feedback with ConnectX VIP badges.
          </p>
        </div>

        {/* Visual indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-900 text-center relative z-10 text-xs text-zinc-400">
          <div className="p-3 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <Crown className="h-5 w-5 text-amber-500 mx-auto mb-1" />
            <strong className="block text-white">Elite Badge</strong>
            <span>Unique profile identity</span>
          </div>
          <div className="p-3 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <Shield className="h-5 w-5 text-violet-400 mx-auto mb-1" />
            <strong className="block text-white">Avatar Frame</strong>
            <span>Neon glow animations</span>
          </div>
          <div className="p-3 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <Coins className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <strong className="block text-white">Booster Reward</strong>
            <span>Up to +150% claim values</span>
          </div>
          <div className="p-3 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <Star className="h-5 w-5 text-purple-400 mx-auto mb-1" />
            <strong className="block text-white">Direct Chat</strong>
            <span>Direct admin support</span>
          </div>
        </div>
      </div>

      {/* Alert logs */}
      {purchaseSuccess && (
        <div className="rounded-xl bg-emerald-950/40 border border-emerald-900 p-4 text-xs text-emerald-300">
          {purchaseSuccess}
        </div>
      )}

      {purchaseError && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-900 p-4 text-xs text-rose-300">
          {purchaseError}
        </div>
      )}

      {/* VIP PACKAGES TIERS CARDS */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display">Available VIP Membership Subscriptions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vipPackages.map((pkg) => {
            const isUserVipTier = currentUser.is_vip && currentUser.vip_level >= pkg.level;
            
            return (
              <div 
                key={pkg.id}
                className={`rounded-3xl border p-5 bg-zinc-900/20 flex flex-col justify-between transition hover:border-amber-500 ${isUserVipTier ? 'border-amber-400 shadow-lg shadow-amber-500/5 bg-gradient-to-b from-zinc-950 to-zinc-900/40' : 'border-zinc-800'}`}
                id={`vip-pkg-card-${pkg.level}`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white font-display flex items-center gap-1">
                        {pkg.badge} {pkg.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">VIP Level {pkg.level} Status</p>
                    </div>
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>

                  <div className="my-4">
                    <span className="text-xl font-bold font-mono text-white">🪙 {pkg.cost_coins_per_month.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-500"> / month</span>
                  </div>

                  {/* Benefits description bullet lists */}
                  <ul className="space-y-2 mt-4">
                    {pkg.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 leading-normal">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-zinc-900 pt-4">
                  {isUserVipTier ? (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-900/50 p-2.5 text-center text-xs font-bold text-amber-400">
                      🌟 Tier Unlocked & Active
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleBuyVIPLocal(pkg.id)}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-yellow-400 transition"
                      id={`buy-vip-btn-${pkg.id}`}
                    >
                      Subscribe via Wallet Coins
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
