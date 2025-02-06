import React from 'react';

const Rating = ({ rating, setRating }) => {
  const ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <select
      value={rating}
      onChange={(e) => setRating(e.target.value)}
      className="selectable"
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