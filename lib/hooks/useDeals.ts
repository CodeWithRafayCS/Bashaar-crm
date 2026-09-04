"use client";

import { useEffect, useState, useCallback } from "react";
import { getDeals } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { Deal } from "@/lib/types";

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { version } = useAppStore();

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeals();
      setDeals(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDeals();
  }, [fetchDeals, version]);

  return { deals, loading, error, refetch: fetchDeals };
}

export default useDeals;
