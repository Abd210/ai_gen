'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import {
  Plus, FolderOpen, Clock, Trash2, ArrowRight, LayoutGrid,
  Search, SlidersHorizontal, Sparkles, Film, ImageIcon, Type,
  GitBranch, Zap, Copy, ChevronRight, Star, TrendingUp,
  X, Layers, Play, MoreHorizontal, Edit3, Grid, List,
} from 'lucide-react';
import { WorkflowProject } from '@/data/workflow-projects';
import { workflows, Workflow, buildTemplateProject } from '@/data/workflows';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'xenofield_workflow_projects';

function loadProjects(): WorkflowProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: WorkflowProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// ─── Workflow Template Card ──────────────────────────────
function TemplateCard({ workflow, onUse }: { workflow: Workflow; onUse: () => void }) {
  return (
    <div className="group relative rounded-2xl border border-border/60 bg-gradient-to-b from-surface/80 to-bg-tertiary/50 hover:border-border-strong transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${workflow.color}15 0%, transparent 60%)`,
        }}
      />
      {/* Top accent bar */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${workflow.color}, transparent)` }} />

      <div className="p-4 relative">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${workflow.color}18`, border: `1px solid ${workflow.color}30` }}
          >
            {workflow.icon}
          </div>
          {workflow.isPopular && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-accent/15 text-accent border border-accent/20">
              <TrendingUp size={8} />
              Popular
            </span>
          )}
        </div>

        <h3 className="text-[13px] font-semibold text-text-primary mb-1 group-hover:text-white transition-colors">
          {workflow.name}
        </h3>
        <p className="text-[11px] text-text-tertiary leading-relaxed mb-3 line-clamp-2">
          {workflow.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-md text-[9px] font-medium"
              style={{ background: `${workflow.color}15`, color: workflow.color, border: `1px solid ${workflow.color}25` }}
            >
              {workflow.category}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
              <Layers size={9} />
              {workflow.steps} steps
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onUse(); }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-surface border border-border text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <Zap size={9} />
            Use
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Project Card ───────────────────────────────────────
function ProjectCard({
  project,
  onOpen,
  onDelete,
  onDuplicate,
  onRename,
}: {
  project: WorkflowProject;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const nodeCount = project.nodes.length;
  const connCount = project.connections.length;
  const updated = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const nodeIcons = useMemo(() => {
    const types = new Set(project.nodes.map(n => n.type));
    return Array.from(types);
  }, [project.nodes]);

  return (
    <div
      onClick={onOpen}
      className="group relative rounded-2xl border border-border/60 bg-surface/50 hover:bg-surface-hover hover:border-border-strong transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Mini canvas preview */}
      <div className="h-36 bg-gradient-to-b from-[#0d0d0f] to-[#111113] flex items-center justify-center relative overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {nodeCount > 0 ? (
          <div className="relative w-full h-full p-4">
            {/* Mini node representations */}
            {project.nodes.slice(0, 5).map((node, i) => {
              const scale = 0.4;
              const x = 20 + (i % 3) * 60;
              const y = 15 + Math.floor(i / 3) * 50;
              return (
                <div
                  key={node.id}
                  className="absolute rounded-md border border-border/50 bg-[#1a1a1e]/80"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${node.width * scale}px`,
                    height: '36px',
                  }}
                >
                  <div className="flex items-center gap-1 px-2 py-1">
                    <span className="text-[8px]">
                      {node.type === 'text' ? '📝' : node.type === 'image' ? '🖼️' : '🎬'}
                    </span>
                    <span className="text-[7px] text-text-tertiary truncate">
                      {node.type}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Mini connection lines */}
            {project.connections.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {project.connections.slice(0, 3).map((conn) => {
                  const fromIdx = project.nodes.findIndex(n => n.id === conn.fromNodeId);
                  const toIdx = project.nodes.findIndex(n => n.id === conn.toNodeId);
                  if (fromIdx < 0 || toIdx < 0 || fromIdx >= 5 || toIdx >= 5) return null;
                  const fx = 20 + (fromIdx % 3) * 60 + 50;
                  const fy = 15 + Math.floor(fromIdx / 3) * 50 + 18;
                  const tx = 20 + (toIdx % 3) * 60;
                  const ty = 15 + Math.floor(toIdx / 3) * 50 + 18;
                  return (
                    <line
                      key={conn.id}
                      x1={fx} y1={fy} x2={tx} y2={ty}
                      stroke="rgba(200,255,0,0.3)"
                      strokeWidth={1}
                      strokeDasharray="3 2"
                    />
                  );
                })}
              </svg>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-tertiary">
            <LayoutGrid size={24} strokeWidth={1.5} className="opacity-40" />
            <span className="text-[10px] opacity-60">Empty canvas</span>
          </div>
        )}

        {/* Stats badges */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          <span className="px-1.5 py-0.5 rounded-md bg-bg-tertiary/80 backdrop-blur-sm text-[9px] text-text-tertiary font-medium border border-border/30">
            {nodeCount} node{nodeCount !== 1 && 's'}
          </span>
          {connCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-bg-tertiary/80 backdrop-blur-sm text-[9px] text-text-tertiary font-medium border border-border/30">
              <GitBranch size={7} className="inline mr-0.5" />{connCount}
            </span>
          )}
        </div>

        {/* Node type indicators */}
        <div className="absolute top-2 left-2 flex gap-1">
          {nodeIcons.map((type) => (
            <span key={type} className="px-1.5 py-0.5 rounded-md bg-bg-tertiary/60 backdrop-blur-sm text-[9px] border border-border/20">
              {type === 'text' ? '📝' : type === 'image' ? '🖼️' : '🎬'}
            </span>
          ))}
        </div>

        {/* Context menu button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-bg-tertiary/80 backdrop-blur-sm text-text-tertiary hover:text-text-primary transition-all border border-border/30 hover:border-border"
          >
            <MoreHorizontal size={12} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
              <div className="absolute top-full right-0 mt-1 w-36 bg-bg-secondary border border-border rounded-xl shadow-dropdown z-50 overflow-hidden py-1 animate-scale-in">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onOpen(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                >
                  <Play size={10} /> Open
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onRename(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                >
                  <Edit3 size={10} /> Rename
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDuplicate(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                >
                  <Copy size={10} /> Duplicate
                </button>
                <div className="h-px bg-border mx-2 my-0.5" />
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={10} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-accent transition-colors mb-1 truncate">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-[11px] text-text-tertiary mb-3 line-clamp-2">{project.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
            <Clock size={10} />
            {updated}
          </span>
          <div className="flex items-center gap-1 text-text-tertiary group-hover:text-accent transition-all">
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Rename Dialog ──────────────────────────────────────
function RenameDialog({
  project,
  onSave,
  onClose,
}: {
  project: WorkflowProject;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-6 bg-bg-secondary border border-border rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-text-primary">Rename Project</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all">
            <X size={14} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1.5">Project name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-[13px] text-text-primary outline-none focus:border-accent/40 placeholder:text-text-tertiary transition-all"
              onKeyDown={(e) => e.key === 'Enter' && onSave(name, description)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-[13px] text-text-primary outline-none focus:border-accent/40 placeholder:text-text-tertiary resize-none transition-all"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[12px] font-medium text-text-secondary hover:text-text-primary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(name, description)}
            className="px-5 py-2 rounded-xl bg-accent text-bg-primary text-[12px] font-semibold hover:brightness-110 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────
export default function WorkflowsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<WorkflowProject[]>([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [renamingProject, setRenamingProject] = useState<WorkflowProject | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const createProject = useCallback(() => {
    const project: WorkflowProject = {
      id: `proj_${Date.now()}`,
      name: newName.trim() || 'Untitled Project',
      description: newDescription.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [],
      connections: [],
    };
    const updated = [project, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setNewName('');
    setNewDescription('');
    setShowNewDialog(false);
    router.push(`/workflows/${project.id}`);
  }, [newName, newDescription, projects, router]);

  const createFromTemplate = useCallback(
    (template: Workflow) => {
      const { nodes, connections } = buildTemplateProject(template.id);
      const project: WorkflowProject = {
        id: `proj_${Date.now()}`,
        name: template.name,
        description: template.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodes,
        connections,
      };
      const updated = [project, ...projects];
      setProjects(updated);
      saveProjects(updated);
      router.push(`/workflows/${project.id}`);
    },
    [projects, router]
  );

  const deleteProject = useCallback(
    (id: string) => {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
    },
    [projects]
  );

  const duplicateProject = useCallback(
    (id: string) => {
      const original = projects.find((p) => p.id === id);
      if (!original) return;
      const duplicate: WorkflowProject = {
        ...original,
        id: `proj_${Date.now()}`,
        name: `${original.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [duplicate, ...projects];
      setProjects(updated);
      saveProjects(updated);
    },
    [projects]
  );

  const renameProject = useCallback(
    (id: string, name: string, description: string) => {
      const updated = projects.map((p) =>
        p.id === id ? { ...p, name, description, updatedAt: new Date().toISOString() } : p
      );
      setProjects(updated);
      saveProjects(updated);
      setRenamingProject(null);
    },
    [projects]
  );

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-10 overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/5 blur-[60px] pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/25 to-accent/5 flex items-center justify-center border border-accent/20">
                <GitBranch size={14} className="text-accent" />
              </div>
              <span className="text-[11px] font-semibold text-accent tracking-wider uppercase">Workflow Studio</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2 tracking-tight">
              Build AI media pipelines,{' '}
              <span className="text-gradient">visually.</span>
            </h1>
            <p className="text-[13px] text-text-tertiary leading-relaxed max-w-lg">
              Xenofield is a node-based workflow canvas for generating and chaining AI images and videos.
              Connect prompts, models, and outputs into reusable pipelines — no code required.
            </p>
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary px-3 py-1.5 rounded-lg bg-surface/80 border border-border/60 hover:border-border transition-all">
                <ImageIcon size={12} className="text-blue-400" />
                Image generation
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary px-3 py-1.5 rounded-lg bg-surface/80 border border-border/60 hover:border-border transition-all">
                <Film size={12} className="text-purple-400" />
                Video generation
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary px-3 py-1.5 rounded-lg bg-surface/80 border border-border/60 hover:border-border transition-all">
                <Sparkles size={12} className="text-amber-400" />
                Motion control
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary px-3 py-1.5 rounded-lg bg-surface/80 border border-border/60 hover:border-border transition-all">
                <Type size={12} className="text-green-400" />
                Text nodes
              </span>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="mb-10">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 mb-4 group"
          >
            <ChevronRight
              size={14}
              className={`text-text-tertiary transition-transform duration-200 ${showTemplates ? 'rotate-90' : ''}`}
            />
            <h2 className="text-[14px] font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
              Templates
            </h2>
            <span className="text-[10px] text-text-tertiary bg-surface px-2 py-0.5 rounded-full border border-border">
              {workflows.length}
            </span>
          </button>

          {showTemplates && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
              {workflows.map((wf) => (
                <TemplateCard
                  key={wf.id}
                  workflow={wf}
                  onUse={() => createFromTemplate(wf)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-[16px] font-semibold text-text-primary">Your Projects</h2>
              <span className="text-[11px] text-text-tertiary bg-surface px-2.5 py-0.5 rounded-full border border-border">
                {projects.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="pl-8 pr-3 py-2 w-52 rounded-xl bg-surface border border-border text-[12px] text-text-primary outline-none focus:border-accent/30 placeholder:text-text-tertiary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-tertiary hover:text-text-primary transition-all"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center bg-surface border border-border rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-accent/15 text-accent' : 'text-text-tertiary hover:text-text-secondary'}`}
                >
                  <Grid size={13} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent/15 text-accent' : 'text-text-tertiary hover:text-text-secondary'}`}
                >
                  <List size={13} />
                </button>
              </div>

              {/* New project */}
              <button
                onClick={() => setShowNewDialog(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-bg-primary text-[12px] font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
              >
                <Plus size={14} />
                New Project
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-2'
            }>
              {filteredProjects.map((proj) =>
                viewMode === 'grid' ? (
                  <ProjectCard
                    key={proj.id}
                    project={proj}
                    onOpen={() => router.push(`/workflows/${proj.id}`)}
                    onDelete={() => deleteProject(proj.id)}
                    onDuplicate={() => duplicateProject(proj.id)}
                    onRename={() => setRenamingProject(proj)}
                  />
                ) : (
                  /* List item view */
                  <div
                    key={proj.id}
                    onClick={() => router.push(`/workflows/${proj.id}`)}
                    className="group flex items-center gap-4 p-3 rounded-xl border border-border/60 bg-surface/30 hover:bg-surface-hover hover:border-border-strong transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0d0d0f] border border-border/30 flex items-center justify-center shrink-0">
                      <LayoutGrid size={16} className="text-text-tertiary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                        {proj.name}
                      </h3>
                      <p className="text-[11px] text-text-tertiary truncate">{proj.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-text-tertiary">
                        {proj.nodes.length} nodes
                      </span>
                      <span className="text-[10px] text-text-tertiary flex items-center gap-1">
                        <Clock size={9} />
                        {new Date(proj.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                      <ArrowRight size={14} className="text-text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : projects.length > 0 && searchQuery ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Search size={24} className="text-text-tertiary mb-3 opacity-40" />
              <h3 className="text-[14px] font-semibold text-text-primary mb-1">No results found</h3>
              <p className="text-[12px] text-text-tertiary">Try a different search term.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 relative">
              {/* Background decorations */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full bg-accent/3 blur-[40px]" />
              </div>

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface to-bg-tertiary border border-border flex items-center justify-center mb-4 mx-auto">
                  <LayoutGrid size={28} className="text-text-tertiary" />
                </div>
                <h3 className="text-[16px] font-semibold text-text-primary mb-1 text-center">No projects yet</h3>
                <p className="text-[12px] text-text-tertiary mb-6 text-center max-w-xs">
                  Create a project to start building your AI workflow pipeline, or begin from a template above.
                </p>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={() => setShowNewDialog(true)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-bg-primary text-[12px] font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
                  >
                    <Plus size={14} />
                    New Project
                  </button>
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border text-text-secondary text-[12px] font-medium hover:bg-surface-hover hover:text-text-primary transition-all"
                  >
                    <Sparkles size={14} />
                    Browse Templates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── New Project Dialog ────────────────────────────── */}
      {showNewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowNewDialog(false)} />
          <div className="relative z-10 w-full max-w-md mx-6 bg-bg-secondary border border-border rounded-2xl overflow-hidden animate-slide-up">
            {/* Dialog header glow */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/20">
                    <Plus size={14} className="text-accent" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-text-primary">New Project</h3>
                </div>
                <button
                  onClick={() => setShowNewDialog(false)}
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
                    Project name <span className="text-text-tertiary">*</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="My Workflow"
                    autoFocus
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-[13px] text-text-primary outline-none focus:border-accent/40 placeholder:text-text-tertiary transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && createProject()}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
                    Description <span className="text-text-tertiary">(optional)</span>
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="What does this workflow do?"
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-[13px] text-text-primary outline-none focus:border-accent/40 placeholder:text-text-tertiary resize-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowNewDialog(false)}
                  className="px-4 py-2 rounded-xl text-[12px] font-medium text-text-secondary hover:text-text-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  className="px-5 py-2 rounded-xl bg-accent text-bg-primary text-[12px] font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Rename Dialog ────────────────────────────────── */}
      {renamingProject && (
        <RenameDialog
          project={renamingProject}
          onSave={(name, desc) => renameProject(renamingProject.id, name, desc)}
          onClose={() => setRenamingProject(null)}
        />
      )}
    </AppShell>
  );
}
