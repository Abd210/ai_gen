'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import AmbientBackground from '@/components/AmbientBackground';
import { useToast } from '@/components/ToastProvider';
import { useAuth } from '@/context/AuthContext';
import { useGenerations } from '@/context/GenerationContext';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Users, Image as ImageIcon, Video, Key,
  Plus, Trash2, Eye, EyeOff, Copy, Check, X, Settings,
  Activity, Clock, ChevronDown, Search, BarChart3,
  Ban, CheckCircle, AlertTriangle, RefreshCw, Download,
  Globe, Zap, Database, Server, Mail, DollarSign,
  ToggleLeft, ToggleRight, Filter, ArrowUpDown,
} from 'lucide-react';

// Dummy users for admin display
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  generationCount: number;
  lastActive: string;
  status: 'active' | 'suspended';
}

const initialUsers: AdminUser[] = [
  { id: 'u1', username: 'abdalrahman1232023', email: 'abdalrahman1232023@gmail.com', role: 'user', balance: 0.00, generationCount: 12, lastActive: '2 min ago', status: 'active' },
  { id: 'u2', username: 'sarah_designer', email: 'sarah@design.io', role: 'user', balance: 25.50, generationCount: 48, lastActive: '15 min ago', status: 'active' },
  { id: 'u3', username: 'mike_creator', email: 'mike@create.co', role: 'user', balance: 10.00, generationCount: 23, lastActive: '1 hour ago', status: 'active' },
  { id: 'u4', username: 'lisa_photo', email: 'lisa@photos.net', role: 'user', balance: 5.75, generationCount: 67, lastActive: '3 hours ago', status: 'active' },
  { id: 'u5', username: 'demo_user', email: 'demo@xenofield.com', role: 'user', balance: 0.00, generationCount: 0, lastActive: '1 week ago', status: 'suspended' },
  { id: 'u6', username: 'admin', email: 'admin@xenofield.com', role: 'admin', balance: 999.99, generationCount: 5, lastActive: 'Now', status: 'active' },
];

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  assignedTo: 'all' | string;
  createdAt: string;
  isVisible: boolean;
  usageCount: number;
  status: 'active' | 'expired';
}

type AdminTab = 'overview' | 'users' | 'generations' | 'keys' | 'settings';

