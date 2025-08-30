
import { useState, useEffect } from 'react';
import { Innovations, getInnovations } from '../services/service';

export const useInnovations = () => {
  const [innovations, setInnovations] = useState<Innovations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInnovations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getInnovations();
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

      const data = await response.data.data;
      console.log('Innovations data:', data);
      setInnovations(data);
    } catch (err:any) {
      setError(err.message);
      console.error('Error fetching innovations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInnovations();
  }, []);

  return {
    innovations,
    loading,
    error,
    refetch: fetchInnovations
  };
};