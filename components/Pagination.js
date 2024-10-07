import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex items-center space-x-2">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="text-xs text-black"
            >
              &lt; Previous
            </button>
          </li>
        )}
        <li className="text-xs text-black">
          Page {currentPage} of {totalPages}
        </li>
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="text-xs text-black"
            >
              Next &gt;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
