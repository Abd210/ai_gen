'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import AmbientBackground from '@/components/AmbientBackground';
import { useToast } from '@/components/ToastProvider';
import {
  Wallet, Bitcoin, Bell, AlertTriangle, Check, RefreshCw,
  FileText, ChevronDown, Sparkles, Shield, Clock, Zap,
  ArrowRight, Copy, ExternalLink,
} from 'lucide-react';

const packages = [
  { id: 'starter', price: 5, credits: 1000, label: '$5', save: null },
  { id: 'popular', price: 50, credits: 10000, label: '$50', save: null, popular: true },
  { id: 'pro', price: 500, credits: 105000, label: '$500', save: '5%' },
  { id: 'enterprise', price: 1250, credits: 275000, label: '$1250', save: '10%' },
];

const transactions = [
  { date: '2026-03-26 01:20:14', credits: 1000, amount: 5 },
  { date: '2026-03-22 17:53:06', credits: 1000, amount: 5 },
  { date: '2026-03-15 09:12:33', credits: 5000, amount: 25 },
];

export default function BillingPage() {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState('popular');
  const [country, setCountry] = useState('Romania');
  const [zipCode, setZipCode] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const selectedPkg = packages.find((p) => p.id === selectedPackage)!;

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      toast(`Payment of $${selectedPkg.price} initiated — awaiting blockchain confirmation`, 'success');
    }, 2000);
  };

  return (
    <AppShell>
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Animated Background */}
        <AmbientBackground planet="saturn" intensity={0.5} />

        <div className="relative z-10 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-8 py-6 animate-fade-in">
            <h1 className="text-[28px] font-bold text-text-primary tracking-tight">Billing</h1>
            <p className="text-[13px] text-text-tertiary mt-1">Manage payment details</p>
          </div>

          <div className="px-8 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            {/* ═══ LEFT — Balance Information ═══ */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-6 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[16px] font-bold text-text-primary">Balance Information</h2>
                <button className="p-2 rounded-lg border border-border/40 text-text-tertiary hover:text-text-secondary hover:border-border transition-all">
                  <Bell size={14} />
                </button>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[36px] font-extrabold text-text-primary">78</span>
                  <span className="text-[14px] text-text-secondary ml-2">credits</span>
                </div>
                <span className="text-[12px] text-text-tertiary">Current Balance</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-text-tertiary mb-6">
                <AlertTriangle size={12} className="text-amber-400 shrink-0" />
                Credits never expire and can be used anytime
              </div>

              <div className="h-px bg-border/30 my-5" />

              {/* Rate Limit */}
              <h3 className="text-[14px] font-bold text-text-primary mb-3">Rate Limit</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed mb-4">
                Each account is limited to 20 new generation requests per 10 seconds(≈ 100+ concurrent tasks).
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                  <AlertTriangle size={11} className="text-amber-400 shrink-0" />
                  Enforced per account
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                  <AlertTriangle size={11} className="text-amber-400 shrink-0" />
                  Excess requests return HTTP 429 and are not queued
                </div>
              </div>

              <p className="text-[11px] text-text-tertiary leading-relaxed">
                This limit is sufficient for most users. If you consistently hit 429, contact support to request an increase (reviewed carefully).
              </p>
            </div>

            {/* ═══ RIGHT — Add Credits ═══ */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-6">
              <h2 className="text-[16px] font-bold text-text-primary mb-5">Add Credits</h2>

              {/* Select Package */}
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Select Package</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative rounded-xl border p-3 transition-all duration-200 text-left ${
                      selectedPackage === pkg.id
                        ? 'border-accent/50 bg-accent/10 shadow-sm shadow-accent/10'
                        : 'border-border/40 bg-surface/30 hover:border-border hover:bg-surface/50'
                    }`}
                  >
                    {pkg.save && (
                      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md bg-accent text-white text-[8px] font-bold uppercase transform rotate-12">
                        SAVE {pkg.save}
                      </div>
                    )}
                    <p className={`text-[18px] font-extrabold ${selectedPackage === pkg.id ? 'text-accent' : 'text-text-primary'}`}>
                      {pkg.label}
                    </p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">{pkg.credits.toLocaleString()} credits</p>
                  </button>
                ))}
              </div>

              {/* Payment Method */}
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Payment Method</p>
              <div className="mb-6">
                <button
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-accent/40 bg-accent/10 w-full transition-all"
                  style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                    <Bitcoin size={16} className="text-amber-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[13px] font-semibold text-text-primary">Crypto</p>
                    <p className="text-[10px] text-text-tertiary">Bitcoin, Ethereum, USDT</p>
                  </div>
                  <Check size={14} className="text-accent" />
                </button>
              </div>

              {/* Wallet Address */}
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Wallet Details</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl border border-border/40 bg-surface/30 px-3 py-2.5">
                  <label className="text-[9px] text-text-tertiary uppercase tracking-wider font-semibold">Country or Region</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-transparent text-[13px] text-text-primary outline-none mt-0.5 cursor-pointer"
                  >
                    <option value="Romania">Romania</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="rounded-xl border border-border/40 bg-surface/30 px-3 py-2.5">
                  <label className="text-[9px] text-text-tertiary uppercase tracking-wider font-semibold">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter zip code"
                    className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary outline-none mt-0.5"
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={isPaying}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-300 ${
                  isPaying
                    ? 'bg-accent/40 text-white/50 cursor-wait'
                    : 'bg-gradient-to-r from-accent to-purple-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent/25'
                }`}
                style={{
                  backgroundSize: '200% 100%',
                  animation: isPaying ? undefined : 'gradient-shift 3s ease infinite',
                }}
              >
                {isPaying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Bitcoin size={16} />
                    Pay with Crypto — ${selectedPkg.price}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ═══ Transaction History ═══ */}
          <div className="px-8 pb-12 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-text-primary">Transaction History</h2>
                <button
                  onClick={() => toast('Transactions refreshed', 'info')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-[11px] text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
                >
                  <RefreshCw size={12} />
                  Refresh
                </button>
              </div>

              <div className="rounded-xl border border-border/30 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-4 bg-surface/40 px-4 py-2.5 border-b border-border/30">
                  <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">DateTime</span>
                  <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider text-center">Credits</span>
                  <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider text-center">Amount</span>
                  <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider text-right">Invoice</span>
                </div>
                {/* Rows */}
                {transactions.map((tx, i) => (
                  <div key={i} className={`grid grid-cols-4 px-4 py-3 items-center ${i < transactions.length - 1 ? 'border-b border-border/20' : ''} hover:bg-surface/20 transition-colors`}>
                    <span className="text-[12px] text-text-secondary">{tx.date}</span>
                    <span className="text-[12px] text-text-primary font-medium text-center">{tx.credits.toLocaleString()}</span>
                    <span className="text-[12px] text-text-primary font-medium text-center">$ {tx.amount}</span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => toast('Invoice editor opened', 'info')}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent to-purple-600 text-white text-[11px] font-semibold hover:brightness-110 transition-all active:scale-[0.97]"
                      >
                        Edit Invoice Information
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
