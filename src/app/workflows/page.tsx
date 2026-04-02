'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Plus, FolderOpen, Clock, Trash2, ArrowRight, LayoutGrid } from 'lucide-react';
import { WorkflowProject } from '@/data/workflow-projects';
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

function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: WorkflowProject;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const nodeCount = project.nodes.length;
  const connCount = project.connections.length;
  const updated = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={onOpen}
      className="group relative rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Preview area */}
      <div className="h-36 bg-black/30 flex items-center justify-center relative">
        <div className="flex items-center gap-3 text-text-tertiary">
          <LayoutGrid size={28} strokeWidth={1.5} />
        </div>
        {/* Node count badges */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          <span className="px-1.5 py-0.5 rounded bg-bg-tertiary text-[9px] text-text-tertiary font-medium border border-border/50">
            {nodeCount} node{nodeCount !== 1 && 's'}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-bg-tertiary text-[9px] text-text-tertiary font-medium border border-border/50">
            {connCount} connection{connCount !== 1 && 's'}
          </span>
        </div>
        {/* Delete button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
        >
          <Trash2 size={12} />
        </button>
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
          <ArrowRight size={12} className="text-text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<WorkflowProject[]>([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

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

  const deleteProject = useCallback(
    (id: string) => {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
    },
    [projects]
  );

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Build AI media pipelines, visually.
          </h1>
          <p className="text-[13px] text-text-tertiary leading-relaxed max-w-lg">
            Xenofield is a node-based workflow canvas for generating and chaining AI images and videos.
            Connect prompts, models, and outputs into reusable pipelines — no code required.
          </p>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-text-tertiary px-2.5 py-1 rounded-lg bg-surface border border-border">
              🖼️ Image generation
            </span>
            <span className="flex items-center gap-1 text-[11px] text-text-tertiary px-2.5 py-1 rounded-lg bg-surface border border-border">
              🎬 Video generation
            </span>
            <span className="flex items-center gap-1 text-[11px] text-text-tertiary px-2.5 py-1 rounded-lg bg-surface border border-border">
              ✨ Motion control
            </span>
          </div>
        </div>

        {/* Projects header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-semibold text-text-primary">Projects</h2>
          <button
            onClick={() => setShowNewDialog(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-bg-primary text-[12px] font-semibold hover:brightness-110 transition-all"
          >
            <Plus size={14} />
            New Project
          </button>
        </div>

        {/* Projects grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onOpen={() => router.push(`/workflows/${proj.id}`)}
                onDelete={() => deleteProject(proj.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
              <LayoutGrid size={24} className="text-text-tertiary" />
            </div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-1">No projects yet</h3>
            <p className="text-[12px] text-text-tertiary mb-5">Create a project to start building a workflow canvas.</p>
            <button
              onClick={() => setShowNewDialog(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-text-primary text-[12px] font-medium hover:bg-surface-hover transition-all"
            >
              <Plus size={14} />
              New Project
            </button>
          </div>
        )}
      </div>

      {/* New Project Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowNewDialog(false)} />
          <div className="relative z-10 w-full max-w-md mx-6 bg-bg-secondary border border-border rounded-2xl p-6 animate-slide-up">
            <h3 className="text-[16px] font-semibold text-text-primary mb-4">New Project</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1.5">Project name</label>
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
                <label className="block text-[11px] font-medium text-text-secondary mb-1.5">Description (optional)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What does this workflow do?"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-[13px] text-text-primary outline-none focus:border-accent/40 placeholder:text-text-tertiary resize-none transition-all"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowNewDialog(false)}
                className="px-4 py-2 rounded-xl text-[12px] font-medium text-text-secondary hover:text-text-primary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-5 py-2 rounded-xl bg-accent text-bg-primary text-[12px] font-semibold hover:brightness-110 transition-all"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
