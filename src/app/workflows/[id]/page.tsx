'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
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

  useEffect(() => {
    const projects = loadProjects();
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setProject(found);
    } else {
      router.push('/workflows');
    }
  }, [projectId, router]);

  const handleUpdate = useCallback(
    (updated: WorkflowProject) => {
      setProject(updated);
      // Auto-save to localStorage
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
    setTimeout(() => setIsSaving(false), 800);
  }, [project]);

  if (!project) {
    return (
      <div className="w-screen h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0d0d0f]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-[#111113] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/workflows')}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[14px] font-semibold text-text-primary leading-tight">{project.name}</h1>
            {project.description && (
              <p className="text-[10px] text-text-tertiary leading-tight">{project.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
            isSaving
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
          }`}
        >
          <Save size={12} />
          <span>{isSaving ? 'Saved!' : 'Save'}</span>
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas project={project} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
