
import { useEffect, useState } from "react";
import { useParams } from "react-router";

// Generic type for API response structure
interface ApiResponse<T> {
  data: {
    data: T;
  };
}

// Generic fetch function type
type FetchFunction<T> = (id: string) => Promise<ApiResponse<T>>;

// Transform function type - converts API data to form values
type TransformFunction<T, F> = (data: T) => F;

// Hook configuration options
interface UseFetchDataByIdOptions<T, F> {
  fetchFunction: FetchFunction<T>;
  transformToFormValues: TransformFunction<T, F>;
  resetForm: (values: F) => void;
  paramName?: string; // defaults to 'id'
  errorMessage?: string; // custom error message prefix
}

// Hook return type
interface UseFetchDataByIdReturn {
  loading: boolean;
  error: string;
  refetch: () => void;
}

export default function useFetchDataById<T, F>({
  fetchFunction,
  transformToFormValues,
  resetForm,
  paramName = 'id',
  errorMessage = 'Failed to fetch data'
}: UseFetchDataByIdOptions<T, F>): UseFetchDataByIdReturn {
  const params = useParams();
  const id = params[paramName];
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!id) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetchFunction(id);
      const data = response.data.data;
      const formValues = transformToFormValues(data);
      resetForm(formValues);
    } catch (err) {
      let msg = errorMessage;
      if (err instanceof Error) {
        msg = `${errorMessage}: ${err.message}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Only depend on id, other dependencies are stable

  return { 
    loading, 
    error, 
    refetch: fetchData 
  };
}