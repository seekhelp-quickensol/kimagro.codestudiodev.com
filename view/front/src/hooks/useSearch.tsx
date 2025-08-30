import { useState, useEffect } from 'react';
import axios from 'axios';
import instance from '../utils/axiosInstance';

interface SearchResult {
  categories: Array<{
    id: number;
    title_english: string;
    title_hindi: string;
    upload_img: string | null;
  }>;
  products: Array<{
    id: number;
    product_name_english: string;
    product_name_hindi: string;
    product_title_english: string;
    product_title_hindi: string;
    product_img: string | null;
    category: {
      id: number;
      title_english: string;
      title_hindi: string;
    };
  }>;
}

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult | null;
  isLoading: boolean;
  error: string | null;
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

const useSearch = (): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchQuery('');
      setSearchResults(null);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await instance.get('search', {
          params: { query: searchQuery },
        });
        setSearchResults(response.data);
      } catch (err) {
        // setError('Failed to fetch search results');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    isSearchOpen,
    toggleSearch,
  };
};

export default useSearch;