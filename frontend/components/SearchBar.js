import React from 'react';

const SearchBar = ({ handleSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
        className="h-8 p-2 text-sm text-black bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;
