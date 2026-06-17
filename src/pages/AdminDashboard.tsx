import { useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  CheckCircle2,
  Clock3,
  Database,
  LayoutDashboard,
  ListChecks,
  LogOut,
  RefreshCcw,
  Server,
  Shield,
  Trash2,
  UserRound,
  Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { CompletionDonut, PriorityBars } from '../components/Charts';
import { DataTable, type Column } from '../components/DataTable';
import { SearchBox } from '../components/SearchBox';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { useAdminData } from '../hooks/useAdminData';
import { formatDate, formatDateTime, initials } from '../lib/format';
import { API_BASE_URL } from '../lib/config';
import { adminService } from '../services/adminService';
import type { NotificationItem, Task, User } from '../types/api';

type Section = 'overview' | 'users' | 'tasks' | 'notifications' | 'system';

const navItems: Array<{ id: Section; label: string; Icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'users', label: 'Users', Icon: Users },
  { id: 'tasks', label: 'Tasks', Icon: ListChecks },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'system', label: 'System', Icon: Server }
];

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { data, loading, error, refresh, setData } = useAdminData(user);
  const [section, setSection] = useState<Section>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return data?.users || [];
    return (data?.users || []).filter((item) =>
      [item.name, item.email, item.phone || '', item.role].some((value) => value.toLowerCase().includes(query))
    );
  }, [data?.users, userSearch]);

  const filteredTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();
    if (!query) return data?.tasks || [];
    return (data?.tasks || []).filter((task) =>
      [task.title, task.description, task.priority, task.user?.email || task.userId].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [data?.tasks, taskSearch]);

  const disableUser = async (id: string) => {
    setActionError(null);
    try {
      const updated = await adminService.disableUser(id);
      setData((current) =>
        current
          ? {
              ...current,
              users: current.users.map((item) => (item.id === id ? updated : item))
            }
          : current
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to disable user');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    setActionError(null);
    try {
      await adminService.deleteUser(id);
      setData((current) =>
        current
          ? {
              ...current,
              users: current.users.filter((item) => item.id !== id)
            }
          : current
      );
      if (selectedUser?.id === id) setSelectedUser(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to delete user');
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;
    setActionError(null);
    try {
      await adminService.deleteTask(id);
      setData((current) =>
        current
          ? {
              ...current,
              tasks: current.tasks.filter((task) => task.id !== id)
            }
          : current
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to delete task');
    }
  };

  if (!user) return null;

  const userColumns: Array<Column<User>> = [
    {
      key: 'user',
      header: 'User',
      render: (item) => (
        <button onClick={() => setSelectedUser(item)} className="flex items-center gap-3 text-left">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
            {initials(item.name)}
          </span>
          <span>
            <span className="block font-bold text-ink-900">{item.name}</span>
            <span className="block text-xs text-ink-500">{item.email}</span>
          </span>
        </button>
      )
    },
    { key: 'role', header: 'Role', render: (item) => <StatusBadge label={item.role} tone={item.role === 'admin' ? 'admin' : 'neutral'} /> },
    { key: 'created', header: 'Registered', render: (item) => formatDate(item.createdAt) },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <StatusBadge
          label={item.disabled ? 'Disabled' : item.emailVerified === false ? 'Unverified' : 'Active'}
          tone={item.disabled ? 'danger' : item.emailVerified === false ? 'warning' : 'success'}
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => void disableUser(item.id)}
            className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-bold text-ink-700 hover:border-amber-300 hover:text-amber-700"
          >
            Disable
          </button>
          <button
            onClick={() => void deleteUser(item.id)}
            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const taskColumns: Array<Column<Task>> = [
    {
      key: 'task',
      header: 'Task',
      render: (task) => (
        <div className="max-w-[360px]">
          <p className="truncate font-bold text-ink-900">{task.title}</p>
          <p className="truncate text-xs text-ink-500">{task.description || 'No description'}</p>
        </div>
      )
    },
    { key: 'owner', header: 'Owner', render: (task) => task.user?.email || task.userId },
    {
      key: 'priority',
      header: 'Priority',
      render: (task) => (
        <StatusBadge label={task.priority} tone={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'} />
      )
    },
    { key: 'due', header: 'Due', render: (task) => formatDate(task.dueDate) },
    {
      key: 'complete',
      header: 'State',
      render: (task) => <StatusBadge label={task.completed ? 'Completed' : 'Active'} tone={task.completed ? 'success' : 'neutral'} />
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (task) => (
        <button
          onClick={() => void deleteTask(task.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      )
    }
  ];

  const notificationColumns: Array<Column<NotificationItem>> = [
    { key: 'title', header: 'Notification', render: (item) => <span className="font-bold text-ink-900">{item.title}</span> },
    { key: 'message', header: 'Message', render: (item) => <span className="block max-w-lg truncate">{item.message}</span> },
    { key: 'type', header: 'Type', render: (item) => <StatusBadge label={item.type.replace(/_/g, ' ')} tone="neutral" /> },
    { key: 'date', header: 'Created', render: (item) => formatDateTime(item.createdAt) }
  ];

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ink-200 bg-white px-5 py-6 lg:block">
        <BrandMark />
        <nav className="mt-8 space-y-1">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
                section === id ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="lg:hidden">
              <BrandMark compact />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-ink-500">Operations</p>
              <h1 className="text-xl font-bold text-ink-900">{navItems.find((item) => item.id === section)?.label}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void refresh()}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 text-sm font-bold text-ink-700 hover:bg-ink-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
              <button
                onClick={() => void logout()}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink-900 px-3 text-sm font-bold text-white hover:bg-ink-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`h-9 shrink-0 rounded-lg px-3 text-sm font-bold ${
                  section === id ? 'bg-brand-600 text-white' : 'border border-ink-200 bg-white text-ink-700'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {loading && <div className="rounded-lg border border-ink-200 bg-white p-6 font-semibold text-ink-600 shadow-panel">Loading admin data</div>}
          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 font-semibold text-rose-700">{error}</div>}
          {actionError && <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-700">{actionError}</div>}
          {data?.warnings.map((warning) => (
            <div key={warning} className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              {warning}
            </div>
          ))}

          {data && section === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Total Users" value={data.overview.totalUsers} Icon={Users} accent="bg-brand-50 text-brand-700" />
                <StatCard label="Active Users" value={data.overview.activeUsers} Icon={Activity} accent="bg-mint-500/10 text-mint-600" />
                <StatCard label="Total Tasks" value={data.overview.totalTasks} Icon={ListChecks} accent="bg-ink-100 text-ink-700" />
                <StatCard label="Completed Tasks" value={data.overview.completedTasks} Icon={CheckCircle2} accent="bg-emerald-50 text-emerald-700" />
                <StatCard label="High Priority" value={data.overview.highPriorityTasks} Icon={Clock3} accent="bg-rose-50 text-rose-700" />
              </div>

              <div className="grid gap-6 xl:grid-cols-[360px_1fr_1fr]">
                <CompletionDonut stats={data.taskStats} />
                <PriorityBars stats={data.taskStats} />
                <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-panel">
                  <h2 className="text-base font-bold text-ink-900">Recent Registrations</h2>
                  <div className="mt-5 space-y-4">
                    {data.overview.recentRegistrations.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                            {initials(item.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-ink-900">{item.name}</p>
                            <p className="truncate text-xs text-ink-500">{item.email}</p>
                          </div>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-ink-500">{formatDate(item.createdAt)}</span>
                      </div>
                    ))}
                    {data.overview.recentRegistrations.length === 0 && <p className="text-sm font-medium text-ink-500">No registrations</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {data && section === 'users' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SearchBox value={userSearch} onChange={setUserSearch} placeholder="Search users" />
                <StatusBadge label={`${filteredUsers.length} users`} tone="neutral" />
              </div>
              <DataTable columns={userColumns} data={filteredUsers} getKey={(item) => item.id} emptyLabel="No users found" />
              {selectedUser && (
                <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-panel">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-ink-900">{selectedUser.name}</h2>
                      <p className="mt-1 text-sm font-medium text-ink-500">{selectedUser.email}</p>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-bold text-ink-700">
                      Close
                    </button>
                  </div>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail label="Phone" value={selectedUser.phone || 'Not set'} />
                    <Detail label="Role" value={selectedUser.role} />
                    <Detail label="Registered" value={formatDate(selectedUser.createdAt)} />
                    <Detail label="Last Login" value={formatDateTime(selectedUser.lastLoginAt)} />
                  </dl>
                </div>
              )}
            </div>
          )}

          {data && section === 'tasks' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SearchBox value={taskSearch} onChange={setTaskSearch} placeholder="Search tasks" />
                <StatusBadge label={`${filteredTasks.length} tasks`} tone="neutral" />
              </div>
              <DataTable columns={taskColumns} data={filteredTasks} getKey={(task) => task.id} emptyLabel="No tasks found" />
            </div>
          )}

          {data && section === 'notifications' && (
            <DataTable columns={notificationColumns} data={data.notifications} getKey={(item) => item.id} emptyLabel="No notifications found" />
          )}

          {data && section === 'system' && (
            <div className="grid gap-5 lg:grid-cols-3">
              <SystemPanel
                title="API Health"
                Icon={Activity}
                rows={[
                  ['Service', data.health?.service || 'TaskFlow Pro API'],
                  ['Status', data.health?.status || 'unknown'],
                  ['Checked', formatDateTime(data.health?.timestamp)]
                ]}
              />
              <SystemPanel
                title="Database"
                Icon={Database}
                rows={[
                  ['Status', data.health?.database || 'unknown'],
                  ['Base URL', API_BASE_URL],
                  ['Admin API', data.adminEndpointsAvailable ? 'available' : 'not available']
                ]}
              />
              <SystemPanel
                title="Environment"
                Icon={Shield}
                rows={[
                  ['Frontend', import.meta.env.MODE],
                  ['Backend', data.system?.environment.nodeEnv || data.health?.environment || 'not exposed'],
                  ['Build', data.system?.api.version || 'local']
                ]}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">{label}</dt>
    <dd className="mt-1 break-words text-sm font-semibold text-ink-900">{value}</dd>
  </div>
);

const SystemPanel = ({
  title,
  Icon,
  rows
}: {
  title: string;
  Icon: LucideIcon;
  rows: Array<[string, string]>;
}) => (
  <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-panel">
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-base font-bold text-ink-900">{title}</h2>
    </div>
    <dl className="mt-5 space-y-4">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-4 border-t border-ink-100 pt-4">
          <dt className="text-sm font-medium text-ink-500">{label}</dt>
          <dd className="max-w-[60%] break-words text-right text-sm font-bold text-ink-900">{value}</dd>
        </div>
      ))}
    </dl>
  </div>
);
