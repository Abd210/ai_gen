'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/image');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15 shadow-glow-accent animate-pulse-glow">
        <img src="/xenofield-icon.png" alt="Xenofield" className="w-10 h-10 object-contain" />
      </div>
      <div className="w-6 h-6 border-2 border-accent/50 border-t-accent rounded-full animate-spin" />
    </div>
  );
}
