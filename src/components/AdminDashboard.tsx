/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, CoinPackage } from '../types';
import { 
  ShieldAlert, Users, Gift as GiftIcon, Coins, AlertCircle, 
  Trash, Check, PlusCircle, Sparkles, BarChart2, CheckCircle, Search 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    gifts, 
    coinPackages, 
    reports, 
    resolveReport, 
    adminDeleteUser, 
    adminAddGift, 
    adminDeleteGift, 
    adminAddCoinPackage, 
    adminDeleteCoinPackage 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'reports' | 'users' | 'catalog'>('analytics');

  // New gift form state
  const [giftName, setGiftName] = useState('');
  const [giftIcon, setGiftIcon] = useState('🎁');
  const [giftCost, setGiftCost] = useState(100);
  const [giftCategory, setGiftCategory] = useState<'Popular' | 'Luxury' | 'Special' | 'VIP'>('Popular');

  // New package form state
  const [packageCoins, setPackageCoins] = useState(1000);
  const [packageCostUsd, setPackageCostUsd] = useState(9.99);
  const [packageBadge, setPackageBadge] = useState('Hot');

  // User search filter
  const [userSearchText, setUserSearchText] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-rose-900 bg-rose-950/20 p-8 text-center text-rose-300">
        Access Denied. You do not possess administrator credentials for ConnectX.
      </div>
    );
  }

  const handleCreateGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftName.trim()) return;

    const newGift: Gift = {
      id: `gift-${Date.now()}`,
      name: giftName,
      icon: giftIcon,
      cost_coins: giftCost,
      value_diamonds: Math.floor(giftCost / 2),
      category: giftCategory
    };

    adminAddGift(newGift);
    setGiftName('');
    setGiftCost(100);
    alert(`Success! "${giftName}" virtual gift added to catalog.`);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();

    const newPkg: CoinPackage = {
      id: `pkg-${Date.now()}`,
      coins: packageCoins,
      cost_usd: packageCostUsd,
      badge: packageBadge || undefined
    };

    adminAddCoinPackage(newPkg);
    setPackageCoins(1000);
    setPackageCostUsd(9.99);
    setPackageBadge('Hot');
    alert(`Success! Coin package of ${packageCoins} coins added to store.`);
  };

  const filteredUsers = users.filter(u => 
    u.display_name.toLowerCase().includes(userSearchText.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearchText.toLowerCase())
  );

  return (
    <div className="space-y-6" id="admin-dashboard-container">
      
      {/* Intro Heading Banner */}
      <div className="rounded-3xl border border-rose-900 bg-gradient-to-br from-rose-950/10 to-zinc-950 p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-rose-500 tracking-wider flex items-center gap-1 font-display">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            ConnectX Moderation Panel
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">CX Administrator Workspace</h2>
        </div>

        {/* Sub tab select */}
        <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
          {[
            { key: 'analytics', label: 'Analytics' },
            { key: 'reports', label: 'User Reports (' + reports.filter(r => r.status === 'pending').length + ')' },
            { key: 'users', label: 'Users Registry' },
            { key: 'catalog', label: 'Refills & Gifts Config' }
          ].map((tab) => (
            <button 
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activeSubTab === tab.key ? 'bg-violet-600 text-white shadow-md shadow-violet-500/10' : 'text-zinc-400 hover:text-white'}`}
              id={`admin-tab-toggle-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW PANEL SELECTION */}

      {/* ANALYTICS SUB VIEW */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-4">
              <Users className="h-6 w-6 text-violet-500 mb-2" />
              <span className="block text-xs text-zinc-400 font-medium">Platform Members</span>
              <strong className="block text-xl text-white font-mono mt-1">{users.length} Registrations</strong>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-4">
              <GiftIcon className="h-6 w-6 text-purple-400 mb-2" />
              <span className="block text-xs text-zinc-400 font-medium">Virtual Gifts Listed</span>
              <strong className="block text-xl text-white font-mono mt-1">{gifts.length} Items</strong>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-4">
              <Coins className="h-6 w-6 text-amber-500 mb-2" />
              <span className="block text-xs text-zinc-400 font-medium">Platform Gross Refills</span>
              <strong className="block text-xl text-emerald-400 font-mono mt-1">$1,850.00 USD</strong>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-4">
              <AlertCircle className="h-6 w-6 text-rose-500 mb-2" />
              <span className="block text-xs text-zinc-400 font-medium">Pending Infractions</span>
              <strong className="block text-xl text-rose-400 font-mono mt-1">
                {reports.filter(r => r.status === 'pending').length} Actions Required
              </strong>
            </div>
          </div>

          {/* Graphical curves representation */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4 text-violet-500" />
              System Load & Engagement Ratios
            </h3>
            
            <div className="space-y-4 pt-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Memory Cache Ingress Index</span>
                  <span className="text-violet-400 font-mono font-bold">18% utilized (OK)</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Database Transactions Write Queries / Sec</span>
                  <span className="text-cyan-400 font-mono font-bold">42 QPS (Stable)</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Gift Conversion Exchanges (Diamonds conversions)</span>
                  <span className="text-amber-400 font-mono font-bold">89% conversion rate success</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '89%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER REPORTS HUB SUB VIEW */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display">Submitted Community Reports</h3>
          
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className={`rounded-2xl border p-4 text-xs ${report.status === 'pending' ? 'border-rose-900 bg-rose-950/10' : 'border-zinc-800 bg-zinc-900/10'}`}
                  id={`admin-report-card-${report.id}`}
                >
                  <div className="flex items-center justify-between border-b border-zinc-900/40 pb-2 flex-wrap gap-2">
                    <div>
                      <span className="rounded bg-rose-900/30 text-rose-400 font-bold px-2 py-0.5">
                        Reason: {report.reason}
                      </span>
                      <span className="text-zinc-500 font-mono ml-3">
                        Submitted: {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      {report.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => resolveReport(report.id)}
                            className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-emerald-500"
                          >
                            <Check className="h-3 w-3" />
                            Mark Resolved
                          </button>
                          <button 
                            onClick={() => { adminDeleteUser(report.reported_user_id); resolveReport(report.id); alert('Moderator Command: User account blacklisted and deleted.'); }}
                            className="flex items-center gap-1 rounded bg-rose-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-rose-500"
                          >
                            <Trash className="h-3 w-3" />
                            Ban/Delete Acc
                          </button>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle className="h-4 w-4" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-zinc-300">
                    <div>
                      <p>Reporter profile: <strong>{report.reporter_name}</strong></p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">ID: {report.reporter_id}</p>
                    </div>
                    <div>
                      <p>Reported Violator: <strong className="text-rose-400">{report.reported_user_name}</strong></p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">ID: {report.reported_user_id}</p>
                    </div>
                  </div>

                  <div className="mt-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/50">
                    <p className="text-zinc-400 font-semibold mb-1">Reporter Statement details:</p>
                    <p className="text-zinc-200 whitespace-pre-line break-words leading-relaxed">{report.details}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-zinc-500 py-6">
              Platform is healthy. No active moderation tickets on file!
            </p>
          )}
        </div>
      )}

      {/* USERS REGISTRY SUB VIEW */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4 flex-wrap border-b border-zinc-900 pb-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display">Registrations Directory</h3>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search usernames..." 
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
            <table className="w-full text-left text-xs text-zinc-400 border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-zinc-300 font-bold">
                  <th className="p-3">User display details</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Coins balance</th>
                  <th className="p-3">Diamonds earned</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 border-zinc-900 hover:bg-zinc-900/20">
                    <td className="p-3 flex items-center gap-2.5">
                      <img 
                        src={user.avatar} 
                        alt={user.display_name} 
                        className="h-8 w-8 rounded-full object-cover border border-zinc-800"
                      />
                      <div>
                        <span className="block text-white font-bold leading-none">{user.display_name}</span>
                        <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">@{user.username} • {user.role}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-zinc-200">Lv.{user.level}</td>
                    <td className="p-3 font-mono text-amber-400 font-bold">{user.coins.toLocaleString()} 🪙</td>
                    <td className="p-3 font-mono text-cyan-400 font-bold">{user.diamonds.toLocaleString()} 💎</td>
                    <td className="p-3">
                      {user.id !== currentUser.id ? (
                        <button 
                          onClick={() => { adminDeleteUser(user.id); alert('Moderator deleted account: ' + user.display_name); }}
                          className="rounded p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 transition"
                          title="Purge account"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-semibold italic">My Acc</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REFILLS & GIFTS CATALOGUE SUB VIEW */}
      {activeSubTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Virtual Gifts custom seeding */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
              Virtual Gifts Registrar
            </h3>

            <form onSubmit={handleCreateGift} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Gift Name</label>
                <input 
                  type="text" 
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  placeholder="Space Yacht"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-white outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Emoji Icon Badge</label>
                <input 
                  type="text" 
                  value={giftIcon}
                  onChange={(e) => setGiftIcon(e.target.value)}
                  placeholder="🛳️"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-center text-white outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Coins Price cost</label>
                <input 
                  type="number" 
                  value={giftCost}
                  onChange={(e) => setGiftCost(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-white outline-none focus:border-violet-500"
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Categorization Tier</label>
                <select
                  value={giftCategory}
                  onChange={(e) => setGiftCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-white outline-none focus:border-violet-500"
                >
                  <option value="Popular">Popular</option>
                  <option value="Special">Special</option>
                  <option value="Luxury">Luxury</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div className="col-span-2 pt-2">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 rounded bg-violet-600 hover:bg-violet-500 font-bold py-1.5 text-xs text-white"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Virtual Gift Item
                </button>
              </div>
            </form>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {gifts.map((g) => (
                <div 
                  key={g.id}
                  className="rounded-xl border border-zinc-900 bg-zinc-950 p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <strong className="text-zinc-200">{g.name}</strong>
                      <span className="block text-[10px] text-zinc-500">{g.category} category</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-amber-400 font-bold">{g.cost_coins} coins</span>
                    <button 
                      onClick={() => adminDeleteGift(g.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-900"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coin shop Packages seeding */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-amber-400 animate-pulse" />
              Coin Packages Seeding
            </h3>

            <form onSubmit={handleCreatePackage} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Coins Granted</label>
                <input 
                  type="number" 
                  value={packageCoins}
                  onChange={(e) => setPackageCoins(Number(e.target.value))}
                  placeholder="1000"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-white outline-none focus:border-violet-500"
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Cost USD price</label>
                <input 
                  type="number" 
                  value={packageCostUsd}
                  onChange={(e) => setPackageCostUsd(Number(e.target.value))}
                  placeholder="9.99"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-white outline-none focus:border-violet-500"
                  step={0.01}
                  min={0.10}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-zinc-400 mb-1 font-semibold">Refill Badge</label>
                <input 
                  type="text" 
                  value={packageBadge}
                  onChange={(e) => setPackageBadge(e.target.value)}
                  placeholder="Hot deal"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-white outline-none focus:border-violet-500"
                />
              </div>

              <div className="col-span-2 pt-2">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 rounded bg-violet-600 hover:bg-violet-500 font-bold py-1.5 text-xs text-white"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Coin Pack
                </button>
              </div>
            </form>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {coinPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="rounded-xl border border-zinc-900 bg-zinc-950 p-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-zinc-200">{pkg.coins.toLocaleString()} Coins</strong>
                    {pkg.badge && (
                      <span className="ml-2 rounded bg-zinc-900 px-1.5 py-0.5 text-[8px] text-zinc-400">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-emerald-400 font-bold">${pkg.cost_usd} USD</span>
                    <button 
                      onClick={() => adminDeleteCoinPackage(pkg.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-900"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
