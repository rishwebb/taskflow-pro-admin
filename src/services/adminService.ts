import { API_BASE_URL } from '../lib/config';
import { apiClient, ApiError } from './apiClient';
import type {
  HealthStatus,
  ListNotificationsResponse,
  ListTasksResponse,
  ListUsersResponse,
  NotificationItem,
  OverviewStats,
  SystemInfo,
  Task,
  TaskStats,
  User
} from '../types/api';

export interface AdminDataset {
  overview: OverviewStats;
  taskStats: TaskStats;
  users: User[];
  tasks: Task[];
  notifications: NotificationItem[];
  health: HealthStatus | null;
  system: SystemInfo | null;
  adminEndpointsAvailable: boolean;
  warnings: string[];
}

const emptyTaskStats: TaskStats = {
  total: 0,
  completed: 0,
  active: 0,
  overdue: 0,
  dueToday: 0,
  completionRate: 0,
  byPriority: { low: 0, medium: 0, high: 0 }
};

const unavailable = (error: unknown) => error instanceof ApiError && [404, 405, 501].includes(error.status);

const deriveOverview = (users: User[], tasks: Task[], taskStats: TaskStats): OverviewStats => ({
  totalUsers: users.length,
  activeUsers: users.filter((user) => user.active !== false && user.disabled !== true).length,
  totalTasks: taskStats.total || tasks.length,
  completedTasks: taskStats.completed || tasks.filter((task) => task.completed).length,
  highPriorityTasks: taskStats.byPriority.high || tasks.filter((task) => task.priority === 'high').length,
  recentRegistrations: [...users].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6)
});

const tryRequest = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await apiClient.get<T>(path);
    return response.data;
  } catch (error) {
    if (unavailable(error)) return null;
    throw error;
  }
};

export const adminService = {
  async getHealth() {
    const response = await apiClient.get<HealthStatus>('/health', false);
    return response.data;
  },

  async getOverview() {
    return tryRequest<{ overview?: OverviewStats; stats?: OverviewStats }>('/api/admin/overview');
  },

  async getUsers(search = '') {
    const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
    return tryRequest<ListUsersResponse>(`/api/admin/users${suffix}`);
  },

  async getUserDetails(id: string) {
    return tryRequest<{ user: User }>(`/api/admin/users/${id}`);
  },

  async disableUser(id: string) {
    const response = await apiClient.patch<{ user: User }>(`/api/admin/users/${id}/disable`);
    return response.data.user;
  },

  async deleteUser(id: string) {
    await apiClient.delete(`/api/admin/users/${id}`);
  },

  async getTasks(search = '') {
    const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
    return tryRequest<ListTasksResponse>(`/api/admin/tasks${suffix}`);
  },

  async deleteTask(id: string) {
    await apiClient.delete(`/api/admin/tasks/${id}`);
  },

  async getSystemNotifications() {
    return tryRequest<ListNotificationsResponse>('/api/admin/notifications');
  },

  async getSystemInfo() {
    return tryRequest<SystemInfo>('/api/admin/system');
  },

  async getCurrentUserTasks() {
    const response = await apiClient.get<ListTasksResponse>('/api/tasks?limit=100');
    return response.data.tasks;
  },

  async getCurrentTaskStats() {
    const response = await apiClient.get<{ stats: TaskStats }>('/api/tasks/stats');
    return response.data.stats;
  },

  async getCurrentNotifications() {
    const response = await apiClient.get<ListNotificationsResponse>('/api/notifications?limit=50');
    return response.data.notifications;
  },

  async loadDataset(currentAdmin: User): Promise<AdminDataset> {
    const warnings: string[] = [];
    const health = await this.getHealth().catch(() => null);

    const [adminOverview, adminUsers, adminTasks, adminNotifications, adminSystem] = await Promise.all([
      this.getOverview(),
      this.getUsers(),
      this.getTasks(),
      this.getSystemNotifications(),
      this.getSystemInfo()
    ]);

    const adminEndpointsAvailable = Boolean(adminOverview || adminUsers || adminTasks || adminNotifications || adminSystem);

    let users = adminUsers?.users || [];
    let tasks = adminTasks?.tasks || [];
    let notifications = adminNotifications?.notifications || [];
    let taskStats = emptyTaskStats;

    if (!adminEndpointsAvailable) {
      warnings.push('Admin collection endpoints are not available on the current backend. Showing authenticated admin scope.');
      users = [currentAdmin];
      tasks = await this.getCurrentUserTasks().catch(() => []);
      taskStats = await this.getCurrentTaskStats().catch(() => emptyTaskStats);
      notifications = await this.getCurrentNotifications().catch(() => []);
    } else {
      taskStats = {
        ...emptyTaskStats,
        total: tasks.length,
        completed: tasks.filter((task) => task.completed).length,
        active: tasks.filter((task) => !task.completed).length,
        completionRate: tasks.length ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0,
        byPriority: {
          low: tasks.filter((task) => task.priority === 'low').length,
          medium: tasks.filter((task) => task.priority === 'medium').length,
          high: tasks.filter((task) => task.priority === 'high').length
        }
      };
    }

    const overview = adminOverview?.overview || adminOverview?.stats || deriveOverview(users, tasks, taskStats);
    const system = adminSystem || {
      api: health || {
        service: 'TaskFlow Pro API',
        status: 'unknown',
        database: 'unknown',
        timestamp: Date.now()
      },
      environment: {
        apiBaseUrl: API_BASE_URL,
        adminEndpointsAvailable
      }
    };

    return {
      overview,
      taskStats,
      users,
      tasks,
      notifications,
      health,
      system,
      adminEndpointsAvailable,
      warnings
    };
  }
};
