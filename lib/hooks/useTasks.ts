"use client";

import { useEffect, useState, useCallback } from "react";
import { getTasks } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { Task } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { version } = useAppStore();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks, version]);

  return { tasks, loading, error, refetch: fetchTasks };
}

export default useTasks;
