"use client";

import { useEffect, useState, useCallback } from "react";
import { getActivities } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { Activity } from "@/lib/types";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { version } = useAppStore();

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchActivities();
  }, [fetchActivities, version]);

  return { activities, loading, error, refetch: fetchActivities };
}

export default useActivities;
