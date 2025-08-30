import React from 'react';

const Search: React.FC = () => {
  return (
    <div className="search-page">
      <h1 className="text-2xl font-bold">Search</h1>
      <input
        type="text"
        placeholder="Search for content..."
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <button className="ml-2 p-2 bg-blue-500 text-white rounded">Search</button>
      {/* Add search results display here */}
    </div>
  );
};

export default Search;