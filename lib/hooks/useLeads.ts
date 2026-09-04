"use client";

import { useEffect, useState, useCallback } from "react";
import { getLeads } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { Lead } from "@/lib/types";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { version } = useAppStore();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads();
      setLeads(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads, version]);

  return { leads, loading, error, refetch: fetchLeads };
}

export default useLeads;