export default function AdminPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { generations } = useGenerations();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [userSearch, setUserSearch] = useState('');
  const [genFilter, setGenFilter] = useState<'all' | 'image' | 'video'>('all');

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'k1', name: 'OpenAI GPT-4', key: 'sk-proj-abc123def456ghi789', provider: 'OpenAI', assignedTo: 'all', createdAt: '2 days ago', isVisible: false, usageCount: 243, status: 'active' },
    { id: 'k2', name: 'Stability AI XL', key: 'sk-stab-xyz789qrs456tuv', provider: 'Stability', assignedTo: 'all', createdAt: '5 days ago', isVisible: false, usageCount: 127, status: 'active' },
    { id: 'k3', name: 'Kling Video', key: 'kl-vid-mno321pqr654wxy', provider: 'Kling', assignedTo: 'sarah_designer', createdAt: '1 week ago', isVisible: false, usageCount: 56, status: 'active' },
  ]);

  // New key form
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyProvider, setNewKeyProvider] = useState('OpenAI');
  const [newKeyAssign, setNewKeyAssign] = useState('all');
  const [assignSearch, setAssignSearch] = useState('');
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    registrationOpen: true,
    maintenanceMode: false,
    maxGenerationsPerDay: 50,
    defaultCredits: 10,
    autoApproveUsers: true,
    enableCommunitySharing: true,
    enableVideoGeneration: true,
    enableAudioGeneration: true,
    rateLimitPerMinute: 10,
  });

  // Guard: redirect non-admins
  if (!user?.isAdmin) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ShieldCheck size={48} className="text-text-tertiary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Admin Access Required</h2>
            <p className="text-sm text-text-tertiary mb-6">You don&apos;t have permission to view this page.</p>
            <button onClick={() => router.push('/image')} className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all">Go Back</button>
          </div>
        </div>
      </AppShell>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity size={13} /> },
    { id: 'users', label: 'Users', icon: <Users size={13} /> },
    { id: 'generations', label: 'Generations', icon: <ImageIcon size={13} /> },
    { id: 'keys', label: 'API Keys', icon: <Key size={13} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={13} /> },
  ];

  const imageCount = generations.filter((g) => g.type === 'image').length;
  const videoCount = generations.filter((g) => g.type === 'video').length;
  const totalImages = generations.reduce((sum, g) => sum + g.images.length, 0);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredGenerations = genFilter === 'all' ? generations : generations.filter((g) => g.type === genFilter);

  // Assign search for key creation
  const assignOptions = [
    { value: 'all', label: 'All Users', email: '' },
    ...users.filter((u) => u.role !== 'admin').map((u) => ({ value: u.username, label: u.username, email: u.email })),
  ];
  const filteredAssignOptions = assignOptions.filter((o) =>
    o.label.toLowerCase().includes(assignSearch.toLowerCase()) ||
    o.email.toLowerCase().includes(assignSearch.toLowerCase())
  );

  const handleAddKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast('Please fill in all fields', 'warning');
      return;
    }
    const key: ApiKey = {
      id: `k-${Date.now()}`,
      name: newKeyName.trim(),
      key: newKeyValue.trim(),
      provider: newKeyProvider,
      assignedTo: newKeyAssign,
      createdAt: 'Just now',
      isVisible: false,
      usageCount: 0,
      status: 'active',
    };
    setApiKeys((prev) => [key, ...prev]);
    setNewKeyName('');
    setNewKeyValue('');
    setNewKeyAssign('all');
    setAssignSearch('');
    setShowNewKey(false);
    toast('API key added successfully!', 'success');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast('API key deleted', 'info');
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys((prev) => prev.map((k) => k.id === id ? { ...k, isVisible: !k.isVisible } : k));
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        toast(`User ${u.username} ${newStatus === 'active' ? 'activated' : 'suspended'}`, newStatus === 'active' ? 'success' : 'warning');
        return { ...u, status: newStatus as 'active' | 'suspended' };
      }
      return u;
    }));
  };

  const toggleUserRole = (id: string) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id === id && u.username !== 'admin') {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        toast(`${u.username} is now ${newRole}`, 'info');
        return { ...u, role: newRole as 'admin' | 'user' };
      }
      return u;
    }));
  };

  return (
    <AppShell>
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Background */}
        <AmbientBackground planet="mars" intensity={0.4} />

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 md:px-8 py-4 md:py-5 flex items-center justify-between shrink-0 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-accent/10 flex items-center justify-center border border-red-500/15">
                <ShieldCheck size={18} className="text-red-400" />
              </div>
              <div>
                <h1 className="text-[18px] md:text-[22px] font-bold text-text-primary tracking-tight">Admin Panel</h1>
                <p className="text-[12px] text-text-tertiary">Manage users, generations, keys & settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {settings.maintenanceMode && (
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400 animate-pulse">⚠ MAINTENANCE</span>
              )}
              <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-semibold text-red-400">ADMIN</span>
              <span className="text-[12px] text-text-secondary hidden md:inline">{user.email}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 md:px-8 flex items-center gap-1 border-b border-border/30 shrink-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-[12px] font-medium transition-all border-b-2 -mb-[1px] ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">

            {/* ───── OVERVIEW TAB ───── */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: 'Total Users', value: users.length.toString(), icon: <Users size={16} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', sub: `${users.filter(u => u.status === 'active').length} active` },
                    { label: 'Total Generations', value: generations.length.toString(), icon: <BarChart3 size={16} />, color: 'text-accent bg-accent/10 border-accent/20', sub: 'this session' },
                    { label: 'Images Created', value: totalImages.toString(), icon: <ImageIcon size={16} />, color: 'text-green-400 bg-green-500/10 border-green-500/20', sub: `${imageCount} batches` },
                    { label: 'Videos Created', value: videoCount.toString(), icon: <Video size={16} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', sub: 'clips generated' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4 md:p-5 hover:border-border transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <p className="text-[20px] md:text-[26px] font-bold text-text-primary">{stat.value}</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">{stat.label}</p>
                      <p className="text-[9px] text-text-tertiary mt-1">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions + System Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quick Actions */}
                  <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                    <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                    <div className="px-5 py-4 border-b border-border/30">
                      <h3 className="text-[14px] font-bold text-text-primary flex items-center gap-2"><Zap size={14} className="text-accent" /> Quick Actions</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {[
                        { label: 'Export Data', icon: <Download size={12} />, action: () => toast('Data exported to CSV', 'success') },
                        { label: 'Clear Cache', icon: <RefreshCw size={12} />, action: () => toast('Cache cleared successfully', 'success') },
                        { label: 'Send Broadcast', icon: <Mail size={12} />, action: () => toast('Broadcast sent to all users', 'success') },
                        { label: 'Run Diagnostics', icon: <Activity size={12} />, action: () => toast('All systems healthy ✓', 'success') },
                      ].map((a) => (
                        <button key={a.label} onClick={a.action} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-all">
                          {a.icon} {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                    <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
                    <div className="px-5 py-4 border-b border-border/30">
                      <h3 className="text-[14px] font-bold text-text-primary flex items-center gap-2"><Server size={14} className="text-green-400" /> System Status</h3>
                    </div>
                    <div className="p-4 space-y-2.5">
                      {[
                        { label: 'API Gateway', status: 'operational' },
                        { label: 'Image Pipeline', status: 'operational' },
                        { label: 'Video Pipeline', status: 'operational' },
                        { label: 'Database', status: 'operational' },
                        { label: 'CDN / Storage', status: 'operational' },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface/30">
                          <span className="text-[11px] text-text-secondary">{s.label}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-medium text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            Operational
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                  <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                  <div className="px-5 py-4 border-b border-border/30">
                    <h3 className="text-[14px] font-bold text-text-primary">Recent Activity</h3>
                  </div>
                  <div className="divide-y divide-border/20">
                    {generations.slice(0, 6).map((gen) => (
                      <div key={gen.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg" style={{ background: gen.images[0]?.gradient || '#333' }} />
                          <div>
                            <p className="text-[12px] text-text-primary font-medium line-clamp-1 max-w-[300px]">{gen.prompt}</p>
                            <p className="text-[10px] text-text-tertiary">{gen.model} • {gen.images.length} output{gen.images.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${gen.type === 'image' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{gen.type.toUpperCase()}</span>
                          <span className="text-[10px] text-text-tertiary flex items-center gap-1"><Clock size={8} />{new Date(gen.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                    {generations.length === 0 && (
                      <div className="px-5 py-10 text-center text-[12px] text-text-tertiary">No generations yet — generate some images or videos first</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ───── USERS TAB ───── */}
            {activeTab === 'users' && (
              <div className="animate-fade-in space-y-4">
                {/* Search + Stats */}
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-[400px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users by name or email..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border text-[12px] text-text-primary outline-none focus:border-accent/30 placeholder:text-text-tertiary transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-text-tertiary flex items-center gap-1"><CheckCircle size={10} className="text-green-400" />{users.filter(u => u.status === 'active').length} active</span>
                    <span className="text-[10px] text-text-tertiary flex items-center gap-1"><Ban size={10} className="text-red-400" />{users.filter(u => u.status === 'suspended').length} suspended</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                  <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-7 gap-3 px-5 py-2.5 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider border-b border-border/20">
                    <span>User</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Balance</span>
                    <span>Generations</span>
                    <span>Actions</span>
                  </div>
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="hidden md:grid grid-cols-7 gap-3 px-5 py-3 items-center border-b border-border/10 hover:bg-surface/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] text-text-primary font-medium truncate">{u.username}</span>
                      </div>
                      <span className="text-[10px] text-text-secondary truncate">{u.email}</span>
                      <button onClick={() => toggleUserRole(u.id)} className={`text-[9px] font-semibold px-2 py-0.5 rounded-full w-fit cursor-pointer transition-all ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'}`}>
                        {u.role}
                      </button>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full w-fit ${u.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {u.status}
                      </span>
                      <span className="text-[11px] text-text-primary">${u.balance.toFixed(2)}</span>
                      <span className="text-[11px] text-text-secondary">{u.generationCount}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleUserStatus(u.id)} title={u.status === 'active' ? 'Suspend user' : 'Activate user'} className={`p-1.5 rounded-lg transition-all ${u.status === 'active' ? 'text-text-tertiary hover:text-amber-400 hover:bg-amber-500/10' : 'text-text-tertiary hover:text-green-400 hover:bg-green-500/10'}`}>
                          {u.status === 'active' ? <Ban size={12} /> : <CheckCircle size={12} />}
                        </button>
                        <button onClick={() => toast(`Viewing profile for ${u.username}`, 'info')} className="p-1.5 rounded-lg text-text-tertiary hover:text-accent hover:bg-accent/10 transition-all">
                          <Eye size={12} />
                        </button>
                        <button onClick={() => toast(`Email sent to ${u.email}`, 'success')} className="p-1.5 rounded-lg text-text-tertiary hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                          <Mail size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Mobile user cards */}
                  {filteredUsers.map((u) => (
                    <div key={`m-${u.id}`} className="md:hidden p-4 border-b border-border/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[12px] text-text-primary font-medium">{u.username}</p>
                            <p className="text-[10px] text-text-tertiary truncate max-w-[160px]">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>{u.role}</span>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{u.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-text-tertiary">
                        <span>${u.balance.toFixed(2)} · {u.generationCount} gens</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleUserStatus(u.id)} className="p-1.5 rounded-lg text-text-tertiary hover:text-accent transition-all"><Ban size={12} /></button>
                          <button onClick={() => toggleUserRole(u.id)} className="p-1.5 rounded-lg text-text-tertiary hover:text-accent transition-all"><ShieldCheck size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="px-5 py-10 text-center text-[12px] text-text-tertiary">No users match your search</div>
                  )}
                </div>
              </div>
            )}

            {/* ───── GENERATIONS TAB ───── */}
            {activeTab === 'generations' && (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-text-primary">All Generations ({filteredGenerations.length})</h3>
                  <div className="flex items-center gap-2">
                    {(['all', 'image', 'video'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setGenFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${genFilter === f ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-tertiary hover:text-text-secondary border border-transparent'}`}
                      >
                        {f === 'all' && <Filter size={10} className="inline mr-1" />}
                        {f === 'image' && <ImageIcon size={10} className="inline mr-1" />}
                        {f === 'video' && <Video size={10} className="inline mr-1" />}
                        {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? generations.length : generations.filter(g => g.type === f).length})
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredGenerations.map((gen) => (
                    <div key={gen.id} className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden group hover:border-border transition-colors">
                      <div className="aspect-square relative" style={{ background: gen.images[0]?.gradient || 'linear-gradient(135deg, #333, #222)' }}>
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-semibold ${gen.type === 'image' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {gen.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="px-1.5 py-0.5 rounded-full bg-black/50 text-white text-[8px]">{gen.images.length} img{gen.images.length !== 1 ? 's' : ''}</span>
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => toast('Image downloaded', 'success')} className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"><Download size={14} /></button>
                          <button onClick={() => toast('Generation deleted', 'warning')} className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-red-500/50 transition-all"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[11px] text-text-primary line-clamp-1 mb-1">{gen.prompt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-text-tertiary">{gen.model}</span>
                          <span className="text-[9px] text-text-tertiary">{new Date(gen.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredGenerations.length === 0 && (
                  <div className="text-center py-16">
                    <ImageIcon size={32} className="text-text-tertiary mx-auto mb-3" />
                    <p className="text-[13px] text-text-tertiary">No generations yet</p>
                  </div>
                )}
              </div>
            )}

            {/* ───── API KEYS TAB ───── */}
            {activeTab === 'keys' && (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-bold text-text-primary">API Keys</h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">Manage API keys for AI providers and assign them to users</p>
                  </div>
                  <button
                    onClick={() => setShowNewKey(!showNewKey)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-all"
                  >
                    {showNewKey ? <X size={14} /> : <Plus size={14} />}
                    {showNewKey ? 'Cancel' : 'Add Key'}
                  </button>
                </div>

                {/* New Key Form */}
                {showNewKey && (
                  <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-5 space-y-4 animate-fade-in">
                    <h4 className="text-[13px] font-bold text-text-primary flex items-center gap-2">
                      <Key size={14} className="text-accent" />
                      Add New API Key
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5 block">Key Name</label>
                        <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. OpenAI Production" className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-[12px] text-text-primary outline-none focus:border-accent/30 placeholder:text-text-tertiary transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5 block">Provider</label>
                        <select value={newKeyProvider} onChange={(e) => setNewKeyProvider(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-[12px] text-text-primary outline-none focus:border-accent/30 transition-colors">
                          {['OpenAI', 'Stability AI', 'Replicate', 'Midjourney', 'Kling', 'Runway', 'Custom'].map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5 block">API Key</label>
                      <input type="text" value={newKeyValue} onChange={(e) => setNewKeyValue(e.target.value)} placeholder="sk-proj-xxxxxxxxxxxxxx" className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-[12px] text-text-primary outline-none focus:border-accent/30 placeholder:text-text-tertiary font-mono transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5 block">Assign To</label>
                      <div className="relative">
                        <div className="relative">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                          <input
                            type="text"
                            value={assignSearch || (newKeyAssign === 'all' ? 'All Users' : newKeyAssign)}
                            onChange={(e) => { setAssignSearch(e.target.value); setShowAssignDropdown(true); }}
                            onFocus={() => { setAssignSearch(''); setShowAssignDropdown(true); }}
                            placeholder="Search users..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface border border-border text-[12px] text-text-primary outline-none focus:border-accent/30 placeholder:text-text-tertiary transition-colors"
                          />
                        </div>
                        {showAssignDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border border-border rounded-xl shadow-dropdown overflow-hidden z-50 max-h-[200px] overflow-y-auto">
                            {filteredAssignOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  setNewKeyAssign(opt.value);
                                  setAssignSearch('');
                                  setShowAssignDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-surface-hover transition-colors ${newKeyAssign === opt.value ? 'bg-accent/5' : ''}`}
                              >
                                <div className="flex items-center gap-2">
                                  {opt.value === 'all' ? (
                                    <Globe size={14} className="text-accent" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
                                      {opt.label.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[11px] font-medium text-text-primary">{opt.label}</p>
                                    {opt.email && <p className="text-[9px] text-text-tertiary">{opt.email}</p>}
                                  </div>
                                </div>
                                {newKeyAssign === opt.value && <Check size={12} className="text-accent" />}
                              </button>
                            ))}
                            {filteredAssignOptions.length === 0 && (
                              <div className="px-4 py-3 text-[11px] text-text-tertiary text-center">No users found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end pt-1">
                      <button onClick={() => { setShowNewKey(false); setAssignSearch(''); }} className="px-4 py-2 rounded-lg text-[12px] text-text-secondary hover:text-text-primary transition-all">Cancel</button>
                      <button onClick={handleAddKey} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-all">
                        <Check size={12} /> Add Key
                      </button>
                    </div>
                  </div>
                )}

                {/* Keys List */}
                <div className="space-y-2">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4 hover:border-border transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${key.status === 'active' ? 'bg-accent/10 border-accent/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <Key size={16} className={key.status === 'active' ? 'text-accent' : 'text-red-400'} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-semibold text-text-primary">{key.name}</p>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-accent bg-accent/10 border border-accent/15">{key.provider}</span>
                              {key.status === 'expired' && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/15">EXPIRED</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-[11px] font-mono text-text-tertiary">
                                {key.isVisible ? key.key : '•'.repeat(Math.min(key.key.length, 24))}
                              </code>
                              <button onClick={() => toggleKeyVisibility(key.id)} className="p-1 rounded text-text-tertiary hover:text-text-primary transition-all">
                                {key.isVisible ? <EyeOff size={10} /> : <Eye size={10} />}
                              </button>
                              <button onClick={() => { navigator.clipboard.writeText(key.key).catch(() => {}); toast('API key copied!', 'success'); }} className="p-1 rounded text-text-tertiary hover:text-text-primary transition-all">
                                <Copy size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] text-text-tertiary">Assigned to</p>
                            <p className="text-[11px] text-text-primary font-medium flex items-center gap-1">
                              {key.assignedTo === 'all' ? <><Globe size={9} /> All Users</> : key.assignedTo}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-text-tertiary">Usage</p>
                            <p className="text-[11px] text-accent font-medium">{key.usageCount} calls</p>
                          </div>
                          <button onClick={() => handleDeleteKey(key.id)} className="p-2 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {apiKeys.length === 0 && (
                    <div className="text-center py-12 rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416]">
                      <Key size={28} className="text-text-tertiary mx-auto mb-3" />
                      <p className="text-[13px] text-text-tertiary">No API keys configured</p>
                      <p className="text-[11px] text-text-tertiary mt-1">Add a key to enable AI generation</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ───── SETTINGS TAB ───── */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in space-y-6 max-w-[700px]">
                <div>
                  <h3 className="text-[14px] font-bold text-text-primary mb-1">Platform Settings</h3>
                  <p className="text-[11px] text-text-tertiary">Configure global platform behavior</p>
                </div>

                {/* Toggle Settings */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                  <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                  <div className="px-5 py-4 border-b border-border/30">
                    <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-2"><Globe size={13} className="text-accent" /> General</h4>
                  </div>
                  <div className="divide-y divide-border/20">
                    {[
                      { key: 'registrationOpen' as const, label: 'Open Registration', desc: 'Allow new users to sign up' },
                      { key: 'maintenanceMode' as const, label: 'Maintenance Mode', desc: 'Show maintenance page to non-admin users' },
                      { key: 'autoApproveUsers' as const, label: 'Auto-Approve Users', desc: 'Automatically approve new user registrations' },
                      { key: 'enableCommunitySharing' as const, label: 'Community Sharing', desc: 'Allow users to share generations publicly' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <p className="text-[12px] font-medium text-text-primary">{setting.label}</p>
                          <p className="text-[10px] text-text-tertiary mt-0.5">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSettings((s) => ({ ...s, [setting.key]: !s[setting.key] }));
                            toast(`${setting.label} ${!settings[setting.key] ? 'enabled' : 'disabled'}`, 'info');
                          }}
                          className="relative"
                        >
                          <div className={`w-10 h-[22px] rounded-full transition-all duration-200 ${settings[setting.key] ? 'bg-accent' : 'bg-surface-active'}`}>
                            <div className={`absolute top-[3px] w-4 h-4 rounded-full shadow-sm transition-all duration-200 ${settings[setting.key] ? 'left-[22px] bg-white' : 'left-[3px] bg-white/70'}`} />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Toggles */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                  <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
                  <div className="px-5 py-4 border-b border-border/30">
                    <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-2"><Zap size={13} className="text-green-400" /> Generation Pipelines</h4>
                  </div>
                  <div className="divide-y divide-border/20">
                    {[
                      { key: 'enableVideoGeneration' as const, label: 'Video Generation', desc: 'Enable video generation pipeline' },
                      { key: 'enableAudioGeneration' as const, label: 'Audio Generation', desc: 'Enable audio/voiceover generation' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <p className="text-[12px] font-medium text-text-primary">{setting.label}</p>
                          <p className="text-[10px] text-text-tertiary mt-0.5">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSettings((s) => ({ ...s, [setting.key]: !s[setting.key] }));
                            toast(`${setting.label} ${!settings[setting.key] ? 'enabled' : 'disabled'}`, 'info');
                          }}
                          className="relative"
                        >
                          <div className={`w-10 h-[22px] rounded-full transition-all duration-200 ${settings[setting.key] ? 'bg-green-500' : 'bg-surface-active'}`}>
                            <div className={`absolute top-[3px] w-4 h-4 rounded-full shadow-sm transition-all duration-200 ${settings[setting.key] ? 'left-[22px] bg-white' : 'left-[3px] bg-white/70'}`} />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Numeric Settings */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                  <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                  <div className="px-5 py-4 border-b border-border/30">
                    <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-2"><Database size={13} className="text-amber-400" /> Limits & Defaults</h4>
                  </div>
                  <div className="divide-y divide-border/20">
                    {[
                      { key: 'maxGenerationsPerDay' as const, label: 'Max Generations / Day', desc: 'Limit per user per day', unit: 'gens' },
                      { key: 'defaultCredits' as const, label: 'Default Credits', desc: 'Credits for new users', unit: 'credits' },
                      { key: 'rateLimitPerMinute' as const, label: 'Rate Limit / Minute', desc: 'API calls per minute per user', unit: 'req/min' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <p className="text-[12px] font-medium text-text-primary">{setting.label}</p>
                          <p className="text-[10px] text-text-tertiary mt-0.5">{setting.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={settings[setting.key]}
                            onChange={(e) => setSettings((s) => ({ ...s, [setting.key]: parseInt(e.target.value) || 0 }))}
                            className="w-20 px-3 py-1.5 rounded-lg bg-surface border border-border text-[12px] text-text-primary text-right outline-none focus:border-accent/30 transition-colors"
                          />
                          <span className="text-[10px] text-text-tertiary w-12">{setting.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <div className="flex justify-end">
                  <button onClick={() => toast('Settings saved successfully!', 'success')} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-all active:scale-[0.98]">
                    <Check size={14} /> Save Settings
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </AppShell>
  );
}
