'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Play, Zap, Settings2, Share2,
  CheckCircle, Loader2, ChevronDown, Edit3, X,
} from 'lucide-react';
import { WorkflowProject } from '@/data/workflow-projects';
import WorkflowCanvas from '@/components/WorkflowCanvas';

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

export default function WorkflowCanvasPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<WorkflowProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const projects = loadProjects();
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setProject(found);
      setEditName(found.name);
    } else {
      router.push('/workflows');
    }
  }, [projectId, router]);

  const handleUpdate = useCallback(
    (updated: WorkflowProject) => {
      setProject(updated);
      const projects = loadProjects();
      const idx = projects.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        projects[idx] = updated;
      } else {
        projects.unshift(updated);
      }
      saveProjects(projects);
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!project) return;
    setIsSaving(true);
    const projects = loadProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = { ...project, updatedAt: new Date().toISOString() };
    }
    saveProjects(projects);
    setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    setTimeout(() => setIsSaving(false), 1000);
  }, [project]);

  const handleRename = useCallback(() => {
    if (!project || !editName.trim()) return;
    const updated = { ...project, name: editName.trim(), updatedAt: new Date().toISOString() };
    setProject(updated);
    const projects = loadProjects();
    const idx = projects.findIndex((p) => p.id === updated.id);
    if (idx >= 0) {
      projects[idx] = updated;
    }
    saveProjects(projects);
    setIsEditing(false);
  }, [project, editName]);

  if (!project) {
    return (
      <div className="w-screen h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-[12px] text-text-tertiary">Loading project...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0d0d0f]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-[#111113] shrink-0">
        {/* Left section */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/workflows')}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all shrink-0"
            title="Back to projects"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Project name - editable */}
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') { setIsEditing(false); setEditName(project.name); }
                }}
                autoFocus
                className="text-[14px] font-semibold text-text-primary bg-surface border border-accent/30 rounded-lg px-2 py-0.5 outline-none w-48"
              />
              <button
                onClick={handleRename}
                className="p-1 rounded text-accent hover:bg-accent/10 transition-all"
              >
                <CheckCircle size={14} />
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditName(project.name); }}
                className="p-1 rounded text-text-tertiary hover:text-text-secondary transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0 group">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-[14px] font-semibold text-text-primary leading-tight truncate">
                    {project.name}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-tertiary hover:text-text-primary transition-all"
                  >
                    <Edit3 size={10} />
                  </button>
                </div>
                {project.description && (
                  <p className="text-[10px] text-text-tertiary leading-tight truncate">{project.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Status indicators */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-[10px] text-text-tertiary bg-surface/50 px-2 py-0.5 rounded-md border border-border/30">
              {project.nodes.length} nodes
            </span>
            <span className="flex items-center gap-1 text-[10px] text-text-tertiary bg-surface/50 px-2 py-0.5 rounded-md border border-border/30">
              {project.connections.length} connections
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 shrink-0">
          {lastSaved && (
            <span className="text-[10px] text-text-tertiary flex items-center gap-1">
              <CheckCircle size={9} className="text-green-400" />
              Saved {lastSaved}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              isSaving
                ? 'bg-accent/15 text-accent border border-accent/25'
                : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {isSaving ? (
              <>
                <CheckCircle size={12} className="text-accent" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={12} />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-bg-primary text-[11px] font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
            title="Run entire workflow"
          >
            <Zap size={12} />
            <span>Run Workflow</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas project={project} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
