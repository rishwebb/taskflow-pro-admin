export type Role = 'admin' | 'user';
export type Priority = 'low' | 'medium' | 'high';

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  emailVerified?: boolean;
  disabled?: boolean;
  active?: boolean;
  createdAt: number;
  updatedAt?: number;
  lastLoginAt?: number | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: number;
  priority: Priority;
  completed: boolean;
  completedAt?: number | null;
  userId: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  createdAt: number;
  updatedAt?: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  taskId?: string | null;
  title: string;
  message: string;
  type: 'task_created' | 'task_completed' | 'task_updated' | 'task_deleted' | 'system';
  read: boolean;
  createdAt: number;
  updatedAt?: number;
}

export interface HealthStatus {
  service: string;
  status: string;
  database: string;
  timestamp: number;
  environment?: string;
  version?: string;
}

export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  recentRegistrations: User[];
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
  byPriority: Record<Priority, number>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ListUsersResponse {
  users: User[];
  pagination?: Pagination;
}

export interface ListTasksResponse {
  tasks: Task[];
  pagination?: Pagination;
}

export interface ListNotificationsResponse {
  notifications: NotificationItem[];
  unreadCount?: number;
  pagination?: Pagination;
}

export interface LoginResponse {
  accessToken: string;
  token?: string;
  user: User;
}

export interface SystemInfo {
  api: HealthStatus;
  environment: {
    nodeEnv?: string;
    apiBaseUrl: string;
    adminEndpointsAvailable: boolean;
  };
}
