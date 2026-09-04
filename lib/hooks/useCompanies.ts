"use client";

import { useEffect, useState, useCallback } from "react";
import { getCompanies } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { Company } from "@/lib/types";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { version } = useAppStore();

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompanies();
      setCompanies(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies, version]);

  return { companies, loading, error, refetch: fetchCompanies };
}

export default useCompanies;
