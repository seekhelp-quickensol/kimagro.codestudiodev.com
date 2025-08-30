
import { useState, useEffect } from 'react';
import { Banner, BannerResponse, getBanner } from '../services/service';

export const useBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getBanner();
     
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

      const data = response.data.data[0];
    
      setBanner(data);
    } catch (err:any) {
      setError(err.message);
      console.error('Error fetching banner:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  return {
    banner,
    loading,
    error,
    refetch: fetchBanner
  };
};