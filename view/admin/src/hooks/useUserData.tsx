import { useEffect, useState } from "react";
 
import { getAllUsers } from "../components/services/serviceApi";

// User Interface
export interface User {
  id: number;
  first_name: string;
  middle_name: string;
  lastName: string;
  department: string;
  designation: string;
  email: string;
  username: string;
}

// Hook Return Type
interface UseUserDataResult {
  data: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Custom Hook
export function useUserData(apiUrl: string): UseUserDataResult {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
        // const response = await instance.get(apiUrl, {});
        const response = await getAllUsers();
      if (Array.isArray(response.data)) {
        setData(response.data);
      }
      else {
        console.warn("Expected array but got:", response.data);
        setData([]); // fallback to empty array
      }

    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  return { data, loading, error, refetch: fetchData };
}