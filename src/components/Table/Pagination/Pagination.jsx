import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Pagination = ({ dataCount, currentPage, setPage }) => {
  const totalPages = Math.ceil(dataCount / 10);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container d-flex align-items-center justify-content-between">
      <div className="list-div">{`${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, dataCount)} of ${dataCount} List`}</div>
      <div className="page-count d-flex align-items-center justify-content-end">
        <button
          className={`box-size d-flex align-items-center justify-content-center arrow-left ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.1599 7.41L10.5799 12L15.1599 16.59L13.7499 18L7.74991 12L13.7499 6L15.1599 7.41Z"
              fill="#C4CDD5"
            />
          </svg>
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`box-size d-flex align-items-center justify-content-center number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => setPage(index + 1)}
            aria-label={`Page ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`box-size d-flex align-items-center justify-content-center arrow-right ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.83997 7.41L13.42 12L8.83997 16.59L10.25 18L16.25 12L10.25 6L8.83997 7.41Z"
              fill="#C4CDD5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  dataCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default Pagination;
