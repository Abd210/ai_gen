'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { workflows } from '@/data/workflows';
import { ArrowRight, Zap, Star } from 'lucide-react';

function WorkflowCard({ workflow }: { workflow: typeof workflows[0] }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-surface hover:bg-surface-hover transition-all duration-200 overflow-hidden cursor-pointer hover:border-border-strong">
      {/* Color accent bar */}
      <div className="h-1 w-full" style={{ background: workflow.color }} />

      <div className="p-5">
        {/* Header with icon & badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${workflow.color}15`, border: `1px solid ${workflow.color}30` }}>
            {workflow.icon}
          </div>
          {workflow.isPopular && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-dim text-accent border border-accent/20">
              <Star size={10} fill="currentColor" />
              Popular
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-semibold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
          {workflow.name}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-text-tertiary leading-relaxed mb-4">
          {workflow.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-bg-tertiary text-[10px] text-text-tertiary font-medium">
              {workflow.steps} steps
            </span>
            <span className="px-2 py-0.5 rounded-md bg-bg-tertiary text-[10px] text-text-tertiary font-medium">
              {workflow.category}
            </span>
          </div>
          <ArrowRight size={14} className="text-text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Workflows</h1>
          <p className="text-sm text-text-tertiary">Automate complex creative processes with pre-built and custom workflows</p>
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {['All', 'Popular', 'E-Commerce', 'Marketing', 'Art', 'Branding'].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${
                i === 0
                  ? 'bg-accent-dim text-accent border border-accent/20'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
