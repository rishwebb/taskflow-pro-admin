import { useCallback, useEffect, useState } from 'react';
import { adminService, type AdminDataset } from '../services/adminService';
import type { User } from '../types/api';

export const useAdminData = (user: User | null) => {
  const [data, setData] = useState<AdminDataset | null>(null);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const dataset = await adminService.loadDataset(user);
      setData(dataset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh, setData };
};
