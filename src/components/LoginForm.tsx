'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Sparkles, Zap, Image, Video, Wand2 } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for realism
    await new Promise((r) => setTimeout(r, 600));

    const result = login(username, password);
    if (result.success) {
      router.replace('/image');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  // Generate particles positions deterministically
  const particles = Array.from({ length: 25 }, (_, i) => ({
    left: `${(i * 17 + 13) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    delay: `${(i * 0.8) % 6}s`,
    duration: `${4 + (i % 4) * 1.5}s`,
    size: 2 + (i % 3) * 2,
  }));

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden">
      {/* ── Premium Animated Background ── */}
      {/* Morphing gradient orbs */}
      <div
        className="absolute w-[700px] h-[700px] -top-[200px] -left-[200px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(88, 28, 180, 0.1) 40%, transparent 70%)',
          animation: 'morph 18s ease-in-out infinite, ambient-drift 25s ease-in-out infinite',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] -bottom-[150px] -right-[150px] opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)',
          animation: 'morph 22s ease-in-out infinite reverse, ambient-drift 30s ease-in-out infinite reverse',
          borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%',
          filter: 'blur(70px)',
          animationDelay: '3s',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] top-[20%] right-[15%] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)',
          animation: 'morph 15s ease-in-out infinite, ambient-drift 20s ease-in-out infinite',
          borderRadius: '50% 60% 30% 60% / 30% 40% 70% 60%',
          filter: 'blur(50px)',
          animationDelay: '5s',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] bottom-[30%] left-[20%] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          animation: 'morph 20s ease-in-out infinite reverse, ambient-drift 18s ease-in-out infinite',
          borderRadius: '60% 30% 60% 40% / 70% 50% 40% 60%',
          filter: 'blur(60px)',
          animationDelay: '7s',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="login-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background: i % 3 === 0
              ? 'rgba(168, 85, 247, 0.5)'
              : i % 3 === 1
              ? 'rgba(59, 130, 246, 0.4)'
              : 'rgba(236, 72, 153, 0.4)',
          }}
        />
      ))}

      {/* Mesh gradient overlay with slow hue rotation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.05), rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.1))',
          animation: 'hue-rotate-slow 30s linear infinite',
        }}
      />

      {/* Noise texture overlay for depth */}
      <div className="noise-overlay" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-md mx-6 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15 shadow-glow-accent overflow-hidden" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
              <img src="/xenofield-icon.png" alt="Xenofield" className="w-10 h-10 object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Xenofield</h1>
          <p className="text-sm text-text-tertiary mt-2 max-w-xs mx-auto">
            AI-powered creative studio for image and video generation
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-2xl p-8" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}>
          <h2 className="text-lg font-semibold text-text-primary mb-1">Welcome back</h2>
          <p className="text-[13px] text-text-tertiary mb-6">Sign in to access your creative workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-1.5 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[14px] text-text-primary outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-tertiary"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[14px] text-text-primary outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-tertiary pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-border bg-surface accent-accent"
              />
              <label htmlFor="remember" className="text-[12px] text-text-tertiary cursor-pointer">Remember me</label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-[12px] font-medium animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 rounded-xl text-[14px] font-bold transition-all duration-200
                flex items-center justify-center gap-2
                ${isLoading
                  ? 'bg-accent/50 text-bg-primary/60 cursor-wait'
                  : 'bg-accent text-bg-primary hover:bg-accent-hover active:scale-[0.98] shadow-glow-accent'
                }
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in</span>
                  <Sparkles size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feature bullets */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: <Image size={16} />, label: 'Image Gen' },
            { icon: <Video size={16} />, label: 'Video Gen' },
            { icon: <Wand2 size={16} />, label: 'Workflows' },
          ].map((feat) => (
            <div key={feat.label} className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-border/50 bg-surface/30 backdrop-blur-sm">
              <div className="text-accent">{feat.icon}</div>
              <span className="text-[11px] text-text-tertiary font-medium">{feat.label}</span>
            </div>
          ))}
        </div>

        {/* Demo credentials */}
        <p className="text-center text-[11px] text-text-tertiary mt-6">
          Demo: <span className="text-text-secondary">user</span> / <span className="text-text-secondary">123</span>
        </p>
      </div>
    </div>
  );
}
