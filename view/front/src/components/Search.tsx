import { useTranslation } from 'react-i18next';
import useSearch from '../hooks/useSearch';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Search() {
  const { t } = useTranslation();
  const { isSearchOpen, toggleSearch, searchQuery, setSearchQuery, searchResults, isLoading, error } = useSearch();

  const searchRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      if (isSearchOpen) toggleSearch();
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isSearchOpen, toggleSearch]);



  return (
    <div className="relative">
      <button
        onClick={toggleSearch}
        className="flex items-center p-2 text-gray-800 hover:text-green-600 transition"
        aria-label={t('header.Search')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </button>

      {isSearchOpen && (
        <div className="absolute top-12 right-0 w-[300px] bg-white border rounded-lg shadow-lg p-4 z-50 md:w-[400px]" ref={searchRef}>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.Search products or categories')}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          {isLoading && <p className="mt-2 text-gray-600">{t('header.Loading')}</p>}
          {error && <p className="mt-2 text-red-500">{error}</p>}
          {searchResults && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              <h3 className="font-semibold">{t('header.Categories')}</h3>
              <div className="mt-2">
                {searchResults.categories && searchResults.categories.length > 0 ? (
                  searchResults.categories.map((category) => (
                    <Link to={`/product-categories/${category.id}`} key={category.id} className="py-1">
                      {category.title_english} ({category.title_hindi})
                    </Link>
                  ))
                ) : (
                  <li className="text-gray-500">{t('header.No categories found')}</li>
                )}
              </div>
              <h3 className="font-semibold mt-4">{t('header.Products')}</h3>
              <div className="mt-2">
                {searchResults.products && searchResults.products.length > 0 ? (
                  searchResults.products.map((product) => (
                    <Link to={`/product-details/${product.id}`} key={product.id} className="py-1">
                      {product.product_name_english} ({product.product_name_hindi}) -{' '}
                      {t('header.Category')}: {product.category?.title_english || t('header.Unknown')}
                      </Link>
                  ))
                ) : (
                  <li className="text-gray-500">{t('header.No products found')}</li>
                )}
            </div>
            </div>
          )}
          {!isLoading && !error && !searchResults && searchQuery && (
            <p className="mt-2 text-gray-500">{t('header.No results found')}</p>
          )}
        </div>
      )}
    </div>
  );
}