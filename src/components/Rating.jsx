import React from 'react';

const Rating = ({ rating, setRating }) => {
  const ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <select
      value={rating}
      onChange={(e) => setRating(e.target.value)}
      className="bg-gray-800 text-white border border-page-purple rounded p-2 shadow-light-100/10"
    >
      <option value="">Select Rating</option>
      {ratings.map((rate) => (
        <option key={rate} value={rate}>
          {rate}
        </option>
      ))}
    </select>
  );
};

export default Rating;