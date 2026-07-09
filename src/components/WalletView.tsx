/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coins, Sparkles, Gift, ArrowRightLeft, CreditCard, Clock, 
  CheckCircle, ArrowUpRight, ArrowDownLeft, Shield, Smartphone, RefreshCw,
  Search, Download, ChevronRight, Info, Lock, Plus, Check, ExternalLink,
  FileText, X, TrendingUp, AlertCircle, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WalletTransaction } from '../types';

export const WalletView: React.FC = () => {
  const { 
    currentUser, 
    coinPackages, 
    walletTransactions, 
    buyCoins, 
    convertDiamonds, 
    claimDailyReward 
  } = useApp();

  // Navigation Sub-views
  const [activeTab, setActiveTab] = useState<'shop' | 'convert' | 'ledger'>('shop');
  
  // Recharge States
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'razorpay' | 'gpay' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'details' | 'processing' | 'success'>('selection');
  
  // Custom Card Input States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [priorityBilling, setPriorityBilling] = useState(false);

  // Conversion States
  const [diamondsToConvert, setDiamondsToConvert] = useState<number>(100);
  
  // Filter & Search States
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'refill' | 'convert' | 'gifting'>('all');
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<WalletTransaction | null>(null);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

  // Interactive Info tooltips
  const [showCoinsInfo, setShowCoinsInfo] = useState(false);
  const [showDiamondsInfo, setShowDiamondsInfo] = useState(false);

  // Notifications
  const [successNotif, setSuccessNotif] = useState('');
  const [errorNotif, setErrorNotif] = useState('');

  if (!currentUser) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <div className="rounded-full bg-zinc-900 h-16 w-16 flex items-center justify-center mx-auto text-violet-500">
          <Lock className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white font-sans">Access Secure Treasury</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Please sign in or register your ConnectX account to manage virtual assets, check secure ledger transactions, and complete coin package recharges.
        </p>
      </div>
    );
  }

  // Handle Daily Claim
  const handleClaimDaily = () => {
    try {
      const res = claimDailyReward();
      if (res.success) {
        setSuccessNotif(`Daily Reward Claimed successfully! +${res.coinsGranted} Coins have been added to your wallet!`);
        setErrorNotif('');
        setTimeout(() => setSuccessNotif(''), 5000);
      } else {
        setErrorNotif(res.error || 'Failed to claim daily reward.');
        setSuccessNotif('');
        setTimeout(() => setErrorNotif(''), 5000);
      }
    } catch (e: any) {
      setErrorNotif(e.message || 'System error while claiming.');
    }
  };

  // Select Refill Package
  const handlePackageSelection = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setPaymentGateway('stripe');
    setPaymentStep('details');
  };

  // Card Number space formatter
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  // Card Expiry Date slash formatter
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    if (formatted.length <= 5) {
      setCardExpiry(formatted);
    }
  };

  // Card CVV length protector
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length <= 3) {
      setCardCvv(raw);
    }
  };

  // Execute Simulated Transaction Process with Real-time loader ticks
  const handleExecuteMockPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageId || !paymentGateway) return;

    // Check basic billing form validity
    if (paymentGateway === 'stripe' && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      setErrorNotif('Please fill in all credit card details to authorize payment.');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStep('processing');
    setSuccessNotif('');
    setErrorNotif('');

    // Staged animation timers to simulate strict credit-ledger processing handshake
    setTimeout(() => {
      try {
        buyCoins(selectedPackageId);
        const pkg = coinPackages.find(p => p.id === selectedPackageId);
        
        setPaymentStep('success');
        setSuccessNotif(`Payment authorized successfully! Refilled +${pkg?.coins} Coins.`);
        
        // Reset inputs
        setCardNumber('');
        setCardName('');
        setCardExpiry('');
        setCardCvv('');
      } catch (err: any) {
        setErrorNotif(err.message || 'Secure payment gateway rejected authorization.');
        setPaymentStep('details');
      } finally {
        setIsProcessingPayment(false);
      }
    }, 2800);
  };

  // Convert Received Diamonds
  const handleConvertDiamondsLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (diamondsToConvert <= 0) return;

    const res = convertDiamonds(diamondsToConvert);
    if (res.success) {
      setSuccessNotif(`Exchange complete! Handed over ${diamondsToConvert} Diamonds and forged +${res.coinsGranted} Coins!`);
      setErrorNotif('');
      setDiamondsToConvert(100);
      setTimeout(() => setSuccessNotif(''), 5000);
    } else {
      setErrorNotif(res.error || 'Conversion failure inside LocalDB handler.');
      setSuccessNotif('');
      setTimeout(() => setErrorNotif(''), 5000);
    }
  };

  // Preset percentage helper for convert
  const handleConvertPercentage = (pct: number) => {
    const amt = Math.floor(currentUser.diamonds * pct);
    setDiamondsToConvert(Math.max(10, amt));
  };

  // Filter transaction entries based on current tag filter and search text
  const filteredTransactions = useMemo(() => {
    return walletTransactions.filter(tx => {
      // 1. Tag filter
      if (ledgerFilter === 'refill' && tx.type !== 'buy_coins') return false;
      if (ledgerFilter === 'convert' && tx.type !== 'convert_diamonds') return false;
      if (ledgerFilter === 'gifting' && tx.type !== 'send_gift' && tx.type !== 'receive_gift') return false;

      // 2. Search filter
      const searchLower = ledgerSearch.toLowerCase();
      return (
        tx.description.toLowerCase().includes(searchLower) ||
        tx.id.toLowerCase().includes(searchLower) ||
        tx.type.toLowerCase().includes(searchLower)
      );
    });
  }, [walletTransactions, ledgerFilter, ledgerSearch]);

  // Simulate receipt download
  const triggerMockReceiptDownload = (txId: string) => {
    setIsDownloadingReceipt(true);
    setTimeout(() => {
      setIsDownloadingReceipt(false);
      alert(`ConnectX Invoice Receipt: CX-INVOICE-${txId}.pdf generated and prepared for print.`);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="wallet-dashboard-root">
      
      {/* Wallet Balance Hero Card (Dynamic Visualizer of Coins and Diamonds) */}
      <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 sm:p-8 overflow-hidden shadow-2xl">
        
        {/* Glow ambient background rings */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-950/40 border border-violet-900/50 px-3 py-1 text-[10px] font-extrabold uppercase text-violet-400 tracking-wider font-mono">
              <Shield className="h-3 w-3 text-violet-400" /> SECURE SEC_API HANDSHAKE ACTIVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              ConnectX Virtual Treasury
            </h2>
            <p className="text-xs text-zinc-400 max-w-md">
              Manage your premium standard Coins, convert incoming diamond rewards from fans, and verify complete authorized checkouts.
            </p>
          </div>
          
          <button 
            onClick={handleClaimDaily}
            className="group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-violet-600 to-fuchsia-600 p-[1.5px] font-bold text-white shadow-lg transition duration-300 hover:shadow-violet-500/20"
            id="daily-claim-btn"
          >
            <div className="rounded-2xl bg-zinc-950 px-5 py-3 text-xs font-bold text-white transition duration-300 group-hover:bg-transparent flex items-center gap-2">
              <Gift className="h-4.5 w-4.5 text-amber-400 animate-bounce" />
              <span>Claim Daily Check-in Coins</span>
            </div>
          </button>
        </div>

        {/* Display Feedback Alerts */}
        <AnimatePresence>
          {successNotif && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 p-4 text-xs text-emerald-300 flex items-center gap-3"
            >
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successNotif}</span>
            </motion.div>
          )}

          {errorNotif && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 rounded-2xl bg-rose-950/30 border border-rose-900/60 p-4 text-xs text-rose-300 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{errorNotif}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dual Balance Grid Panels: Coins & Diamonds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          
          {/* COINS METRIC */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-5 flex flex-col justify-between overflow-hidden group hover:border-amber-500/40 transition duration-300">
            <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-semibold tracking-wide uppercase font-sans">Coins Balance</span>
                  <button 
                    type="button" 
                    onClick={() => setShowCoinsInfo(!showCoinsInfo)}
                    className="text-zinc-500 hover:text-amber-400"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="flex items-baseline gap-1.5">
                  <strong className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                    {currentUser.coins.toLocaleString()}
                  </strong>
                  <span className="text-xs text-zinc-500 font-mono">CXC</span>
                </div>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500 group-hover:scale-110 transition duration-350">
                <Coins className="h-6 w-6" />
              </div>
            </div>

            {/* Expanded usage details info */}
            <AnimatePresence>
              {showCoinsInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-3 text-[10px] text-zinc-400 leading-relaxed space-y-1.5 border-t border-zinc-900 pt-3"
                >
                  <p>🪙 Standard Coins serve as ConnectX's universal digital medium. Use them to:</p>
                  <ul className="list-disc list-inside space-y-0.5 font-mono text-amber-500/90 pl-1">
                    <li>Purchase Luxury Profile Badges or VIP tiers.</li>
                    <li>Send gorgeous premium gifts during private chat flows.</li>
                    <li>Reward top creators and gain access to prioritized chat lists.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900/60 pt-3">
              <span className="font-mono">Vault Key: CX-COIN-{currentUser.id.slice(0, 8).toUpperCase()}</span>
              <span className="text-amber-500/90 font-bold flex items-center gap-1">
                Active & spendable <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>

          {/* DIAMONDS METRIC */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-5 flex flex-col justify-between overflow-hidden group hover:border-cyan-500/40 transition duration-300">
            <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-semibold tracking-wide uppercase font-sans">Virtual Diamonds</span>
                  <button 
                    type="button" 
                    onClick={() => setShowDiamondsInfo(!showDiamondsInfo)}
                    className="text-zinc-500 hover:text-cyan-400"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <strong className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
                    {currentUser.diamonds.toLocaleString()}
                  </strong>
                  <span className="text-xs text-zinc-500 font-mono">CXD</span>
                </div>
              </div>
              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400 group-hover:scale-110 transition duration-350">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
            </div>

            {/* Expanded usage details info */}
            <AnimatePresence>
              {showDiamondsInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-3 text-[10px] text-zinc-400 leading-relaxed space-y-1.5 border-t border-zinc-900 pt-3"
                >
                  <p>💎 Virtual Diamonds represent received creator status. Earn them when:</p>
                  <ul className="list-disc list-inside space-y-0.5 font-mono text-cyan-400 pl-1">
                    <li>Followers send luxurious visual gifts directly to you.</li>
                    <li>You write highly engaging stream posts that unlock tips.</li>
                    <li>Convert back into Standard Coins anytime at a 1:2 premium rate!</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900/60 pt-3">
              <span className="font-mono">Vault Key: CX-DIAM-{currentUser.id.slice(0, 8).toUpperCase()}</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                Convertible back to Coins <ArrowRightLeft className="h-3 w-3" />
              </span>
            </div>
          </div>

        </div>

        {/* Member Level Booster Banner */}
        {currentUser.is_vip && (
          <div className="mt-4 text-[11px] text-amber-400 bg-amber-950/20 rounded-xl p-3 border border-amber-900/50 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <div>
              <strong>VIP Boost Level {currentUser.vip_level || 1} Active:</strong> You are receiving an automatic 30% additional coin bonus on standard claims! Thank you for supporting the creator network.
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation (Recharge, Forge Diamonds, Transactions History) */}
      <div className="flex border-b border-zinc-900 overflow-x-auto scrollbar-none" id="wallet-tabs-container">
        {[
          { key: 'shop', label: 'Recharge Coins Center 🪙', icon: Coins },
          { key: 'convert', label: 'Forge Received Diamonds 💎', icon: ArrowRightLeft },
          { key: 'ledger', label: 'Transactions Ledger History 📜', icon: Clock }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button 
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition whitespace-nowrap border-b-2 shrink-0 ${
                isActive 
                  ? 'text-violet-400 border-violet-500 bg-violet-950/5' 
                  : 'text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900/20'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT MODULES */}
      <div className="min-h-[250px]">
        
        {/* SHOP TAB: Recharge Coin Packages */}
        {activeTab === 'shop' && (
          <div className="space-y-6" id="recharge-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Select Recharge Package
                </h3>
                <p className="text-xs text-zinc-400">
                  Refill your virtual standard coin chest. Authorized payments are processed instantly.
                </p>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono italic">
                Secure SSL Handshake Ver. 4.12
              </span>
            </div>

            {/* Coin Packages grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coinPackages.map((pkg) => {
                const discount = pkg.original_cost_usd ? Math.round(((pkg.original_cost_usd - pkg.cost_usd) / pkg.original_cost_usd) * 100) : 0;
                return (
                  <div 
                    key={pkg.id}
                    className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                      pkg.popular 
                        ? 'border-violet-500 bg-gradient-to-b from-zinc-900/50 to-zinc-950/90 shadow-lg shadow-violet-500/5' 
                        : 'border-zinc-850 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full px-3.5 py-1 text-[8px] font-black uppercase tracking-wider shadow-md">
                        Best Choice Refill
                      </span>
                    )}

                    {discount > 0 && (
                      <span className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg px-2 py-0.5 text-[9px] font-bold">
                        Save {discount}%
                      </span>
                    )}

                    <div>
                      {/* Package Title badge */}
                      <span className="inline-block text-[8px] uppercase tracking-wider font-bold bg-zinc-900 text-zinc-400 px-2 py-0.75 rounded-full font-mono">
                        {pkg.badge || 'Refill Package'}
                      </span>
                      
                      {/* Coin Amount */}
                      <div className="flex items-center gap-2 mt-4">
                        <Coins className="h-7 w-7 text-amber-400 animate-pulse" />
                        <div>
                          <span className="text-2xl font-black text-white font-mono tracking-tight">
                            {pkg.coins.toLocaleString()}
                          </span>
                          <span className="block text-[9px] text-zinc-400 font-medium">Standard Coins 🪙</span>
                        </div>
                      </div>

                      {/* Package benefits list */}
                      <ul className="mt-5 space-y-1.5 text-[10px] text-zinc-400 border-t border-zinc-900 pt-4">
                        <li className="flex items-center gap-1.5 text-zinc-300">
                          <Check className="h-3.5 w-3.5 text-violet-400" /> Instant Vault Refill
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-violet-400" /> Unlock Priority Gifting List
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-violet-400" /> +{Math.round(pkg.coins / 10)} VIP EXP Points
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 space-y-3">
                      {/* Price tag */}
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase font-sans">Payment Amount:</span>
                        <div className="flex items-baseline gap-1.5">
                          {pkg.original_cost_usd && (
                            <span className="text-xs text-zinc-500 line-through">${pkg.original_cost_usd}</span>
                          )}
                          <span className="text-base font-black text-emerald-400 font-mono">${pkg.cost_usd}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handlePackageSelection(pkg.id)}
                        className={`w-full rounded-2xl py-2.5 text-xs font-bold tracking-wide transition duration-300 ${
                          pkg.popular 
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 shadow-md' 
                            : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-zinc-800'
                        }`}
                        id={`buy-package-${pkg.id}`}
                      >
                        Recharge Instantly
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Secure payment information notes */}
            <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-900 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-start gap-3.5">
                <div className="rounded-xl bg-violet-950/40 p-2.5 text-violet-400 shrink-0 border border-violet-900/30">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">PCI-DSS Compliant Payment handshakes</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                    All transaction streams are processed on simulated isolated sandbox containers. ConnectX integrates mock Stripe billing codes and Razorpay direct merchant checks. We never store raw debit details.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono text-zinc-500">PROVIDER PROTOCOLS:</span>
                <span className="rounded bg-zinc-900 px-2.5 py-1 text-[9px] font-bold font-mono text-zinc-400 border border-zinc-800">STRIPE_API</span>
                <span className="rounded bg-zinc-900 px-2.5 py-1 text-[9px] font-bold font-mono text-zinc-400 border border-zinc-800">RAZORPAY_3</span>
              </div>
            </div>
          </div>
        )}

        {/* DIAMOND CONVERSION TAB: Convert Received Diamonds */}
        {activeTab === 'convert' && (
          <div className="space-y-6" id="convert-section">
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950 p-6 sm:p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 mb-2">
                    <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    Exchange Diamonds for Standard Coins
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Virtual Diamonds received from messaging attachments and luxury profile tips can be converted back into Standard spendable Coins.
                  </p>
                </div>

                {/* Conversion Rate formula panel */}
                <div className="grid grid-cols-3 items-center gap-2 p-4 rounded-2xl bg-zinc-900/20 border border-zinc-900 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">Input Asset</span>
                    <strong className="text-sm text-cyan-400 font-mono">1 Diamond 💎</strong>
                  </div>
                  <div className="flex justify-center text-zinc-500">
                    <ArrowRightLeft className="h-5 w-5 text-violet-500 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">Output Granted</span>
                    <strong className="text-sm text-amber-400 font-mono">2 Coins 🪙</strong>
                  </div>
                </div>

                {/* Conversion form */}
                <form onSubmit={handleConvertDiamondsLocal} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-zinc-300 uppercase tracking-wider">
                        Amount of Diamonds to Exchange
                      </label>
                      <span className="font-mono text-zinc-400">
                        Available: <strong className="text-cyan-400">{currentUser.diamonds}</strong>
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <input 
                        type="number" 
                        value={diamondsToConvert}
                        onChange={(e) => setDiamondsToConvert(Math.max(0, Number(e.target.value)))}
                        className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-xs text-white outline-none focus:border-violet-500 font-mono font-bold"
                        min={10}
                        max={currentUser.diamonds}
                        required
                        placeholder="Diamonds count..."
                      />
                      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-zinc-400 font-mono flex items-center justify-center font-bold">
                        💎 Diamonds
                      </div>
                    </div>
                  </div>

                  {/* Percentage Quick Presets */}
                  <div className="flex gap-2">
                    {[
                      { label: '25%', val: 0.25 },
                      { label: '50%', val: 0.5 },
                      { label: '75%', val: 0.75 },
                      { label: '100% (MAX)', val: 1.0 }
                    ].map((pct) => (
                      <button
                        key={pct.label}
                        type="button"
                        onClick={() => handleConvertPercentage(pct.val)}
                        className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-zinc-300 py-1.5 transition"
                      >
                        {pct.label}
                      </button>
                    ))}
                  </div>

                  {/* Result Calculation feedback */}
                  <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-900 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-sans">Calculated Coins Output:</span>
                    <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-sm">
                      <Plus className="h-4 w-4" />
                      {(diamondsToConvert * 2).toLocaleString()} Coins 🪙
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={currentUser.diamonds < diamondsToConvert || diamondsToConvert <= 0}
                    className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-xs font-bold text-white hover:from-violet-500 hover:to-fuchsia-500 transition duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-violet-600/10"
                    id="execute-conversion-btn"
                  >
                    Forge into Coins Instantly
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* LEDGER TAB: Transaction Ledger History */}
        {activeTab === 'ledger' && (
          <div className="space-y-4" id="ledger-section">
            
            {/* Search, Filter Tag Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
              
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search transactions by reference or description..." 
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-850 bg-zinc-900/30 py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-violet-500 transition"
                />
              </div>

              {/* Tag filters */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'all', label: 'All Transactions' },
                  { key: 'refill', label: 'Refills & Purchases 🪙' },
                  { key: 'convert', label: 'Exchanges 💎' },
                  { key: 'gifting', label: 'Gifts Activity 🎁' }
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setLedgerFilter(pill.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition whitespace-nowrap ${
                      ledgerFilter === pill.key 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction List */}
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredTransactions.map((tx) => {
                  const isPositiveCoins = tx.amount_coins > 0;
                  const isPositiveDiamonds = tx.amount_diamonds > 0;
                  const formattedDate = new Date(tx.created_at).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={tx.id}
                      onClick={() => setSelectedTxForReceipt(tx)}
                      className="group rounded-2xl border border-zinc-900/60 bg-zinc-950/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-zinc-850 hover:bg-zinc-900/10 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2.5 shrink-0 ${
                          tx.type === 'buy_coins' || tx.type === 'daily_reward'
                            ? 'bg-amber-500/10 text-amber-400' 
                            : tx.type === 'convert_diamonds' 
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {tx.type === 'buy_coins' ? (
                            <CreditCard className="h-4.5 w-4.5" />
                          ) : tx.type === 'convert_diamonds' ? (
                            <ArrowRightLeft className="h-4.5 w-4.5" />
                          ) : tx.type === 'daily_reward' ? (
                            <Gift className="h-4.5 w-4.5 animate-bounce" />
                          ) : isPositiveDiamonds ? (
                            <ArrowDownLeft className="h-4.5 w-4.5" />
                          ) : (
                            <ArrowUpRight className="h-4.5 w-4.5" />
                          )}
                        </div>
                        
                        <div className="space-y-0.5">
                          <strong className="block text-zinc-100 text-xs font-semibold group-hover:text-violet-400 transition leading-snug">
                            {tx.description}
                          </strong>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                            <span>{formattedDate}</span>
                            <span className="text-zinc-700">•</span>
                            <span>Ref: {tx.id.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amounts Display & Action badge */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-zinc-900/30 pt-2 sm:pt-0 sm:border-0 shrink-0">
                        <div className="text-left sm:text-right font-mono font-bold text-xs space-y-0.5">
                          {tx.amount_coins !== 0 && (
                            <span className={`block ${isPositiveCoins ? 'text-amber-400' : 'text-zinc-400'}`}>
                              {isPositiveCoins ? '+' : ''}{tx.amount_coins.toLocaleString()} Coins
                            </span>
                          )}
                          {tx.amount_diamonds !== 0 && (
                            <span className={`block ${isPositiveDiamonds ? 'text-cyan-400' : 'text-zinc-400'}`}>
                              {isPositiveDiamonds ? '+' : ''}{tx.amount_diamonds.toLocaleString()} Diamonds
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-lg px-2.5 py-1 font-mono group-hover:bg-violet-950/20 group-hover:border-violet-800 group-hover:text-violet-300 transition shrink-0">
                          <FileText className="h-3 w-3 shrink-0" />
                          <span>Receipt</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl border border-zinc-900 bg-zinc-950">
                <Clock className="h-8 w-8 text-zinc-600 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-bold text-zinc-400 font-sans">No matching entries found.</p>
                <p className="text-[10px] text-zinc-600 max-w-xs mx-auto mt-1 leading-relaxed">
                  Adjust your search keyword or toggle between filters to display transaction entries.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RECHARGE / CHECKOUT DETAILED DRAWER MODAL */}
      <AnimatePresence>
        {selectedPackageId && paymentGateway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl relative"
            >
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-900/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-violet-400" />
                  <span className="font-display font-extrabold text-white text-xs uppercase tracking-wider">
                    ConnectX Secure Gateway
                  </span>
                </div>
                <button 
                  onClick={() => { setSelectedPackageId(null); setPaymentGateway(null); setPaymentStep('selection'); }}
                  className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Progress Tracker bar */}
              <div className="bg-zinc-900/30 px-6 py-2.5 border-b border-zinc-900 flex items-center gap-4 text-[9px] font-mono text-zinc-500">
                <span className={paymentStep === 'details' ? 'text-violet-400 font-bold' : ''}>1. BILLING</span>
                <ChevronRight className="h-3 w-3" />
                <span className={paymentStep === 'processing' ? 'text-violet-400 font-bold' : ''}>2. HANDSHAKE</span>
                <ChevronRight className="h-3 w-3" />
                <span className={paymentStep === 'success' ? 'text-emerald-400 font-bold' : ''}>3. PROVISION</span>
              </div>

              {/* DETAILS ENTRY VIEW */}
              {paymentStep === 'details' && (
                <form onSubmit={handleExecuteMockPurchase} className="p-6 space-y-4">
                  
                  {/* Select Payment Gateway Provider Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'stripe', label: 'Credit Card', icon: CreditCard, accent: 'border-violet-500 bg-violet-950/20 text-violet-300' },
                      { key: 'razorpay', label: 'Razorpay UPI', icon: Smartphone, accent: 'border-fuchsia-500 bg-fuchsia-950/20 text-fuchsia-300' },
                      { key: 'gpay', label: 'G-Pay Wallet', icon: Coins, accent: 'border-cyan-500 bg-cyan-950/20 text-cyan-300' }
                    ].map((gate) => (
                      <div 
                        key={gate.key}
                        onClick={() => setPaymentGateway(gate.key as any)}
                        className={`rounded-2xl border p-3.5 text-center cursor-pointer transition ${
                          paymentGateway === gate.key 
                            ? gate.accent 
                            : 'border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/10 text-zinc-400'
                        }`}
                      >
                        <gate.icon className="h-5 w-5 mx-auto mb-1.5" />
                        <span className="block text-[10px] font-bold tracking-tight uppercase">{gate.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary of what they buy */}
                  <div className="rounded-2xl bg-zinc-900/30 p-4 border border-zinc-900 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Recharge Vault Package:</span>
                      <strong className="text-white">
                        {coinPackages.find(p => p.id === selectedPackageId)?.coins.toLocaleString()} Coins
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Merchant Charge:</span>
                      <strong className="text-emerald-400 font-mono">
                        ${coinPackages.find(p => p.id === selectedPackageId)?.cost_usd}
                      </strong>
                    </div>
                  </div>

                  {/* Stripe Credit Card Form details fields */}
                  {paymentGateway === 'stripe' ? (
                    <div className="space-y-3 pt-1 border-t border-zinc-900">
                      
                      {/* Cardholder name */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">
                          Cardholder Full Name
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Sofia Velez"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full rounded-xl border border-zinc-850 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-violet-500"
                        />
                      </div>

                      {/* Card Number */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">
                          Card Account Number (16-Digit)
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full rounded-xl border border-zinc-850 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-violet-500 font-mono"
                        />
                      </div>

                      {/* Expiry & CVC in 2-cols */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">
                            Expiry Date
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            className="w-full rounded-xl border border-zinc-850 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-violet-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">
                            CVC / CVV
                          </label>
                          <input 
                            type="password"
                            required
                            placeholder="***"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            className="w-full rounded-xl border border-zinc-850 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-violet-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Priority switch */}
                      <div className="flex items-center gap-2 pt-2">
                        <input 
                          type="checkbox"
                          id="priorityBilling"
                          checked={priorityBilling}
                          onChange={(e) => setPriorityBilling(e.target.checked)}
                          className="rounded border-zinc-800 text-violet-600 bg-zinc-900"
                        />
                        <label htmlFor="priorityBilling" className="text-[10px] text-zinc-400 font-mono cursor-pointer select-none">
                          Enable priority secure checkout ledger handshakes (Free)
                        </label>
                      </div>

                    </div>
                  ) : (
                    /* Other wallets placeholder info banner */
                    <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-400 space-y-2">
                      <Smartphone className="h-8 w-8 text-zinc-500 mx-auto animate-pulse" />
                      <p className="text-xs font-bold text-white">Direct Mobile App Redirection</p>
                      <p className="text-[10px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                        Authorize via your secure sandbox device app. Once verified, standard Coins will instantly update.
                      </p>
                    </div>
                  )}

                  {/* Submission and Close controls row */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900">
                    <button 
                      type="button"
                      onClick={() => { setSelectedPackageId(null); setPaymentGateway(null); setPaymentStep('selection'); }}
                      className="px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition"
                    >
                      Cancel Transaction
                    </button>
                    <button 
                      type="submit"
                      className="rounded-2xl bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/10 flex items-center gap-1.5 transition"
                      id="checkout-pay-now-btn"
                    >
                      <Lock className="h-3.5 w-3.5" /> Confirm & Pay Now
                    </button>
                  </div>
                </form>
              )}

              {/* PROCESSING SECURE HANDSHAKE VIEW */}
              {paymentStep === 'processing' && (
                <div className="p-12 text-center space-y-6">
                  <div className="relative h-16 w-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-950" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
                  </div>
                  
                  <div className="space-y-2">
                    <strong className="block text-xs uppercase font-extrabold font-mono text-violet-400 tracking-widest">
                      Ledger Handshake Ingress...
                    </strong>
                    <div className="text-[10px] text-zinc-500 font-mono max-w-sm mx-auto space-y-1">
                      <p>🔐 Executing RSA-4096 Secure Socket Layer Tunnel...</p>
                      <p>🪙 Provisions check: Refill +{coinPackages.find(p => p.id === selectedPackageId)?.coins.toLocaleString()} Coins</p>
                      <p>📡 Handing checkout over to Stripe Gateway merchant hooks...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* RECHARGE SUCCESS VIEW */}
              {paymentStep === 'success' && (
                <div className="p-8 text-center space-y-6">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="h-8 w-8 text-emerald-400" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold text-white tracking-wide uppercase">
                      Recharge Vault Complete!
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      Your ConnectX Standard Coin Wallet has been credited. The purchase reference invoice transaction was successfully logged.
                    </p>
                  </div>

                  {/* Refill summary metrics */}
                  <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900 max-w-xs mx-auto text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Credited:</span>
                      <strong className="text-amber-400 font-bold">
                        +{coinPackages.find(p => p.id === selectedPackageId)?.coins.toLocaleString()} Coins
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Status:</span>
                      <strong className="text-emerald-400 font-bold uppercase">SUCCESS_AUTHORIZED</strong>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setSelectedPackageId(null); setPaymentGateway(null); setPaymentStep('selection'); }}
                    className="rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold py-2.5 px-6 transition border border-zinc-800"
                  >
                    Return to Treasury
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED RECEIPT / INVOICE MODAL POPUP */}
      <AnimatePresence>
        {selectedTxForReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative space-y-6"
            >
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-violet-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    ConnectX Ledger Receipt
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTxForReceipt(null)}
                  className="rounded-full p-1 text-zinc-500 hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Printable Invoice layout */}
              <div className="space-y-4 text-xs">
                
                {/* Branding banner */}
                <div className="bg-gradient-to-r from-violet-950/20 to-zinc-900/40 p-4 rounded-2xl border border-zinc-900 text-center space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">Transaction ID reference</span>
                  <strong className="block text-zinc-200 font-mono select-all text-sm uppercase">
                    CX-TX-{selectedTxForReceipt.id.slice(0, 16).toUpperCase()}
                  </strong>
                </div>

                {/* Grid values */}
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 border-b border-zinc-900 pb-4 font-mono text-[11px]">
                  
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500 font-sans tracking-wide">Account Holder:</span>
                    <span className="text-zinc-300 font-sans font-medium">{currentUser.display_name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500 font-sans tracking-wide">Username handle:</span>
                    <span className="text-zinc-400 font-semibold">@{currentUser.username}</span>
                  </div>

                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500 font-sans tracking-wide">Executed Date:</span>
                    <span className="text-zinc-400">{new Date(selectedTxForReceipt.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500 font-sans tracking-wide">Security Status:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <Check className="h-3 w-3 shrink-0" /> COMPLETED
                    </span>
                  </div>

                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500 font-sans tracking-wide">Action Type:</span>
                    <span className="text-violet-400 uppercase tracking-wider font-bold text-[10px]">{selectedTxForReceipt.type}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500 font-sans tracking-wide">Provider Method:</span>
                    <span className="text-zinc-400">CONNECTX_LEDGER_DB</span>
                  </div>

                </div>

                {/* Detailed descriptions / values list */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-sans">Statement Description</span>
                  <p className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-900 text-zinc-300 font-sans italic leading-relaxed">
                    "{selectedTxForReceipt.description}"
                  </p>
                </div>

                {/* Balance Alterations Summary */}
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-sans">Asset Alterations</span>
                  
                  {selectedTxForReceipt.amount_coins !== 0 && (
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-400">Coins Change:</span>
                      <strong className={selectedTxForReceipt.amount_coins > 0 ? 'text-amber-400' : 'text-zinc-300'}>
                        {selectedTxForReceipt.amount_coins > 0 ? '+' : ''}{selectedTxForReceipt.amount_coins.toLocaleString()} Coins
                      </strong>
                    </div>
                  )}

                  {selectedTxForReceipt.amount_diamonds !== 0 && (
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-400">Diamonds Change:</span>
                      <strong className={selectedTxForReceipt.amount_diamonds > 0 ? 'text-cyan-400' : 'text-zinc-300'}>
                        {selectedTxForReceipt.amount_diamonds > 0 ? '+' : ''}{selectedTxForReceipt.amount_diamonds.toLocaleString()} Diamonds
                      </strong>
                    </div>
                  )}
                </div>

              </div>

              {/* Action buttons: Download receipt PDF, print invoice, close */}
              <div className="flex gap-2 justify-end pt-2 border-t border-zinc-900">
                <button 
                  onClick={() => setSelectedTxForReceipt(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
                >
                  Close Receipt
                </button>
                <button 
                  onClick={() => triggerMockReceiptDownload(selectedTxForReceipt.id)}
                  disabled={isDownloadingReceipt}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/15 flex items-center gap-1.5 transition disabled:opacity-40"
                >
                  {isDownloadingReceipt ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Invoice</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
