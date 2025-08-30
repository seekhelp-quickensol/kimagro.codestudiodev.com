// hooks/useMedia.js
import { useState, useEffect } from 'react';
import instance from '../utils/axiosInstance';



export const useMedia = (mediaType: string | null = null) => {
  const [mediaData, setMediaData] = useState({
    categories: [],
    mediaItems: {},
    tabs: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMediaData = async (type: string | null = null) => {
    setLoading(true);
    setError(null);

    try {
      const params: { media_type?: string } = {};
      if (type && type !== 'All') {
        params.media_type = type;
      }

      const response = await instance.get(`medmodules/media`, { params });

      if (response.data.success) {
        setMediaData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch media data');
      }
    } catch (err:any) {
      console.error('Error fetching media data:', err);
      setError(err.response?.data?.message || 'Failed to fetch media data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaData(mediaType);
  }, [mediaType]);

  return {
    mediaData,
    loading,
    error,
    refetch: fetchMediaData,
  };
};

export const useMediaByCategory = () => {
  const [categoryMedia, setCategoryMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
interface CategoryMediaResponse {
    success: boolean;
    data: any; // Replace `any` with the appropriate type if known
    message?: string;
}

const fetchCategoryMedia = async (categoryId: string | null): Promise<void> => {
    if (!categoryId) {
        setCategoryMedia([]);
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const response = await instance.get<CategoryMediaResponse>(`medmodules/category/${categoryId}`);

        if (response.data.success) {
            setCategoryMedia(response.data.data);
        } else {
            setError(response.data.message || 'Failed to fetch category media');
        }
    } catch (err: any) {
        console.error('Error fetching category media:', err);
        setError(err.response?.data?.message || 'Failed to fetch category media');
    } finally {
        setLoading(false);
    }
};

  return {
    categoryMedia,
    loading,
    error,
    fetchCategoryMedia,
  };
};