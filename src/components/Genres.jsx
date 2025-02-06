import React from 'react';

const Genres = ({ genres, selectedGenre, setSelectedGenre }) => {
  return (
    <select
      value={selectedGenre}
      onChange={(e) => setSelectedGenre(e.target.value)}
      className="bg-gray-800 text-white border border-page-purple rounded p-2 shadow-light-100/10"
    >
      <option value="">Select Genre</option>
      {genres.map((genre) => (
        <option key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
};

export default Genres;