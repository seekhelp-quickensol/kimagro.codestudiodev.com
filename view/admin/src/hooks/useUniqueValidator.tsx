import { useState, useEffect, useRef } from "react";
import instance from "../utils/axiosInstance";

interface UseUniqueValidatorOptions {
  endpoint: string; // e.g. "/api/check-department"
  queryKey?: string; // e.g. "name"
  debounceMs?: number;
}

export function useUniqueValidator(options: UseUniqueValidatorOptions) {
  const { endpoint, queryKey = "value", debounceMs = 100 } = options;

  const [isUnique, setIsUnique] = useState(true);
  const [checking, setChecking] = useState(false);
  const [value, setValue] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const checkUniqueness = (input: string) => {
    setValue(input);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchUniqueness(input);
    }, debounceMs);
  };

  const fetchUniqueness = async (input: string) => {
    setChecking(true);
    try {
      const res = await instance(`${endpoint}?${queryKey}=${encodeURIComponent(input)}`);
      const data =  res.data;
      setIsUnique(data.isUnique ?? true); // fallback to true
     
    } catch (err) {
      setIsUnique(true); // fail-safe
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return { isUnique, checking, checkUniqueness, value };
}