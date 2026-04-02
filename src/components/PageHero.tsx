'use client';

import React from 'react';

interface PageHeroProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  description?: string;
}

export default function PageHero({ icon, title, subtitle, description }: PageHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12 animate-fade-in">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 shadow-glow">
          {icon}
        </div>
      )}
      <h1 className="text-2xl font-bold text-text-primary tracking-tight uppercase mb-1">
        {title}
      </h1>
      <h2 className="text-xl font-bold text-accent uppercase tracking-wide mb-3">
        {subtitle}
      </h2>
      {description && (
        <p className="text-sm text-text-tertiary max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}
