import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  const maxButtons = 5; // Maximum number of buttons to display
  const halfMaxButtons = Math.floor(maxButtons / 2);

  let startPage = Math.max(1, page - halfMaxButtons);
  let endPage = Math.min(totalPages, page + halfMaxButtons);

  if (page <= halfMaxButtons) {
    endPage = Math.min(totalPages, maxButtons);
  } else if (page + halfMaxButtons >= totalPages) {
    startPage = Math.max(1, totalPages - maxButtons + 1);
  }

  return (
    <div className="flex space-x-2">
      {startPage > 1 && (
        <>
          <button
            onClick={() => setPage(1)}
            className={`px-4 py-2 rounded ${
              1 === page ? "bg-yellow-500 text-white" : "bg-dark-100 text-white cursor-pointer"
            }`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 text-light-100">...</span>}
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((i) => (
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-4 py-2 rounded ${
            i === page ? "bg-page-purple shadow-light-100/10 text-white" : "bg-dark-100 text-white cursor-pointer"
          }`}
        >
          {i}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-light-100">...</span>}
          <button
            onClick={() => setPage(totalPages)}
            className={`px-4 py-2 rounded ${
              totalPages === page ? "bg-blue-500 text-white" : "bg-dark-100 text-white cursor-pointer"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
