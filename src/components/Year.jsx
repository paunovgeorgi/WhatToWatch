import React from 'react';

const Year = ({ year, setYear }) => {
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  return (
    <select
      value={year}
      onChange={(e) => setYear(e.target.value)}
      className="selectable"
    >
      <option value="">Select Year</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default Year;